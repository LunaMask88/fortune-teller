import type { VedicResult } from '@/types'

// 吠陀占星（Jyotish）简化版
// 与西洋占星的核心差异：
// 1. 用恒星黄道（Sidereal）而非回归黄道，当前差约23-24度（差将近一个星座）
// 2. 重视月亮星座（Rashi）多于太阳星座
// 3. Rahu（北交）/ Ketu（南交）作为独立天体有极大影响
// 4. 大运系统（Dasha）预测具体人生阶段

// 12 宫（Rashi）
const RASHIS = [
  { name: 'Mesha',     nameCN: '白羊宫', ruler: '火星', element: '火', quality: '基本' },
  { name: 'Vrishabha', nameCN: '金牛宫', ruler: '金星', element: '土', quality: '固定' },
  { name: 'Mithuna',   nameCN: '双子宫', ruler: '水星', element: '风', quality: '变动' },
  { name: 'Karka',     nameCN: '巨蟹宫', ruler: '月亮', element: '水', quality: '基本' },
  { name: 'Simha',     nameCN: '狮子宫', ruler: '太阳', element: '火', quality: '固定' },
  { name: 'Kanya',     nameCN: '处女宫', ruler: '水星', element: '土', quality: '变动' },
  { name: 'Tula',      nameCN: '天秤宫', ruler: '金星', element: '风', quality: '基本' },
  { name: 'Vrischika', nameCN: '天蝎宫', ruler: '火星', element: '水', quality: '固定' },
  { name: 'Dhanu',     nameCN: '射手宫', ruler: '木星', element: '火', quality: '变动' },
  { name: 'Makara',    nameCN: '摩羯宫', ruler: '土星', element: '土', quality: '基本' },
  { name: 'Kumbha',    nameCN: '水瓶宫', ruler: '土星', element: '风', quality: '固定' },
  { name: 'Meena',     nameCN: '双鱼宫', ruler: '木星', element: '水', quality: '变动' },
]

// 27 Nakshatra（星宿）
const NAKSHATRAS = [
  { name: 'Ashwini',      nameCN: '马夫宿', ruler: 'Ketu（南交）',   deity: '马神双子', quality: '轻快、先行者' },
  { name: 'Bharani',      nameCN: '娄宿',   ruler: 'Venus（金星）',  deity: '阎摩（死神）', quality: '转化、生育' },
  { name: 'Krittika',     nameCN: '昴宿',   ruler: 'Sun（太阳）',    deity: '阿耆尼（火神）', quality: '净化、力量' },
  { name: 'Rohini',       nameCN: '毕宿',   ruler: 'Moon（月亮）',   deity: '梵天', quality: '成长、创造' },
  { name: 'Mrigashira',   nameCN: '觜宿',   ruler: 'Mars（火星）',   deity: '苏摩（月神）', quality: '搜寻、探索' },
  { name: 'Ardra',        nameCN: '参宿',   ruler: 'Rahu（北交）',   deity: '楼陀罗（风暴神）', quality: '变革、破坏' },
  { name: 'Punarvasu',    nameCN: '井宿',   ruler: 'Jupiter（木星）',deity: '阿底提（母神）', quality: '更新、归家' },
  { name: 'Pushya',       nameCN: '鬼宿',   ruler: 'Saturn（土星）', deity: '布利哈斯帕提', quality: '滋养、教育' },
  { name: 'Ashlesha',     nameCN: '柳宿',   ruler: 'Mercury（水星）',deity: '那迦（蛇神）', quality: '洞察、执着' },
  { name: 'Magha',        nameCN: '星宿',   ruler: 'Ketu（南交）',   deity: '祖先', quality: '荣耀、传统' },
  { name: 'Purva Phalguni',nameCN: '张宿',  ruler: 'Venus（金星）',  deity: '婆伽（爱神）', quality: '享乐、创意' },
  { name: 'Uttara Phalguni',nameCN: '翼宿', ruler: 'Sun（太阳）',    deity: '阿里亚曼', quality: '合作、友谊' },
  { name: 'Hasta',        nameCN: '轸宿',   ruler: 'Moon（月亮）',   deity: '萨维塔（太阳神）', quality: '技艺、自律' },
  { name: 'Chitra',       nameCN: '角宿',   ruler: 'Mars（火星）',   deity: '陀湿多（工匠神）', quality: '美丽、创造' },
  { name: 'Swati',        nameCN: '亢宿',   ruler: 'Rahu（北交）',   deity: '伐由（风神）', quality: '独立、灵活' },
  { name: 'Vishakha',     nameCN: '氐宿',   ruler: 'Jupiter（木星）',deity: '因陀罗&阿耆尼', quality: '目标、激情' },
  { name: 'Anuradha',     nameCN: '房宿',   ruler: 'Saturn（土星）', deity: '密多罗（友谊神）', quality: '奉献、友情' },
  { name: 'Jyeshtha',     nameCN: '心宿',   ruler: 'Mercury（水星）',deity: '因陀罗（雷神）', quality: '权威、保护' },
  { name: 'Mula',         nameCN: '尾宿',   ruler: 'Ketu（南交）',   deity: '尼利提（毁灭女神）', quality: '根源、转化' },
  { name: 'Purva Ashadha',nameCN: '箕宿',   ruler: 'Venus（金星）',  deity: '阿帕斯（水神）', quality: '无敌、净化' },
  { name: 'Uttara Ashadha',nameCN: '斗宿',  ruler: 'Sun（太阳）',    deity: '世界神', quality: '永恒胜利' },
  { name: 'Shravana',     nameCN: '牛宿',   ruler: 'Moon（月亮）',   deity: '毗湿奴', quality: '学习、连结' },
  { name: 'Dhanishtha',   nameCN: '女宿',   ruler: 'Mars（火星）',   deity: '八神将', quality: '财富、音乐' },
  { name: 'Shatabhisha',  nameCN: '虚宿',   ruler: 'Rahu（北交）',   deity: '伐楼拿（水神）', quality: '治愈、秘密' },
  { name: 'Purva Bhadra', nameCN: '危宿',   ruler: 'Jupiter（木星）',deity: '阿里亚曼（受苦神）', quality: '悲剧与救赎' },
  { name: 'Uttara Bhadra',nameCN: '室宿',   ruler: 'Saturn（土星）', deity: '阿希尔布德尼亚', quality: '深度、智慧' },
  { name: 'Revati',       nameCN: '壁宿',   ruler: 'Mercury（水星）',deity: '普善（庇护神）', quality: '旅途、慈悲' },
]

