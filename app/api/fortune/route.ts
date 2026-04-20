import { NextRequest } from 'next/server'

export const maxDuration = 60
import OpenAI from 'openai'
import { calculateBazi } from '@/lib/bazi'
import { getSunSign } from '@/lib/astrology'
import { calcNumerology } from '@/lib/numerology'
import { drawThreeCards } from '@/lib/tarot'
import { calculateZiwei } from '@/lib/ziwei'
import { drawLiuyao } from '@/lib/liuyao'
import { drawMeihua } from '@/lib/meihua'
import { drawRunes } from '@/lib/runes'
import { calculateHumanDesign } from '@/lib/humandesign'
import { calculateVedic } from '@/lib/vedic'
import { analyzeXingming } from '@/lib/xingming'
import { createRng, buildSeed } from '@/lib/seeded-random'
import type { UserInput, FullReading } from '@/types'

const PERIOD_TEXT    = { today: '今日', month: '本月', year: '今年', life: '终生人生' }
const PERIOD_TEXT_EN = { today: 'Daily', month: 'Monthly', year: 'Annual', life: 'Lifetime' }

export async function POST(req: NextRequest) {
  const input: UserInput = await req.json()
  const { name, birthYear, birthMonth, birthDay, birthHour, gender, period, country, city } = input
  const isEN = input.lang === 'en'
  const ALL_SLUGS = ['bazi','astrology','tarot','ziwei','numerology','lucky','liuyao','meihua','runes','humandesign','vedic','xingming']
  const selectedSystems: string[] = input.systems ?? ALL_SLUGS
  const has = (s: string) => selectedSystems.includes(s)

  const enc = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`))

      try {
        // ── Step 1: 本地命理计算（约 <1s）─────────────────
        send({ type: 'progress', step: isEN ? 'Calculating charts…' : '命盘排盘中…', pct: 15 })

        // 种子 RNG：同一天同一人同一周期 → 牌面完全一致
        const rng = createRng(buildSeed(birthYear, birthMonth, birthDay, period))

        const [bazi, liuyao, meihua, runes, humanDesign, vedic] = await Promise.all([
          calculateBazi(birthYear, birthMonth, birthDay, birthHour),
          Promise.resolve(drawLiuyao(rng)),
          Promise.resolve(drawMeihua(birthYear, birthMonth, birthDay, birthHour)),
          Promise.resolve(drawRunes(3, rng)),
          Promise.resolve(calculateHumanDesign(birthYear, birthMonth, birthDay, birthHour)),
          Promise.resolve(calculateVedic(birthYear, birthMonth, birthDay, birthHour)),
        ])

        const sunSign    = getSunSign(birthMonth, birthDay)
        const numerology = calcNumerology(birthYear, birthMonth, birthDay)
        const tarotCards = drawThreeCards(rng)
        const ziwei      = calculateZiwei(birthMonth, birthHour, gender === 'undisclosed' ? 'female' : gender)
        const xingming   = analyzeXingming(name)

        // ── Step 2: 构建 AI prompt ────────────────────────
        send({ type: 'progress', step: isEN ? 'Consulting the oracle…' : 'AI 正在解读命理…', pct: 30 })

        const { context, questions } = input
        const periodLabel = isEN ? PERIOD_TEXT_EN[period] : PERIOD_TEXT[period]
        const weakStr = bazi.weakElements.length > 0 ? bazi.weakElements.join('、') : (isEN ? 'balanced' : '五行较均衡')
        const tarotStr = tarotCards.map(c =>
          `${c.position}:${c.card.nameCN}(${c.orientation})`
        ).join(';')
        const runesStr = runes.draws.map(d => `${d.rune.nameCN}(${d.reversed ? 'rev' : 'up'})`).join(';')
        const hasQuestions = questions && questions.filter(q => q.trim()).length > 0
        const cleanQuestions = (questions ?? []).filter(q => q.trim())

        const locationStr = city ? `${city}, ${country ?? ''}` : (country ?? '')
        const userPrompt = isEN ? `
=== Divination Profile ===
Name: ${name} | Born: ${birthYear}-${birthMonth}-${birthDay}${birthHour !== null ? ` ${birthHour}h` : ''} | ${gender}${locationStr ? ` | Location: ${locationStr}` : ''}
${context?.trim() ? `Context: ${context.trim()}\n` : ''}
Active systems: ${selectedSystems.join(', ')}
${has('bazi') ? `BaZi: ${bazi.yearPillar.full} ${bazi.monthPillar.full} ${bazi.dayPillar.full} ${bazi.hourPillar?.full ?? '?'}
Elements: Wood${bazi.elements['木']} Fire${bazi.elements['火']} Earth${bazi.elements['土']} Metal${bazi.elements['金']} Water${bazi.elements['水']} (weak:${weakStr}, strong:${bazi.dominantElement})` : ''}
${has('astrology') ? `Sun Sign: ${sunSign}` : ''}
${has('numerology') ? `Life#: ${numerology.lifePathNumber}` : ''}
${has('ziwei') ? `Zi Wei: ${ziwei.palaceName} palace, ${ziwei.mainStar}` : ''}
${has('liuyao') ? `Liu Yao: ${liuyao.benGua.name}${liuyao.bianGua ? '→' + liuyao.bianGua.name : ''}` : ''}
${has('vedic') ? `Vedic: ${vedic.moonRashi.nameCN}, ${vedic.nakshatra.nameCN}, ${vedic.currentDasha.nameCN}` : ''}
${has('tarot') ? `Tarot: ${tarotStr}` : ''}
${has('runes') ? `Runes: ${runesStr}` : ''}
${has('humandesign') ? `Human Design: ${humanDesign.type}, ${humanDesign.profile}, ${humanDesign.authority}` : ''}
Period: ${periodLabel}
${hasQuestions ? `Questions:\n${cleanQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n` : ''}
Return JSON only:
{
  "overallScore": 1-100,
  "categories": {
    "career": {"score":int,"label":"Career","trend":"up|stable|down","summary":"2 sentences"},
    "wealth": {"score":int,"label":"Wealth","trend":"...","summary":"..."},
    "love":   {"score":int,"label":"Love","trend":"...","summary":"..."},
    "health": {"score":int,"label":"Health","trend":"...","summary":"..."},
    "luck":   {"score":int,"label":"Luck","trend":"...","summary":"..."}
  },
  "summary": [
    {"title":"Overall Energy","body":"2-3 sentences"},
    {"title":"East-West Resonance","body":"2 sentences"},
    {"title":"Opportunities & Challenges","body":"2 sentences"},
    {"title":"Guidance","body":"2 sentences"}
  ],${hasQuestions ? `
  "answers": [{"question":"q","answer":"2-3 sentences"}],` : ''}
  "luckyItems": [
    {"name":"Amethyst Bracelet","nameEN":"Amethyst Bracelet","reason":"Calms the mind and attracts wisdom, strengthening the Metal element to boost career focus.","searchQuery":"amethyst crystal healing bracelet women","category":"crystal","boosts":"career"},
    {"name":"Forest Green Dress","nameEN":"Forest Green Dress","reason":"Wood-element green revitalizes growth energy and attracts new connections.","searchQuery":"forest green flowy midi dress women","category":"clothing","boosts":"luck"},
    {"name":"Red Date Longan Tea","nameEN":"Red Date Longan Tea","reason":"Nourishes the Fire element, warms the heart, and enhances emotional warmth and love luck.","searchQuery":"red date longan wolfberry tea recipe","category":"food","boosts":"love"},
    {"name":"...","nameEN":"...","reason":"...","searchQuery":"...","category":"jewelry|plant|symbol|number|color|other","boosts":"wealth"},
    {"name":"...","nameEN":"...","reason":"...","searchQuery":"...","category":"jewelry|plant|symbol|number|color|other","boosts":"health"},
    {"name":"...","nameEN":"...","reason":"...","searchQuery":"...","category":"jewelry|plant|symbol|number|color|other","boosts":"career|wealth|love|health|luck"}
  ]
}
Replace ALL 6 items with real personalized recommendations based on the user's BaZi and weak elements. Keep exactly this structure: 6 items, including exactly 1 "clothing" and exactly 1 "food". Every item must have "boosts" filled. No two items should share the same boosts value if possible. searchQuery must be a specific product or recipe name, not just a material.`
        : `
=== 命理档案 ===
姓名：${name} | 出生：${birthYear}-${birthMonth}-${birthDay}${birthHour !== null ? ` ${birthHour}时` : ''} | ${gender === 'male' ? '男' : gender === 'female' ? '女' : '不披露'}${locationStr ? ` | 所在地：${locationStr}` : ''}
${context?.trim() ? `当前状况：${context.trim()}\n` : ''}
启用体系：${selectedSystems.join('、')}
${has('bazi') ? `八字：${bazi.yearPillar.full} ${bazi.monthPillar.full} ${bazi.dayPillar.full} ${bazi.hourPillar?.full ?? '?'}
五行：木${bazi.elements['木']} 火${bazi.elements['火']} 土${bazi.elements['土']} 金${bazi.elements['金']} 水${bazi.elements['水']}（弱：${weakStr}，旺：${bazi.dominantElement}）` : ''}
${has('astrology') ? `星座：${sunSign} | 生肖：${bazi.chineseZodiac}` : ''}
${has('numerology') ? `生命数：${numerology.lifePathNumber}` : ''}
${has('ziwei') ? `紫微：${ziwei.palaceName}宫 ${ziwei.mainStar}` : ''}
${has('liuyao') ? `六爻：${liuyao.benGua.name}${liuyao.bianGua ? '→' + liuyao.bianGua.name : ''}` : ''}
${has('vedic') ? `吠陀：${vedic.moonRashi.nameCN} ${vedic.nakshatra.nameCN} ${vedic.currentDasha.nameCN}` : ''}
${has('tarot') ? `塔罗：${tarotStr}` : ''}
${has('runes') ? `符文：${runesStr}` : ''}
${has('humandesign') ? `人类图：${humanDesign.typeCN} ${humanDesign.profile} ${humanDesign.authority}` : ''}
运势周期：${periodLabel}
${hasQuestions ? `用户问题：\n${cleanQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n` : ''}
请综合以上各体系给出${periodLabel}运势，返回 JSON（仅 JSON）：
{
  "overallScore": 1-100整数,
  "categories": {
    "career": {"score":整数,"label":"事业运","trend":"up|stable|down","summary":"2句"},
    "wealth": {"score":整数,"label":"财运","trend":"...","summary":"..."},
    "love":   {"score":整数,"label":"感情运","trend":"...","summary":"..."},
    "health": {"score":整数,"label":"健康运","trend":"...","summary":"..."},
    "luck":   {"score":整数,"label":"整体运势","trend":"...","summary":"..."}
  },
  "summary": [
    {"title":"整体气场","body":"2-3句"},
    {"title":"东西方共鸣","body":"2句"},
    {"title":"机遇与挑战","body":"2句"},
    {"title":"给你的建议","body":"2句"}
  ],${hasQuestions ? `
  "answers": [{"question":"原题","answer":"2-3句命理解答"}],` : ''}
  "luckyItems": [
    {"name":"紫水晶手链","nameEN":"Amethyst Bracelet","reason":"镇定心神，强化金属元素，提升事业专注力。","searchQuery":"amethyst crystal healing bracelet women","category":"crystal","boosts":"career"},
    {"name":"森系绿色连衣裙","nameEN":"Forest Green Dress","reason":"木行绿色激活生长能量，吸引新机缘。","searchQuery":"forest green flowy midi dress women","category":"clothing","boosts":"luck"},
    {"name":"红枣桂圆茶","nameEN":"Red Date Longan Tea","reason":"补火行，温暖心脉，增强感情缘分与桃花运。","searchQuery":"红枣桂圆茶做法","category":"food","boosts":"love"},
    {"name":"...","nameEN":"...","reason":"...","searchQuery":"...","category":"jewelry|plant|symbol|number|color|other","boosts":"wealth"},
    {"name":"...","nameEN":"...","reason":"...","searchQuery":"...","category":"jewelry|plant|symbol|number|color|other","boosts":"health"},
    {"name":"...","nameEN":"...","reason":"...","searchQuery":"...","category":"jewelry|plant|symbol|number|color|other","boosts":"career|wealth|love|health|luck"}
  ]
}
将以上 6 个物件全部替换为根据用户八字和五行弱项个性化定制的真实推荐，保持完全相同的结构：恰好 6 个，其中必须有且仅有 1 个 category:"clothing"（穿搭）和 1 个 category:"food"（食补）。每个物件的 boosts 必须填写，6 个物件尽量覆盖不同的 boosts 维度。searchQuery 写具体商品名或菜谱名，不能只写食材。${country && ['CN','TW','HK','MO','SG','MY'].includes(country) ? '食补类 searchQuery 使用中文菜名（如"核桃黑芝麻糊做法"）。' : 'Food searchQuery should be English recipe name.'}`

        // ── 人生报告模式：追加专属指令 ────────────────────
        const lifeAppendZH = `

【人生报告模式】本次解读视角为"终生"而非某个具体时段，请严格遵守以下要求：
- 各维度（career/wealth/love/health/luck）的 summary 写为"终生命格轨迹"：指出命格特征、旺期年龄段（如"35-50岁事业最旺"）、一生整体走向
- summary 四块标题必须改为：命运主题 / 命格共鸣 / 人生机遇与挑战 / 给你的人生建议
- overallScore 代表"终生命格综合潜力"（1-100），而非某日/月/年的运势
- trend 字段依然填 up/stable/down（代表该维度在人生整体走势方向）
- luckyItems 推荐适合终生携带、长期使用的能量物件，reason 写明与命格的长期共振原因`

        const lifeAppendEN = `

[Life Report Mode] This reading covers the ENTIRE LIFETIME, not a short period. Follow strictly:
- Each category summary (career/wealth/love/health/luck) must describe the LIFETIME DESTINY PATTERN: destiny archetype, peak years (e.g. "career peaks 35-50"), overall life trajectory
- Rename the four summary titles to: Destiny Theme / East-West Resonance / Life Opportunities & Challenges / Lifetime Guidance
- overallScore = overall lifetime destiny potential (1-100), NOT a daily/monthly/yearly forecast
- trend field still up/stable/down (lifetime trajectory direction)
- luckyItems should be items for long-term use, with reasons tied to lifetime energy resonance`

        const finalPrompt = period === 'life'
          ? userPrompt + (isEN ? lifeAppendEN : lifeAppendZH)
          : userPrompt

        // ── Step 3: DeepSeek 流式调用 ─────────────────────
        const client = new OpenAI({
          apiKey: process.env.DEEPSEEK_API_KEY!,
          baseURL: 'https://api.deepseek.com',
        })

        const aiStream = await client.chat.completions.create({
          model: 'deepseek-chat',
          max_tokens: period === 'life' ? 4000 : 3000,
          temperature: 0.7,
          response_format: { type: 'json_object' },
          stream: true,
          messages: [
            {
              role: 'system',
              content: isEN
                ? 'You are a master divination synthesizer. Return valid JSON only, no markdown, no explanation.'
                : '你是融合中西方命理的大师。请直接返回合法 JSON，不要 markdown 包裹，不要解释。',
            },
            { role: 'user', content: finalPrompt },
          ],
        })

        // ── Step 4: 流式接收 token，累积 JSON ─────────────
        let rawJson = ''
        let tokenCount = 0
        for await (const chunk of aiStream) {
          const delta = chunk.choices[0]?.delta?.content ?? ''
          if (delta) {
            rawJson += delta
            tokenCount += delta.length
            // 每 200 字符更新一次进度（30% → 90%）
            if (tokenCount % 200 < delta.length) {
              const pct = Math.min(90, 30 + Math.floor(tokenCount / 20))
              send({ type: 'progress', step: isEN ? 'Reading the stars…' : '星象解读中…', pct })
            }
          }
        }

        // ── Step 5: 解析 & 返回 ───────────────────────────
        send({ type: 'progress', step: isEN ? 'Finalizing…' : '整合命理结果…', pct: 95 })

        const fortune = JSON.parse(rawJson)

        // ── 分数下限：总分 ≥ 75，各分项 ≥ 62 ─────────────
        fortune.overallScore = Math.max(75, Math.min(100, fortune.overallScore ?? 75))
        for (const cat of Object.values(fortune.categories ?? {}) as { score: number }[]) {
          cat.score = Math.max(62, Math.min(100, cat.score ?? 62))
        }

        // ── 命格标签 & 稀有度 ─────────────────────────────
        const ARCHETYPE: Record<string, [string, string, string]> = {
          甲: ['将星', '文昌', '建禄'],  乙: ['文昌', '桃花', '贵人'],
          丙: ['帝旺', '将星', '驿马'],  丁: ['文昌', '贵人', '华盖'],
          戊: ['魁罡', '将星', '专旺'],  己: ['贵人', '文昌', '福德'],
          庚: ['魁罡', '将星', '驿马'],  辛: ['文昌', '桃花', '贵人'],
          壬: ['驿马', '将星', '华盖'],  癸: ['华盖', '文昌', '贵人'],
        }
        const dayStem = bazi.dayPillar.stem
        const archs = ARCHETYPE[dayStem] ?? ['贵人', '文昌', '建禄']
        const tier = fortune.overallScore >= 88 ? 0 : fortune.overallScore >= 82 ? 1 : 2
        fortune.destinyType = `${dayStem}${bazi.dominantElement}·${archs[tier]}`
        fortune.rarityPct = fortune.overallScore >= 95 ? 3
          : fortune.overallScore >= 90 ? 8
          : fortune.overallScore >= 87 ? 15
          : fortune.overallScore >= 84 ? 25
          : fortune.overallScore >= 82 ? 35
          : fortune.overallScore >= 80 ? 45
          : fortune.overallScore >= 78 ? 58
          : 68

        // ── 兜底：确保 luckyItems 中有且仅有一个 food 类 ────
        const FOOD_BY_WEAK: Record<string, { name: string; nameEN: string; reason: string; searchQuery: string; boosts: string }> = {
          木: { name: '菠菜猪肝汤', nameEN: 'Spinach Liver Soup', reason: '菠菜补木行生发之气，猪肝养血明目，助提升整体运势与健康。', searchQuery: '菠菜猪肝汤做法', boosts: 'health' },
          火: { name: '红枣桂圆茶', nameEN: 'Red Date Longan Tea', reason: '红枣桂圆补火行，温暖心脉，增强桃花缘分与感情运。', searchQuery: '红枣桂圆茶做法', boosts: 'love' },
          土: { name: '山药小米粥', nameEN: 'Yam Millet Porridge', reason: '山药健脾补土，小米养胃，稳固根基，助财运积累。', searchQuery: '山药小米粥做法', boosts: 'wealth' },
          金: { name: '白萝卜排骨汤', nameEN: 'Radish Pork Rib Soup', reason: '白色食材补金行，润肺清气，提升事业清晰度与决断力。', searchQuery: '白萝卜排骨汤做法', boosts: 'career' },
          水: { name: '黑芝麻核桃糊', nameEN: 'Black Sesame Walnut Paste', reason: '黑色食材滋补水行，益肾健脑，增强智慧与整体运势。', searchQuery: '黑芝麻核桃糊做法', boosts: 'luck' },
        }
        const FOOD_BY_WEAK_EN: Record<string, { name: string; nameEN: string; reason: string; searchQuery: string; boosts: string }> = {
          木: { name: 'Spinach & Liver Soup', nameEN: 'Spinach Liver Soup', reason: 'Spinach nourishes the Wood element, boosting vitality and overall health luck.', searchQuery: 'spinach liver soup recipe', boosts: 'health' },
          火: { name: 'Red Date Longan Tea', nameEN: 'Red Date Longan Tea', reason: 'Warms the Fire element, nourishes the heart, enhances love luck and emotional warmth.', searchQuery: 'red date longan tea recipe', boosts: 'love' },
          土: { name: 'Yam Millet Porridge', nameEN: 'Yam Millet Porridge', reason: 'Yam strengthens the Earth element, stabilizes energy and supports wealth accumulation.', searchQuery: 'yam millet congee recipe', boosts: 'wealth' },
          金: { name: 'White Radish Rib Soup', nameEN: 'White Radish Rib Soup', reason: 'White foods tonify the Metal element, clearing mental fog and boosting career clarity.', searchQuery: 'daikon radish pork rib soup recipe', boosts: 'career' },
          水: { name: 'Black Sesame Walnut Paste', nameEN: 'Black Sesame Walnut Paste', reason: 'Black foods replenish the Water element, nourish the kidneys and sharpen wisdom.', searchQuery: 'black sesame walnut paste recipe', boosts: 'luck' },
        }
        const items: { category?: string }[] = fortune.luckyItems ?? []
        const hasFood = items.some(i => i.category === 'food')
        if (!hasFood) {
          const map = isEN ? FOOD_BY_WEAK_EN : FOOD_BY_WEAK
          const weakEl = bazi.weakElements[0] ?? '水'
          const food = map[weakEl] ?? map['水']
          fortune.luckyItems = [...items, { ...food, category: 'food' }]
        }

        const fullReading: FullReading = {
          input,
          bazi,
          sunSign,
          numerology,
          ziwei,
          tarotCards,
          liuyao,
          meihua,
          runes,
          humanDesign,
          vedic,
          xingming,
          fortune: { ...fortune, generatedAt: new Date().toISOString(), selectedSystems },
        }

        send({ type: 'result', data: fullReading })
      } catch (err) {
        console.error('Fortune API error:', err)
        send({ type: 'error', message: isEN ? 'Reading failed, please try again' : '运势生成失败，请稍后重试' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
