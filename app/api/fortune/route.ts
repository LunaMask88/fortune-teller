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
import type { UserInput, FullReading } from '@/types'

const PERIOD_TEXT = { today: '今日', month: '本月', year: '今年' }
const PERIOD_TEXT_EN = { today: 'Daily', month: 'Monthly', year: 'Annual' }

export async function POST(req: NextRequest) {
  const input: UserInput = await req.json()
  const { name, birthYear, birthMonth, birthDay, birthHour, gender, period } = input
  const isEN = input.lang === 'en'

  const enc = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`))

      try {
        // ── Step 1: 本地命理计算（约 <1s）─────────────────
        send({ type: 'progress', step: isEN ? 'Calculating charts…' : '命盘排盘中…', pct: 15 })

        const [bazi, liuyao, meihua, runes, humanDesign, vedic] = await Promise.all([
          calculateBazi(birthYear, birthMonth, birthDay, birthHour),
          Promise.resolve(drawLiuyao()),
          Promise.resolve(drawMeihua(birthYear, birthMonth, birthDay, birthHour)),
          Promise.resolve(drawRunes(3)),
          Promise.resolve(calculateHumanDesign(birthYear, birthMonth, birthDay, birthHour)),
          Promise.resolve(calculateVedic(birthYear, birthMonth, birthDay)),
        ])

        const sunSign    = getSunSign(birthMonth, birthDay)
        const numerology = calcNumerology(birthYear, birthMonth, birthDay)
        const tarotCards = drawThreeCards()
        const ziwei      = calculateZiwei(birthMonth, birthHour, gender)
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

        const userPrompt = isEN ? `
=== Divination Profile ===
Name: ${name} | Born: ${birthYear}-${birthMonth}-${birthDay}${birthHour !== null ? ` ${birthHour}h` : ''} | ${gender}
${context?.trim() ? `Context: ${context.trim()}\n` : ''}
BaZi: ${bazi.yearPillar.full} ${bazi.monthPillar.full} ${bazi.dayPillar.full} ${bazi.hourPillar?.full ?? '?'}
Elements: Wood${bazi.elements['木']} Fire${bazi.elements['火']} Earth${bazi.elements['土']} Metal${bazi.elements['金']} Water${bazi.elements['水']} (weak:${weakStr}, strong:${bazi.dominantElement})
Zodiac: ${bazi.chineseZodiac} | Sun: ${sunSign} | Life#: ${numerology.lifePathNumber}
Zi Wei: ${ziwei.palaceName} palace, ${ziwei.mainStar}
Vedic: ${vedic.moonRashi.nameCN}, ${vedic.nakshatra.nameCN}, ${vedic.currentDasha.nameCN}
Tarot: ${tarotStr} | Runes: ${runesStr}
Human Design: ${humanDesign.type}, ${humanDesign.profile}, ${humanDesign.authority}
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
    {"name":"en","nameEN":"en","reason":"1-2 sentences","searchQuery":"en term","category":"crystal|jewelry|color|number|plant|symbol|other","boosts":"career|wealth|love|health|luck"}
  ]
}
Include 7 lucky items. All text in English.`
        : `
=== 命理档案 ===
姓名：${name} | 出生：${birthYear}-${birthMonth}-${birthDay}${birthHour !== null ? ` ${birthHour}时` : ''} | ${gender === 'male' ? '男' : '女'}
${context?.trim() ? `当前状况：${context.trim()}\n` : ''}
八字：${bazi.yearPillar.full} ${bazi.monthPillar.full} ${bazi.dayPillar.full} ${bazi.hourPillar?.full ?? '?'}
五行：木${bazi.elements['木']} 火${bazi.elements['火']} 土${bazi.elements['土']} 金${bazi.elements['金']} 水${bazi.elements['水']}（弱：${weakStr}，旺：${bazi.dominantElement}）
生肖：${bazi.chineseZodiac} | 星座：${sunSign} | 生命数：${numerology.lifePathNumber}
紫微：${ziwei.palaceName}宫 ${ziwei.mainStar} | 六爻：${liuyao.benGua.name}${liuyao.bianGua ? '→' + liuyao.bianGua.name : ''}
吠陀：${vedic.moonRashi.nameCN} ${vedic.nakshatra.nameCN} ${vedic.currentDasha.nameCN}
塔罗：${tarotStr} | 符文：${runesStr}
人类图：${humanDesign.typeCN} ${humanDesign.profile} ${humanDesign.authority}
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
    {"name":"中文名","nameEN":"English","reason":"1-2句命理原因","searchQuery":"英文搜索词","category":"crystal|jewelry|color|number|plant|symbol|other","boosts":"career|wealth|love|health|luck"}
  ]
}
luckyItems 需 7 个，覆盖水晶/饰品/颜色/数字/植物/符号等类别。`

        // ── Step 3: DeepSeek 流式调用 ─────────────────────
        const client = new OpenAI({
          apiKey: process.env.DEEPSEEK_API_KEY!,
          baseURL: 'https://api.deepseek.com',
        })

        const aiStream = await client.chat.completions.create({
          model: 'deepseek-chat',
          max_tokens: 3000,
          response_format: { type: 'json_object' },
          stream: true,
          messages: [
            {
              role: 'system',
              content: isEN
                ? 'You are a master divination synthesizer. Return valid JSON only, no markdown, no explanation.'
                : '你是融合中西方命理的大师。请直接返回合法 JSON，不要 markdown 包裹，不要解释。',
            },
            { role: 'user', content: userPrompt },
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
          fortune: { ...fortune, generatedAt: new Date().toISOString() },
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
