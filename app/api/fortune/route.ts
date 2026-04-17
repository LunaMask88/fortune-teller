import { NextRequest, NextResponse } from 'next/server'

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

  // ── 并行计算各命理体系 ─────────────────────────────────
  const [bazi, liuyao, meihua, runes, humanDesign, vedic] = await Promise.all([
    calculateBazi(birthYear, birthMonth, birthDay, birthHour),
    Promise.resolve(drawLiuyao()),
    Promise.resolve(drawMeihua(birthYear, birthMonth, birthDay, birthHour)),
    Promise.resolve(drawRunes(3)),
    Promise.resolve(calculateHumanDesign(birthYear, birthMonth, birthDay, birthHour)),
    Promise.resolve(calculateVedic(birthYear, birthMonth, birthDay)),
  ])

  const sunSign   = getSunSign(birthMonth, birthDay)
  const numerology = calcNumerology(birthYear, birthMonth, birthDay)
  const tarotCards = drawThreeCards()
  const ziwei      = calculateZiwei(birthMonth, birthHour, gender)
  const xingming   = analyzeXingming(name)

  const isEN = input.lang === 'en'
  const { context, questions } = input
  const periodLabel = isEN ? PERIOD_TEXT_EN[period] : PERIOD_TEXT[period]
  const weakStr = bazi.weakElements.length > 0 ? bazi.weakElements.join('、') : '五行较均衡'
  const tarotStr = tarotCards.map(c =>
    `${c.position === 'past' ? '过去' : c.position === 'present' ? '现在' : '未来'}：${c.card.nameCN}（${c.orientation === 'upright' ? '正位' : '逆位'}）`
  ).join('；')
  const runesStr = runes.draws.map(d => `${d.position}—${d.rune.nameCN}${d.rune.symbol}（${d.reversed ? '逆' : '正'}）`).join('；')
  const hasQuestions = questions && questions.filter(q => q.trim()).length > 0
  const cleanQuestions = (questions ?? []).filter(q => q.trim())

  const userPrompt = `
=== 综合命理档案 ===
姓名：${name}（五格人格数${xingming.renGe} ${xingming.ratings.renGe.ji}，总格${xingming.zongGe} ${xingming.ratings.zongGe.ji}）
出生：${birthYear}年${birthMonth}月${birthDay}日${birthHour !== null ? ` ${birthHour}时` : '（时辰不详，取午时）'}，${gender === 'male' ? '男' : '女'}
${context?.trim() ? `\n【当前状况 / 补充背景】\n${context.trim()}\n` : ''}

【东方体系】
▸ 八字：${bazi.yearPillar.full} ${bazi.monthPillar.full} ${bazi.dayPillar.full} ${bazi.hourPillar?.full ?? '?'}
  五行：木${bazi.elements['木']} 火${bazi.elements['火']} 土${bazi.elements['土']} 金${bazi.elements['金']} 水${bazi.elements['水']}（偏弱：${weakStr}，旺：${bazi.dominantElement}）
▸ 生肖：${bazi.chineseZodiac}
▸ 紫微：命宫${ziwei.palaceName}，主星${ziwei.mainStar}（${ziwei.description}）
▸ 六爻：本卦"${liuyao.benGua.name}"${liuyao.bianGua ? `→变卦"${liuyao.bianGua.name}"` : ''}，动爻第${liuyao.changingLines.join(',')||'无'}爻
▸ 梅花：${meihua.hexagramName}卦，体${meihua.tiGua.name}（${meihua.tiGua.element}）用${meihua.yongGua.name}（${meihua.yongGua.element}），${meihua.relation}

【西方/印度体系】
▸ 西洋星座：${sunSign}
▸ 吠陀占星：月亮${vedic.moonRashi.nameCN}，星宿${vedic.nakshatra.nameCN}，当前${vedic.currentDasha.nameCN}（${vedic.currentDasha.planet}）
▸ 塔罗三牌：${tarotStr}
▸ 符文：${runesStr}
▸ 数字命理：生命数字${numerology.lifePathNumber}（${numerology.description}）

【人类图】
▸ 类型：${humanDesign.typeCN}（${humanDesign.type}），策略：${humanDesign.strategy}
▸ 角色：${humanDesign.profile}，权威：${humanDesign.authority}

运势周期：${periodLabel}
${hasQuestions ? `\n【需要重点解答的问题】\n${cleanQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n` : ''}
${isEN
  ? `Please synthesize all the above systems for a ${periodLabel} fortune reading. Note:
1. Highlight where systems corroborate or contradict each other
2. Lucky items should reflect Five Elements deficiency + Vedic nakshatra + Human Design type
${hasQuestions ? '3. In the answers array, answer each question in 2-4 sentences using specific divination systems' : ''}
IMPORTANT: Write ALL text fields (summary, category summaries, answers, item names, reasons) in English.

Return JSON only (no markdown):
{
  "overallScore": integer 1-100,
  "categories": {
    "career":  { "score": integer, "label": "Career", "trend": "up"|"stable"|"down", "summary": "2 sentences from multiple systems" },
    "wealth":  { "score": integer, "label": "Wealth",  "trend": "...", "summary": "..." },
    "love":    { "score": integer, "label": "Love",    "trend": "...", "summary": "..." },
    "health":  { "score": integer, "label": "Health",  "trend": "...", "summary": "..." },
    "luck":    { "score": integer, "label": "Overall",  "trend": "...", "summary": "..." }
  },
  "summary": [
    { "title": "Overall Energy", "body": "2-3 sentences on the dominant energy pattern across all systems" },
    { "title": "Eastern & Western Resonance", "body": "Where BaZi / Zi Wei / Vedic / Western systems agree or diverge" },
    { "title": "Opportunities & Challenges", "body": "Key windows and watch-outs for the period" },
    { "title": "Guidance", "body": "Practical advice drawn from the divination synthesis" }
  ],${hasQuestions ? `
  "answers": [
    { "question": "original question", "answer": "2-4 sentence divination-based answer" }
  ],` : ''}
  "luckyItems": [
    { "name": "English name", "nameEN": "English", "reason": "divination-based reason", "searchQuery": "English search term", "category": "crystal"|"jewelry"|"color"|"number"|"plant"|"symbol"|"other" }
  ]
}
Include 7-9 lucky items covering crystals, runes, colors, numbers, plants, jewelry, aromatherapy etc.`
  : `请综合以上全部体系，给出${periodLabel}运势分析。注意：
1. 各体系相互印证或矛盾之处要特别说明
2. 幸运物件需结合五行缺失+吠陀星宿+人类图类型推荐
${hasQuestions ? '3. 在 answers 数组中逐一回答用户的问题，每题2-4句，结合具体命理体系给出有依据的解答' : ''}

返回 JSON（仅 JSON，无任何 markdown）：
{
  "overallScore": 1-100整数,
  "categories": {
    "career":  { "score": 整数, "label": "事业运", "trend": "up"|"stable"|"down", "summary": "结合多体系的2句话" },
    "wealth":  { "score": 整数, "label": "财运",   "trend": "...", "summary": "..." },
    "love":    { "score": 整数, "label": "感情运", "trend": "...", "summary": "..." },
    "health":  { "score": 整数, "label": "健康运", "trend": "...", "summary": "..." },
    "luck":    { "score": 整数, "label": "整体运势","trend": "...", "summary": "..." }
  },
  "summary": [
    { "title": "整体气场", "body": "2-3句，概括本周期主导的能量格局" },
    { "title": "东西方共鸣", "body": "八字/紫微/吠陀/西洋星座相互印证或矛盾之处" },
    { "title": "机遇与挑战", "body": "本周期的关键窗口期与需要留意的风险" },
    { "title": "给你的建议", "body": "结合各体系综合给出的具体行动建议" }
  ],${hasQuestions ? `
  "answers": [
    { "question": "原题目", "answer": "2-4句命理解答" }
  ],` : ''}
  "luckyItems": [
    { "name": "中文名", "nameEN": "English", "reason": "结合命理的具体原因", "searchQuery": "英文商品搜索词", "category": "crystal"|"jewelry"|"color"|"number"|"plant"|"symbol"|"other" }
  ]
}
luckyItems 需 7-9 个，覆盖水晶/符文/颜色/数字/植物/饰品/香薰等多种类别。`}
`

  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY!,
    baseURL: 'https://api.deepseek.com',
  })

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 4000,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: isEN
            ? 'You are a master of Eastern and Western divination, expert in BaZi, Zi Wei Dou Shu, I Ching, Western Astrology, Vedic Astrology, Tarot, Runes, Numerology, Human Design, and Chinese Name Analysis. Return valid JSON only, no markdown.'
            : '你是融合中西方命理的大师，精通八字、紫微斗数、六爻、梅花易数、西洋占星、吠陀占星、塔罗、符文、数字命理、人类图、姓名学。请直接返回合法 JSON，不要 markdown 包裹。',
        },
        { role: 'user', content: userPrompt },
      ],
    })

    const rawJson = response.choices[0].message.content ?? '{}'
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

    return NextResponse.json(fullReading)
  } catch (err) {
    console.error('Fortune API error:', err)
    return NextResponse.json({ error: '运势生成失败，请稍后重试' }, { status: 500 })
  }
}
