import type { BaziResult, ChineseZodiac, Element, HeavenlyStem, EarthlyBranch, Pillar } from '@/types'
import Lunar from 'lunar-javascript'

async function getLunar() {
  return Lunar
}

const STEMS: HeavenlyStem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const BRANCHES: EarthlyBranch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const ZODIACS: ChineseZodiac[] = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

// 天干 → 五行
const STEM_ELEMENT: Record<HeavenlyStem, Element> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火',
  戊: '土', 己: '土', 庚: '金', 辛: '金',
  壬: '水', 癸: '水',
}

// 地支 → 五行（主气）
const BRANCH_ELEMENT: Record<EarthlyBranch, Element> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木',
  辰: '土', 巳: '火', 午: '火', 未: '土',
  申: '金', 酉: '金', 戌: '土', 亥: '水',
}

function parsePillar(stemStr: string, branchStr: string): Pillar {
  return {
    stem: stemStr as HeavenlyStem,
    branch: branchStr as EarthlyBranch,
    full: stemStr + branchStr,
  }
}

function calcElements(pillars: (Pillar | null)[]): Record<Element, number> {
  const counts: Record<Element, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }
  for (const p of pillars) {
    if (!p) continue
    counts[STEM_ELEMENT[p.stem]]++
    counts[BRANCH_ELEMENT[p.branch]]++
  }
  return counts
}

export async function calculateBazi(
  year: number, month: number, day: number, hour: number | null
): Promise<BaziResult> {
  const Lunar = await getLunar()
  const solar = Lunar.Solar.fromYmd(year, month, day)
  const lunar = solar.getLunar()
  const ec = lunar.getEightChar()

  const yearPillar = parsePillar(ec.getYearGan(), ec.getYearZhi())
  const monthPillar = parsePillar(ec.getMonthGan(), ec.getMonthZhi())
  const dayPillar = parsePillar(ec.getDayGan(), ec.getDayZhi())

  let hourPillar: Pillar | null = null
  if (hour !== null) {
    const actualHour = hour === null ? 12 : hour
    const solarWithHour = Lunar.Solar.fromYmdHms(year, month, day, actualHour, 0, 0)
    const ecH = solarWithHour.getLunar().getEightChar()
    hourPillar = parsePillar(ecH.getTimeGan(), ecH.getTimeZhi())
  }

  const elements = calcElements([yearPillar, monthPillar, dayPillar, hourPillar])
  const total = Object.values(elements).reduce((a, b) => a + b, 0) || 1
  // 归一到 0-10
  const normalized = Object.fromEntries(
    Object.entries(elements).map(([k, v]) => [k, Math.round((v / total) * 10)])
  ) as Record<Element, number>

  const sorted = (Object.entries(normalized) as [Element, number][]).sort((a, b) => b[1] - a[1])
  const dominantElement = sorted[0][0]
  const weakElements = sorted.slice(3).map(([e]) => e)

  // 生肖：从地支推算
  const branchIndex = BRANCHES.indexOf(yearPillar.branch)
  const chineseZodiac = ZODIACS[branchIndex]

  return { yearPillar, monthPillar, dayPillar, hourPillar, elements: normalized, dominantElement, weakElements, chineseZodiac }
}

// 供前端展示用的干支索引（构建八字宫格）
export { STEMS, BRANCHES, STEM_ELEMENT, BRANCH_ELEMENT }
