import type { MeihuaResult } from '@/types'

// 梅花易数（邵雍体系）：以数取卦，万物皆数
// 经典起卦法：年月日时各取数字，上卦=（年+月+日）% 8，下卦=（年+月+日+时）% 8，动爻=（年+月+日+时）% 6

const BA_GUA = [
  { name: '乾', symbol: '☰', element: '金', attr: '天、刚健', num: 1 },
  { name: '兑', symbol: '☱', element: '金', attr: '泽、悦顺', num: 2 },
  { name: '离', symbol: '☲', element: '火', attr: '火、附丽', num: 3 },
  { name: '震', symbol: '☳', element: '木', attr: '雷、动', num: 4 },
  { name: '巽', symbol: '☴', element: '木', attr: '风、柔顺', num: 5 },
  { name: '坎', symbol: '☵', element: '水', attr: '水、险陷', num: 6 },
  { name: '艮', symbol: '☶', element: '土', attr: '山、止', num: 7 },
  { name: '坤', symbol: '☷', element: '土', attr: '地、柔顺', num: 8 },
]

// 体用生克关系（简化）
const ELEMENT_RELATION: Record<string, Record<string, '生' | '克' | '同' | '泄'>> = {
  金: { 金: '同', 水: '生', 木: '克', 火: '泄', 土: '生' },
  木: { 木: '同', 火: '生', 土: '克', 金: '泄', 水: '生' },
  水: { 水: '同', 木: '生', 火: '克', 土: '泄', 金: '生' },
  火: { 火: '同', 土: '生', 金: '克', 水: '泄', 木: '生' },
  土: { 土: '同', 金: '生', 木: '克', 火: '生', 水: '泄' },
}

function getRelationDesc(ti: string, yong: string): string {
  const rel = ELEMENT_RELATION[ti]?.[yong]
  if (rel === '生') return `用卦（${yong}）生体卦（${ti}），大吉，得外力相助`
  if (rel === '克') return `用卦（${yong}）克体卦（${ti}），凶，外部有阻力`
  if (rel === '同') return `体用同属（${ti}），平稳，主观条件充足`
  if (rel === '泄') return `体卦（${ti}）泄气于用卦（${yong}），小吉，需付出较多`
  return `体卦（${ti}）克用卦（${yong}），吉，主动掌控局面`
}

export function drawMeihua(
  year: number, month: number, day: number, hour: number | null
): MeihuaResult {
  const h = hour ?? 12
  const yearDigits = String(year).split('').reduce((a, d) => a + parseInt(d), 0)

  const upperNum = (yearDigits + month + day) % 8 || 8
  const lowerNum = (yearDigits + month + day + h) % 8 || 8
  const changingYao = (yearDigits + month + day + h) % 6 || 6

  const upperGua = BA_GUA.find(g => g.num === upperNum)!
  const lowerGua = BA_GUA.find(g => g.num === lowerNum)!

  // 体卦 = 静爻（非动爻所在），用卦 = 动爻所在
  // 简化：动爻1-3=下卦为用，动爻4-6=上卦为用
  const tiGua = changingYao <= 3 ? upperGua : lowerGua
  const yongGua = changingYao <= 3 ? lowerGua : upperGua

  const relation = getRelationDesc(tiGua.element, yongGua.element)

  return {
    upperGua,
    lowerGua,
    changingYao,
    tiGua,
    yongGua,
    relation,
    hexagramName: `${upperGua.name}${lowerGua.name}`,
    summary: `上卦${upperGua.name}（${upperGua.symbol}）${upperGua.attr}，下卦${lowerGua.name}（${lowerGua.symbol}）${lowerGua.attr}。第${changingYao}爻为动爻。${relation}。`,
  }
}

export { BA_GUA }
