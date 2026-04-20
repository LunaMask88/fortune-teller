// ── 用户输入 ──────────────────────────────────────────────
export interface UserInput {
  name: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number | null
  gender: 'male' | 'female' | 'undisclosed'
  country?: string   // ISO country code, e.g. 'CN', 'US'
  city?: string
  period: 'today' | 'month' | 'year' | 'life'
  context?: string      // 当前状况 / 补充背景
  questions?: string[]  // 用户想问的具体问题（最多 5 个）
  lang?: 'zh' | 'en'   // 界面与 AI 回复语言
  systems?: string[]   // 选中的命理体系，undefined = 全选
}

// ── 八字 / 五行 ───────────────────────────────────────────
export type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸'
export type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'
export type Element = '木' | '火' | '土' | '金' | '水'
export type ChineseZodiac = '鼠' | '牛' | '虎' | '兔' | '龙' | '蛇' | '马' | '羊' | '猴' | '鸡' | '狗' | '猪'

export interface Pillar {
  stem: HeavenlyStem
  branch: EarthlyBranch
  full: string
}

export interface BaziResult {
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  hourPillar: Pillar | null
  elements: Record<Element, number>
  dominantElement: Element
  weakElements: Element[]
  chineseZodiac: ChineseZodiac
}

// ── 西洋星座 ──────────────────────────────────────────────
export type SunSign =
  | '白羊座' | '金牛座' | '双子座' | '巨蟹座'
  | '狮子座' | '处女座' | '天秤座' | '天蝎座'
  | '射手座' | '摩羯座' | '水瓶座' | '双鱼座'

// ── 塔罗 ─────────────────────────────────────────────────
export type TarotOrientation = 'upright' | 'reversed'

export interface TarotCard {
  id: number
  name: string
  nameCN: string
  arcana: 'major' | 'minor'
  suit?: string
  uprightMeaning: string
  reversedMeaning: string
  emoji: string
}

export interface DrawnCard {
  card: TarotCard
  orientation: TarotOrientation
  position: 'past' | 'present' | 'future'
  meaning: string
}

// ── 数字命理 ──────────────────────────────────────────────
export interface NumerologyResult {
  lifePathNumber: number
  destinyNumber: number
  description: string
}

// ── 紫微斗数 ──────────────────────────────────────────────
export interface ZiweiResult {
  palaceName: string
  mainStar: string
  description: string
}

// ── 六爻占卜 ──────────────────────────────────────────────
export interface Hexagram {
  name: string
  namePY: string
  summary: string
}

export interface LiuyaoLine {
  yao: 0 | 1    // 0=阴爻 1=阳爻
  changing: boolean
}

export interface LiuyaoResult {
  lines: LiuyaoLine[]
  benGua: Hexagram
  bianGua: Hexagram | null
  changingLines: number[]
  interpretation: string
}

// ── 梅花易数 ──────────────────────────────────────────────
export interface BaguaItem {
  name: string
  symbol: string
  element: string
  attr: string
  num: number
}

export interface MeihuaResult {
  upperGua: BaguaItem
  lowerGua: BaguaItem
  changingYao: number
  tiGua: BaguaItem
  yongGua: BaguaItem
  relation: string
  hexagramName: string
  summary: string
}

// ── 符文占卜 ──────────────────────────────────────────────
export interface RuneCard {
  symbol: string
  name: string
  nameCN: string
  upright: string
  reversed: string
}

export interface RuneDraw {
  rune: RuneCard
  reversed: boolean
  meaning: string
  position: string
}

export interface RuneResult {
  draws: RuneDraw[]
  spread: string
}

// ── 人类图 ────────────────────────────────────────────────
export type HDType = 'Manifestor' | 'Generator' | 'Manifesting Generator' | 'Projector' | 'Reflector'

export interface HumanDesignResult {
  type: HDType
  typeCN: string
  aura: string
  strategy: string
  notSelf: string
  typeDesc: string
  profile: string
  profileDesc: string
  authority: string
  centers: Record<string, boolean>
  definedCenters: number
  percent: string
}

// ── 吠陀占星 ──────────────────────────────────────────────
export interface VedicRashi {
  name: string
  nameCN: string
  ruler: string
  element: string
  quality: string
}

export interface VedicNakshatra {
  name: string
  nameCN: string
  ruler: string
  deity: string
  quality: string
}

export interface VedicDasha {
  planet: string
  years: number
  nameCN: string
}

export interface VedicResult {
  moonRashi: VedicRashi
  nakshatra: VedicNakshatra
  currentDasha: VedicDasha
  rahuSign: string
  ketuSign: string
  moonDegree?: string
  summary: string
}

// ── 姓名学 ────────────────────────────────────────────────
export interface GridRating {
  ji: '大吉' | '吉' | '平' | '凶' | '大凶'
  desc: string
}

export interface XingmingResult {
  name: string
  strokes: number[]
  tianGe: number
  renGe: number
  diGe: number
  zongGe: number
  waiGe: number
  ratings: {
    tianGe: GridRating
    renGe: GridRating
    diGe: GridRating
    zongGe: GridRating
    waiGe: GridRating
  }
  sancai: string
  summary: string
}

// ── 幸运物件 ──────────────────────────────────────────────
export interface LuckyItem {
  name: string
  nameEN: string
  reason: string
  searchQuery: string
  category: 'crystal' | 'jewelry' | 'color' | 'number' | 'plant' | 'symbol' | 'clothing' | 'food' | 'other'
  boosts?: 'career' | 'wealth' | 'love' | 'health' | 'luck'
  images?: string[]
}

// ── 运势评分 ──────────────────────────────────────────────
export interface FortuneCategory {
  score: number
  label: string
  trend: 'up' | 'stable' | 'down'
  summary: string
}

export interface FortuneAnswer {
  question: string
  answer: string
}

export interface SummaryItem {
  title: string
  body: string
}

export interface FortuneReading {
  overallScore: number
  categories: {
    career: FortuneCategory
    wealth: FortuneCategory
    love: FortuneCategory
    health: FortuneCategory
    luck: FortuneCategory
  }
  summary: SummaryItem[]
  answers?: FortuneAnswer[]  // 针对用户问题的命理解答
  luckyItems: LuckyItem[]
  generatedAt: string
  selectedSystems?: string[]  // 本次解读使用的体系
}

// ── 配对功能 ──────────────────────────────────────────────
export interface MatchPersonInput {
  name: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number | null
  gender: 'male' | 'female'
}

export interface MatchDimension {
  score: number
  label: string
  summary: string
}

export interface MatchResult {
  score: number
  dimensions: {
    communication: MatchDimension
    values: MatchDimension
    emotion: MatchDimension
    growth: MatchDimension
  }
  summary: string[]       // 3 段整体分析
  advice: string          // 核心建议
  luckyActivities: string[] // 适合两人的活动
}

// ── 完整结果 ──────────────────────────────────────────────
export interface FullReading {
  input: UserInput
  bazi: BaziResult
  sunSign: SunSign
  numerology: NumerologyResult
  ziwei: ZiweiResult
  tarotCards: DrawnCard[]
  liuyao: LiuyaoResult
  meihua: MeihuaResult
  runes: RuneResult
  humanDesign: HumanDesignResult
  vedic: VedicResult
  xingming: XingmingResult
  fortune: FortuneReading
}
