import type { VedicResult } from '@/types'

// 吠陀占星（Jyotish）简化版
// 与西洋占星的核心差异：
// 1. 用恒星黄道（Sidereal）而非回归黄道，当前差约23度（差将近一个星座）
// 2. 重视月亮星座（Rashi）多于太阳星座
// 3. Rahu（北交）/ Ketu（南交）作为独立天体有极大影响
// 4. 大运系统（Dasha）预测具体人生阶段

// 12 宫（Rashi）
const RASHIS = [
  { name: 'Mesha',     nameCN: '白羊宫（摩羯）', ruler: '火星', element: '火', quality: '基本' },
  { name: 'Vrishabha', nameCN: '金牛宫（水瓶）', ruler: '金星', element: '土', quality: '固定' },
  { name: 'Mithuna',   nameCN: '双子宫（双鱼）', ruler: '水星', element: '风', quality: '变动' },
  { name: 'Karka',     nameCN: '巨蟹宫（白羊）', ruler: '月亮', element: '水', quality: '基本' },
  { name: 'Simha',     nameCN: '狮子宫（金牛）', ruler: '太阳', element: '火', quality: '固定' },
  { name: 'Kanya',     nameCN: '处女宫（双子）', ruler: '水星', element: '土', quality: '变动' },
  { name: 'Tula',      nameCN: '天秤宫（巨蟹）', ruler: '金星', element: '风', quality: '基本' },
  { name: 'Vrischika', nameCN: '天蝎宫（狮子）', ruler: '火星', element: '水', quality: '固定' },
  { name: 'Dhanu',     nameCN: '射手宫（处女）', ruler: '木星', element: '火', quality: '变动' },
  { name: 'Makara',    nameCN: '摩羯宫（天秤）', ruler: '土星', element: '土', quality: '基本' },
  { name: 'Kumbha',    nameCN: '水瓶宫（天蝎）', ruler: '土星', element: '风', quality: '固定' },
  { name: 'Meena',     nameCN: '双鱼宫（射手）', ruler: '木星', element: '水', quality: '变动' },
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

export function calculateVedic(
  birthYear: number, birthMonth: number, birthDay: number
): VedicResult {
  // 吠陀月亮星座近似：将西洋太阳星座向前推约一个星座（23度差）
  const approxSunDeg = (birthMonth - 1) * 30 + (birthDay - 1) * (30 / 30.5)
  const siderealDeg = (approxSunDeg - 23 + 360) % 360
  const rashiIndex = Math.floor(siderealDeg / 30)
  const rashi = RASHIS[rashiIndex]

  // Nakshatra（每个27.25度，但简化为13.33度每宿）
  const nakshatraIndex = Math.floor((siderealDeg * 27) / 360) % 27
  const nakshatra = NAKSHATRAS[nakshatraIndex]

  // 当前大运（简化：基于Nakshatra主星决定大运起点）
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

  // Rahu/Ketu 轴（固定18年周期，简化）
  const rahuSign = RASHIS[(rashiIndex + 6) % 12]

  return {
    moonRashi: rashi,
    nakshatra,
    currentDasha,
    rahuSign: rahuSign.nameCN,
    ketuSign: rashi.nameCN,
    summary: `你的月亮落在${rashi.nameCN}（${rashi.name}），守护星为${rashi.ruler}，${rashi.quality}属性。生命能量运行在${nakshatra.nameCN}（${nakshatra.name}），代表「${nakshatra.quality}」，守护神为${nakshatra.deity}。当前处于${currentDasha.nameCN}（${currentDasha.planet}），此阶段将持续${currentDasha.years}年。`,
  }
}