// Vimshottari Dasha 大运顺序（总共120年）
const DASHA_SEQUENCE = [
  { planet: 'Ketu（南交）', years: 7, nameCN: '南交大运' },
  { planet: 'Venus（金星）', years: 20, nameCN: '金星大运' },
  { planet: 'Sun（太阳）', years: 6, nameCN: '太阳大运' },
  { planet: 'Moon（月亮）', years: 10, nameCN: '月亮大运' },
  { planet: 'Mars（火星）', years: 7, nameCN: '火星大运' },
  { planet: 'Rahu（北交）', years: 18, nameCN: '北交大运' },
  { planet: 'Jupiter（木星）', years: 16, nameCN: '木星大运' },
  { planet: 'Saturn（土星）', years: 19, nameCN: '土星大运' },
  { planet: 'Mercury（水星）', years: 17, nameCN: '水星大运' },
]

/** 计算儒略日（Julian Day Number），精确到小时 */
function julianDay(year: number, month: number, day: number, hour = 12): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y
    + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  return jdn - 0.5 + hour / 24
}

function toRad(deg: number) { return deg * Math.PI / 180 }
function norm360(deg: number) { return ((deg % 360) + 360) % 360 }

/**
 * 计算月亮回归黄经（Meeus 简化公式，精度约 ±1°）
 * 参考: Jean Meeus "Astronomical Algorithms" Ch.22
 */
function moonTropicalLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525  // J2000.0 起的儒略世纪

  // 月亮平均黄经 L'
  const Lp = norm360(218.3164477 + 481267.88123421 * T)
  // 太阳平均异点角 M
  const M  = norm360(357.5291092 + 35999.0502909  * T)
  // 月亮平均异点角 Mp
  const Mp = norm360(134.9633964 + 477198.8675055  * T)
  // 月亮与太阳升交点的平均角距（平均角距）D
  const D  = norm360(297.8501921 + 445267.1114034  * T)
  // 月亮轨道升交点平均黄经 F（用于纬度，这里仅用于改正）
  const F  = norm360(93.2720950  + 483202.0175233  * T)

  // 主要摄动改正项（Meeus Table 22.A 前若干项）
  const dL =
      6.289 * Math.sin(toRad(Mp))
    - 1.274 * Math.sin(toRad(2 * D - Mp))
    + 0.658 * Math.sin(toRad(2 * D))
    - 0.214 * Math.sin(toRad(2 * Mp))
    - 0.110 * Math.sin(toRad(D))
    + 0.057 * Math.sin(toRad(2 * D - 2 * Mp))  // 额外项，提升精度
    - 0.056 * Math.sin(toRad(2 * D + Mp))
    + 0.053 * Math.sin(toRad(2 * D + M - Mp))
    + 0.046 * Math.sin(toRad(2 * D - M))
    + 0.041 * Math.sin(toRad(Mp - M))
    - 0.035 * Math.sin(toRad(D))
    - 0.031 * Math.sin(toRad(Mp + M))
    - 0.015 * Math.sin(toRad(2 * F - 2 * D))
    + 0.011 * Math.sin(toRad(2 * Mp - 2 * D))

  return norm360(Lp + dL)
}

/**
 * Lahiri 恒星黄道差（Ayanamsha），单位度
 * 近似公式：J2000.0 时约 23.856°，每年增加约 0.01397°
 */
function lahiriAyanamsha(year: number, month: number, day: number): number {
  const jd = julianDay(year, month, day, 0)
  const T = (jd - 2451545.0) / 36525
  return 23.856 + 0.01397 * T * 100  // T是世纪，乘100得年
}

export function calculateVedic(
  birthYear: number, birthMonth: number, birthDay: number,
  birthHour: number | null = null
): VedicResult {
  const hour = birthHour ?? 12  // 不知道出生时间默认正午

  // 1. 计算儒略日
  const jd = julianDay(birthYear, birthMonth, birthDay, hour)

  // 2. 月亮回归黄经
  const tropicalMoon = moonTropicalLongitude(jd)

  // 3. 转换为恒星黄经（减去 Lahiri 岁差）
  const ayanamsha = lahiriAyanamsha(birthYear, birthMonth, birthDay)
  const siderealDeg = norm360(tropicalMoon - ayanamsha)

  // 4. 确定 Rashi 和宫内度数
  const rashiIndex = Math.floor(siderealDeg / 30)
  const degreeInSign = siderealDeg - rashiIndex * 30
  const rashi = RASHIS[rashiIndex]

  // 5. 确定 Nakshatra（每宿 13°20' = 13.333°，共27宿）
  const nakshatraIndex = Math.floor((siderealDeg * 27) / 360) % 27
  const nakshatra = NAKSHATRAS[nakshatraIndex]

  // 6. 当前大运（基于 Nakshatra 主星决定大运起点）
  const dashaStart = DASHA_SEQUENCE.findIndex(d => d.planet.includes(nakshatra.ruler.split('（')[0]))
  const currentAge = new Date().getFullYear() - birthYear
  let accumulated = 0
  let currentDasha = DASHA_SEQUENCE[dashaStart >= 0 ? dashaStart : 0]
  for (let i = 0; i < 9; i++) {
    const idx = (dashaStart + i) % 9
    accumulated += DASHA_SEQUENCE[idx].years
    if (accumulated > currentAge % 120) {
      currentDasha = DASHA_SEQUENCE[idx]
      break
    }
  }

  // 7. Rahu/Ketu 轴（与月亮相对的宫位）
  const rahuSign = RASHIS[(rashiIndex + 6) % 12]

  const degStr = `${Math.floor(degreeInSign)}°${Math.round((degreeInSign % 1) * 60)}'`

  return {
    moonRashi: rashi,
    nakshatra,
    currentDasha,
    rahuSign: rahuSign.nameCN,
    ketuSign: rashi.nameCN,
    moonDegree: degStr,
    summary: `你的月亮落在${rashi.nameCN}（${rashi.name}）${degStr}，守护星为${rashi.ruler}，${rashi.quality}属性。生命能量运行在${nakshatra.nameCN}（${nakshatra.name}），代表「${nakshatra.quality}」，守护神为${nakshatra.deity}。当前处于${currentDasha.nameCN}（${currentDasha.planet}），此阶段将持续${currentDasha.years}年。`,
  }
}
