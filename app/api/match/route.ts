import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { calculateBazi } from '@/lib/bazi'
import { getSunSign } from '@/lib/astrology'
import { calcNumerology } from '@/lib/numerology'
import type { MatchPersonInput } from '@/types'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const { person1, person2, lang }: { person1: MatchPersonInput; person2: MatchPersonInput; lang?: string } = await req.json()
  const isEN = lang === 'en'

  const enc = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`))

      try {
        send({ type: 'progress', step: isEN ? 'Calculating charts…' : '命盘排盘中…', pct: 20 })

        const [bazi1, bazi2] = await Promise.all([
          calculateBazi(person1.birthYear, person1.birthMonth, person1.birthDay, person1.birthHour),
          calculateBazi(person2.birthYear, person2.birthMonth, person2.birthDay, person2.birthHour),
        ])
        const sun1  = getSunSign(person1.birthMonth, person1.birthDay)
        const sun2  = getSunSign(person2.birthMonth, person2.birthDay)
        const num1  = calcNumerology(person1.birthYear, person1.birthMonth, person1.birthDay)
        const num2  = calcNumerology(person2.birthYear, person2.birthMonth, person2.birthDay)

        send({ type: 'progress', step: isEN ? 'Analyzing compatibility…' : 'AI 分析合盘…', pct: 40 })

        const prompt = isEN ? `
Analyze compatibility between two people using Chinese and Western astrology.

Person 1: ${person1.name} | Born ${person1.birthYear}-${person1.birthMonth}-${person1.birthDay}${person1.birthHour !== null ? ` ${person1.birthHour}h` : ''} | ${person1.gender}
BaZi: ${bazi1.yearPillar.full} ${bazi1.monthPillar.full} ${bazi1.dayPillar.full} ${bazi1.hourPillar?.full ?? '?'}
Elements: Wood${bazi1.elements['木']} Fire${bazi1.elements['火']} Earth${bazi1.elements['土']} Metal${bazi1.elements['金']} Water${bazi1.elements['水']}
Sun: ${sun1} | Life#: ${num1.lifePathNumber}

Person 2: ${person2.name} | Born ${person2.birthYear}-${person2.birthMonth}-${person2.birthDay}${person2.birthHour !== null ? ` ${person2.birthHour}h` : ''} | ${person2.gender}
BaZi: ${bazi2.yearPillar.full} ${bazi2.monthPillar.full} ${bazi2.dayPillar.full} ${bazi2.hourPillar?.full ?? '?'}
Elements: Wood${bazi2.elements['木']} Fire${bazi2.elements['火']} Earth${bazi2.elements['土']} Metal${bazi2.elements['金']} Water${bazi2.elements['水']}
Sun: ${sun2} | Life#: ${num2.lifePathNumber}

Return JSON only:
{
  "score": 1-100,
  "dimensions": {
    "communication": {"score":int,"label":"Communication","summary":"2 sentences"},
    "values":        {"score":int,"label":"Values","summary":"2 sentences"},
    "emotion":       {"score":int,"label":"Emotional Bond","summary":"2 sentences"},
    "growth":        {"score":int,"label":"Growth Together","summary":"2 sentences"}
  },
  "summary": ["para1","para2","para3"],
  "advice": "1-2 sentences of key advice for this pair",
  "luckyActivities": ["activity1","activity2","activity3"]
}` : `
分析两人合盘契合度，融合八字与西洋星座。

甲方：${person1.name} | 出生 ${person1.birthYear}-${person1.birthMonth}-${person1.birthDay}${person1.birthHour !== null ? ` ${person1.birthHour}时` : ''} | ${person1.gender === 'male' ? '男' : '女'}
八字：${bazi1.yearPillar.full} ${bazi1.monthPillar.full} ${bazi1.dayPillar.full} ${bazi1.hourPillar?.full ?? '?'}
五行：木${bazi1.elements['木']} 火${bazi1.elements['火']} 土${bazi1.elements['土']} 金${bazi1.elements['金']} 水${bazi1.elements['水']}
星座：${sun1} | 生命数：${num1.lifePathNumber}

乙方：${person2.name} | 出生 ${person2.birthYear}-${person2.birthMonth}-${person2.birthDay}${person2.birthHour !== null ? ` ${person2.birthHour}时` : ''} | ${person2.gender === 'male' ? '男' : '女'}
八字：${bazi2.yearPillar.full} ${bazi2.monthPillar.full} ${bazi2.dayPillar.full} ${bazi2.hourPillar?.full ?? '?'}
五行：木${bazi2.elements['木']} 火${bazi2.elements['火']} 土${bazi2.elements['土']} 金${bazi2.elements['金']} 水${bazi2.elements['水']}
星座：${sun2} | 生命数：${num2.lifePathNumber}

请返回 JSON（仅 JSON）：
{
  "score": 1-100整数,
  "dimensions": {
    "communication": {"score":整数,"label":"沟通默契","summary":"2句"},
    "values":        {"score":整数,"label":"价值观契合","summary":"2句"},
    "emotion":       {"score":整数,"label":"情感连接","summary":"2句"},
    "growth":        {"score":整数,"label":"共同成长","summary":"2句"}
  },
  "summary": ["第1段整体分析","第2段命理互动","第3段关系建议"],
  "advice": "1-2句最关键的相处建议",
  "luckyActivities": ["适合两人的活动1","活动2","活动3"]
}`

        const client = new OpenAI({
          apiKey: process.env.DEEPSEEK_API_KEY!,
          baseURL: 'https://api.deepseek.com',
        })

        const aiStream = await client.chat.completions.create({
          model: 'deepseek-chat',
          max_tokens: 2000,
          response_format: { type: 'json_object' },
          stream: true,
          messages: [
            {
              role: 'system',
              content: isEN
                ? 'You are a master compatibility analyst. Return valid JSON only.'
                : '你是融合中西方命理的合盘分析大师。请直接返回合法 JSON，不要 markdown。',
            },
            { role: 'user', content: prompt },
          ],
        })

        let rawJson = ''
        let tokenCount = 0
        for await (const chunk of aiStream) {
          const delta = chunk.choices[0]?.delta?.content ?? ''
          if (delta) {
            rawJson += delta
            tokenCount += delta.length
            if (tokenCount % 150 < delta.length) {
              const pct = Math.min(90, 40 + Math.floor(tokenCount / 15))
              send({ type: 'progress', step: isEN ? 'Reading the stars…' : '星象解析中…', pct })
            }
          }
        }

        send({ type: 'progress', step: isEN ? 'Finalizing…' : '整合结果…', pct: 95 })
        const result = JSON.parse(rawJson)
        send({ type: 'result', data: { person1, person2, result } })
      } catch (err) {
        console.error('Match API error:', err)
        send({ type: 'error', message: isEN ? 'Analysis failed, please try again' : '合盘分析失败，请稍后重试' })
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
