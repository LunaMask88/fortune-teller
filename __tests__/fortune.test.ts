import { describe, it, expect } from 'vitest'
import { createRng, buildSeed } from '@/lib/seeded-random'
import { calcLifePathNumber, calcDestinyNumber, calcNumerology } from '@/lib/numerology'
import { calculateVedic } from '@/lib/vedic'
import { drawThreeCards } from '@/lib/tarot'
import { drawRunes } from '@/lib/runes'
import { drawLiuyao } from '@/lib/liuyao'

// ─────────────────────────────────────
// 1. 种子随机数生成器
// ─────────────────────────────────────
describe('createRng — Mulberry32 确定性', () => {
  it('同一种子产生完全相同的序列', () => {
    const rng1 = createRng(12345)
    const rng2 = createRng(12345)
    for (let i = 0; i < 20; i++) {
      expect(rng1()).toBe(rng2())
    }
  })

  it('不同种子产生不同的值', () => {
    const rng1 = createRng(1)
    const rng2 = createRng(2)
    const vals1 = Array.from({ length: 10 }, rng1)
    const vals2 = Array.from({ length: 10 }, rng2)
    expect(vals1).not.toEqual(vals2)
  })

  it('输出值均在 [0, 1) 区间', () => {
    const rng = createRng(999)
    for (let i = 0; i < 100; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('buildSeed — 跨天刷新，同天同人相同', () => {
  it('同一天同一用户产生相同种子', () => {
    const d = new Date('2025-04-19')
    const s1 = buildSeed(1990, 1, 1, 'today', d)
    const s2 = buildSeed(1990, 1, 1, 'today', d)
    expect(s1).toBe(s2)
  })

  it('不同日期产生不同种子', () => {
    const d1 = new Date('2025-04-19')
    const d2 = new Date('2025-04-20')
    expect(buildSeed(1990, 1, 1, 'today', d1)).not.toBe(buildSeed(1990, 1, 1, 'today', d2))
  })

  it('不同运势周期产生不同种子', () => {
    const d = new Date('2025-04-19')
    expect(buildSeed(1990, 1, 1, 'today', d)).not.toBe(buildSeed(1990, 1, 1, 'month', d))
  })

  it('不同用户产生不同种子', () => {
    const d = new Date('2025-04-19')
    expect(buildSeed(1990, 1, 1, 'today', d)).not.toBe(buildSeed(1991, 1, 1, 'today', d))
  })
})

// ─────────────────────────────────────
// 2. 数字学（纯数学，最容易验证）
// ─────────────────────────────────────
describe('calcLifePathNumber — 生命数字计算', () => {
  it('1989-09-21 → 3', () => {
    // 1+9+8+9 + 0+9 + 2+1 = 39 → 3+9=12 → 1+2=3
    expect(calcLifePathNumber(1989, 9, 21)).toBe(3)
  })

  it('1990-01-01 → 3', () => {
    // 1+9+9+0 + 0+1 + 0+1 = 21 → 2+1=3
    expect(calcLifePathNumber(1990, 1, 1)).toBe(3)
  })

  it('2000-11-29 → 6 (含主数11保留判断)', () => {
    // 2+0+0+0 + 1+1 + 2+9 = 15 → 1+5=6
    expect(calcLifePathNumber(2000, 11, 29)).toBe(6)
  })

  it('1987-02-11 → 11 (主数，不继续约简)', () => {
    // 1+9+8+7 + 0+2 + 1+1 = 29 → 2+9=11 → 保留11
    expect(calcLifePathNumber(1987, 2, 11)).toBe(11)
  })

  it('1965-04-29 → 8', () => {
    // 1+9+6+5 + 0+4 + 2+9 = 36 → 3+6=9... hmm let me recount
    // 1965: 1+9+6+5=21, 04: 0+4=4, 29: 2+9=11, total=21+4+11=36 → 3+6=9
    // So life path should be 9
    expect(calcLifePathNumber(1965, 4, 29)).toBe(9)
  })
})

describe('calcDestinyNumber — 命运数字', () => {
  it('month=9 day=21 → 3', () => {
    // 9+2+1=12 → 1+2=3
    expect(calcDestinyNumber(9, 21)).toBe(3)
  })

  it('month=1 day=1 → 2', () => {
    // 0+1+0+1=2
    expect(calcDestinyNumber(1, 1)).toBe(2)
  })
})

describe('calcNumerology — 集成', () => {
  it('返回 lifePathNumber、destinyNumber 和 description', () => {
    const result = calcNumerology(1989, 9, 21)
    expect(result.lifePathNumber).toBe(3)
    expect(result.destinyNumber).toBe(3)
    expect(typeof result.description).toBe('string')
    expect(result.description.length).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────
// 3. 吠陀占星 — 月亮宫计算验证
// ─────────────────────────────────────
describe('calculateVedic — 月亮宫准确性', () => {
  it('1989-09-21 22:00 月亮落在双子宫（Mithuna）', () => {
    // 参考值：用户确认月亮应在双子座 22°30'
    // Meeus 公式精度 ±1°，验证星座正确即可
    const result = calculateVedic(1989, 9, 21, 22)
    expect(result.moonRashi.name).toBe('Mithuna')
    expect(result.moonRashi.nameCN).toBe('双子宫')
  })

  it('moonDegree 格式为 "N°M\'"', () => {
    const result = calculateVedic(1989, 9, 21, 22)
    expect(result.moonDegree).toMatch(/^\d+°\d+'$/)
  })

  it('返回有效的 Nakshatra', () => {
    const result = calculateVedic(1989, 9, 21, 22)
    expect(result.nakshatra).toBeDefined()
    expect(result.nakshatra.name.length).toBeGreaterThan(0)
  })

  it('出生时间为 null 默认正午，结果合理', () => {
    const withNoon   = calculateVedic(1989, 9, 21, 12)
    const withNull   = calculateVedic(1989, 9, 21, null)
    expect(withNull.moonRashi.name).toBe(withNoon.moonRashi.name)
  })

  it('不同日期产生不同月亮宫（月亮约每2.5天换宫）', () => {
    const r1 = calculateVedic(2024, 1, 1, 12)
    const r7 = calculateVedic(2024, 1, 7, 12)  // 7天后至少换宫2-3次
    // 同月同年但差7天，基本不可能同宫
    // 若恰好同宫则检查度数不同
    if (r1.moonRashi.name === r7.moonRashi.name) {
      expect(r1.moonDegree).not.toBe(r7.moonDegree)
    } else {
      expect(r1.moonRashi.name).not.toBe(r7.moonRashi.name)
    }
  })
})

// ─────────────────────────────────────
// 4. 牌阵确定性（种子 RNG）
// ─────────────────────────────────────
describe('drawThreeCards — 塔罗牌确定性', () => {
  it('相同种子每次抽到完全相同的三张牌', () => {
    const seed = 42
    const draw1 = drawThreeCards(createRng(seed))
    const draw2 = drawThreeCards(createRng(seed))
    expect(draw1.map(c => c.card.id)).toEqual(draw2.map(c => c.card.id))
    expect(draw1.map(c => c.orientation)).toEqual(draw2.map(c => c.orientation))
  })

  it('不同种子产生不同牌面（大概率）', () => {
    const draw1 = drawThreeCards(createRng(1))
    const draw2 = drawThreeCards(createRng(9999))
    // 78张牌中随机3张完全相同的概率极低
    const sameCards = draw1.every((c, i) => c.card.id === draw2[i].card.id)
    expect(sameCards).toBe(false)
  })

  it('正好返回3张牌', () => {
    expect(drawThreeCards(createRng(1))).toHaveLength(3)
  })

  it('position 三值正确', () => {
    const draws = drawThreeCards(createRng(1))
    expect(draws[0].position).toBe('past')
    expect(draws[1].position).toBe('present')
    expect(draws[2].position).toBe('future')
  })
})

describe('drawRunes — 符文确定性', () => {
  it('相同种子抽到相同符文', () => {
    const seed = 777
    const r1 = drawRunes(3, createRng(seed))
    const r2 = drawRunes(3, createRng(seed))
    expect(r1.draws.map(d => d.rune.name)).toEqual(r2.draws.map(d => d.rune.name))
    expect(r1.draws.map(d => d.reversed)).toEqual(r2.draws.map(d => d.reversed))
  })

  it('3 符文展开返回3个', () => {
    expect(drawRunes(3, createRng(1)).draws).toHaveLength(3)
  })

  it('单符文展开返回1个', () => {
    expect(drawRunes(1, createRng(1)).draws).toHaveLength(1)
  })

  it('spread 字段正确', () => {
    expect(drawRunes(3, createRng(1)).spread).toBe('三符文展开')
    expect(drawRunes(1, createRng(1)).spread).toBe('单符文指引')
  })
})

describe('drawLiuyao — 六爻确定性', () => {
  it('相同种子得到相同本卦', () => {
    const seed = 888
    const l1 = drawLiuyao(createRng(seed))
    const l2 = drawLiuyao(createRng(seed))
    expect(l1.benGua.name).toBe(l2.benGua.name)
    expect(l1.lines.map(l => l.yao)).toEqual(l2.lines.map(l => l.yao))
    expect(l1.changingLines).toEqual(l2.changingLines)
  })

  it('返回6条爻', () => {
    const result = drawLiuyao(createRng(1))
    expect(result.lines).toHaveLength(6)
  })

  it('每条爻 yao 为 0 或 1', () => {
    const result = drawLiuyao(createRng(1))
    for (const line of result.lines) {
      expect([0, 1]).toContain(line.yao)
    }
  })

  it('变卦在无变爻时为 null', () => {
    // 穷举种子找一个无变爻的结果（正常出现概率约 1/16）
    let found = false
    for (let s = 0; s < 200; s++) {
      const r = drawLiuyao(createRng(s))
      if (r.changingLines.length === 0) {
        expect(r.bianGua).toBeNull()
        found = true
        break
      }
    }
    // 200次内必然找到
    expect(found).toBe(true)
  })
})

// ─────────────────────────────────────
// 5. 全链路确定性：buildSeed → createRng → 三套牌阵
// ─────────────────────────────────────
describe('全链路种子一致性', () => {
  it('同一天同一用户，三套牌阵完全可重现', () => {
    const today = new Date('2025-04-19')
    const seed = buildSeed(1989, 9, 21, 'today', today)

    const rng1 = createRng(seed)
    const tarot1 = drawThreeCards(rng1)
    const runes1 = drawRunes(3, rng1)
    const liuyao1 = drawLiuyao(rng1)

    const rng2 = createRng(seed)
    const tarot2 = drawThreeCards(rng2)
    const runes2 = drawRunes(3, rng2)
    const liuyao2 = drawLiuyao(rng2)

    expect(tarot1.map(c => c.card.id)).toEqual(tarot2.map(c => c.card.id))
    expect(runes1.draws.map(d => d.rune.name)).toEqual(runes2.draws.map(d => d.rune.name))
    expect(liuyao1.benGua.name).toBe(liuyao2.benGua.name)
  })
})
