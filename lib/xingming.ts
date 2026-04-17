import type { XingmingResult } from '@/types'

// 常用汉字笔画数（简化版）— 拆分两个对象后合并，避免重复键的 TS 报错
// 生产版本应使用完整字典或 API
const _BASE_STROKES = {
  一:1,乙:1,二:2,人:2,力:2,八:2,十:2,三:3,大:3,山:3,川:3,小:3,女:3,子:3,也:3,
  中:4,天:4,元:4,云:4,木:4,水:4,火:4,心:4,月:4,
  东:5,北:5,半:5,本:5,出:5,代:5,电:5,可:5,民:5,平:5,生:5,世:5,玉:5,正:5,
  成:6,地:6,多:6,帆:6,光:6,合:6,华:6,机:6,年:6,全:6,如:6,色:6,西:6,行:6,有:6,羽:6,在:6,舟:6,
  苍:7,长:7,志:7,形:7,远:7,运:7,言:7,应:7,英:7,花:7,
  佳:8,京:8,来:8,明:8,命:8,青:8,奇:8,其:8,岩:8,幸:8,忠:8,知:8,
  春:9,飞:9,皇:9,建:9,美:9,南:9,前:9,秋:9,星:9,信:9,亮:9,
  峰:10,海:10,烈:10,凌:10,浩:10,家:10,桂:10,健:10,洁:10,莲:10,凤:10,
  彬:11,晨:11,得:11,梦:11,乾:11,清:11,绿:11,雪:11,
  博:12,超:12,朝:12,富:12,涵:12,晶:12,盛:12,惠:12,然:12,
  慈:13,豪:13,嘉:13,蒙:13,瑞:13,睿:13,
  赫:14,赏:14,璐:15,霖:16,薇:16,
}

// 常见姓氏（可能与上方字重复，spread时后者覆盖前者，笔画数正确即可）
const _SURNAME_STROKES = {
  李:7,王:4,张:7,刘:6,陈:7,杨:7,赵:9,黄:11,周:8,吴:7,徐:10,孙:10,胡:9,朱:6,高:10,林:8,何:7,郭:10,马:3,罗:8,梁:11,宋:7,郑:8,谢:12,韩:12,唐:10,冯:7,于:3,董:12,萧:11,程:12,曹:11,袁:10,邓:4,许:6,傅:12,沈:7,曾:12,彭:12,吕:6,苏:7,卢:5,蒋:13,蔡:14,贾:13,丁:2,魏:17,薛:16,叶:5,阎:11,余:7,潘:15,杜:7,戴:17,夏:10,钟:9,汪:7,田:5,任:6,姜:9,范:9,方:4,石:5,姚:9,谭:19,廖:13,邹:14,熊:14,金:8,陆:7,郝:9,孔:4,白:5,崔:11,康:11,毛:4,邱:7,秦:10,江:6,史:5,顾:19,侯:9,邵:7,孟:8,龙:5,万:3,段:9,漕:14,钱:10,汤:6,尹:4,黎:15,易:8,常:11,武:8,乔:6,贺:12,赖:16,龚:10,庞:7,樊:15,殷:10,施:9,陶:10,洪:9,翟:14,颜:15,倪:10,严:7,牛:4,温:12,芦:7,季:8,俞:9,章:11,鲁:15,葛:12,伍:6,韦:9,申:5,尤:4,毕:6,聂:17,丛:5,焦:12,向:6,邢:6,岳:8,齐:6,沿:7,莫:11,庄:6,辛:7,管:14,祝:10,左:5,涂:10,谷:7,祁:8,舒:12,耿:10,牟:6,卜:2,詹:13,
}

const STROKE_MAP: Record<string, number> = { ..._BASE_STROKES, ..._SURNAME_STROKES }

function getStrokes(char: string): number {
  return STROKE_MAP[char] ?? (char.codePointAt(0)! % 15 + 3) // fallback
}

// 三才五格算法
function calcFiveGrid(name: string) {
  const chars = Array.from(name)
  const strokes = chars.map(getStrokes)

  // 姓为一格，名字分两格
  const tianGe = strokes.length >= 1 ? strokes[0] + 1 : 1          // 天格 = 姓笔画 + 1
  const renGe = strokes.length >= 2                                  // 人格 = 姓末 + 名首
    ? strokes[0] + strokes[1]
    : strokes[0]
  const diGe = strokes.length >= 3                                   // 地格 = 名全部 + 1
    ? strokes.slice(1).reduce((a, b) => a + b, 0) + 1
    : strokes[strokes.length - 1] + 1
  const zongGe = strokes.reduce((a, b) => a + b, 0)                 // 总格 = 全部
  const waiGe = tianGe + diGe - renGe                               // 外格

  return { tianGe, renGe, diGe, zongGe, waiGe, strokes }
}

// 五格数字吉凶（简化版，基于传统81数理）
const GUA_TABLE: Record<number, { ji: '大吉' | '吉' | '平' | '凶' | '大凶'; desc: string }> = {
  1:  { ji: '大吉', desc: '万物之源，领袖之数，创业成功' },
  2:  { ji: '凶',   desc: '二分对立，缺乏统一，需合作' },
  3:  { ji: '吉',   desc: '才华洋溢，活力充沛，表达力强' },
  4:  { ji: '凶',   desc: '孤苦无依，运途多苦，需坚韧' },
  5:  { ji: '大吉', desc: '五行圆满，处世圆融，稳健发展' },
  6:  { ji: '吉',   desc: '六合吉祥，家庭美满，助人为乐' },
  7:  { ji: '吉',   desc: '独立自强，刚毅果断，奋斗成功' },
  8:  { ji: '吉',   desc: '意志坚强，努力上进，终获成功' },
  9:  { ji: '凶',   desc: '博爱之数，易有始无终，太过理想' },
  10: { ji: '凶',   desc: '零落之数，成败参半，需注意' },
  11: { ji: '吉',   desc: '博爱公正，发展顺利，名誉佳' },
  12: { ji: '凶',   desc: '孤苦伶仃，意志薄弱，困难多' },
  13: { ji: '吉',   desc: '智慧聪明，才华横溢，成就大' },
  14: { ji: '凶',   desc: '离散之数，人心不合，运途不稳' },
  15: { ji: '大吉', desc: '福寿圆满，人缘极佳，大器晚成' },
  16: { ji: '吉',   desc: '贵人相助，人脉广厚，成功顺畅' },
  17: { ji: '吉',   desc: '积极进取，刚毅勇敢，稳步向上' },
  18: { ji: '吉',   desc: '发展顺利，有发展潜力，明智果断' },
  19: { ji: '凶',   desc: '苦难重重，需要磨练，后期可成' },
  20: { ji: '凶',   desc: '虚数空数，一事无成，需努力' },
  21: { ji: '大吉', desc: '独立领袖，意志力强，事业成功' },
  22: { ji: '凶',   desc: '秋草逢霜，运途坎坷，需坚持' },
  23: { ji: '大吉', desc: '旭日东升，前途光明，名利双收' },
  24: { ji: '吉',   desc: '家庭幸福，财运颇佳，安乐一生' },
  25: { ji: '吉',   desc: '英俊才智，自力更生，成就不凡' },
}

function lookup(n: number) {
  const reduced = n > 81 ? (n % 81 || 81) : n
  return GUA_TABLE[reduced] ?? { ji: '平' as const, desc: `${reduced}数，平稳之象` }
}

export function analyzeXingming(name: string): XingmingResult {
  if (!name || name.length < 2) {
    return {
      name,
      strokes: [],
      tianGe: 0, renGe: 0, diGe: 0, zongGe: 0, waiGe: 0,
      ratings: { tianGe: { ji: '平', desc: '名字太短' }, renGe: { ji: '平', desc: '' }, diGe: { ji: '平', desc: '' }, zongGe: { ji: '平', desc: '' }, waiGe: { ji: '平', desc: '' } },
      sancai: '未知',
      summary: '请输入两字以上的名字以进行五格分析',
    }
  }

  const { tianGe, renGe, diGe, zongGe, waiGe, strokes } = calcFiveGrid(name)

  const ratings = {
    tianGe: lookup(tianGe),
    renGe:  lookup(renGe),
    diGe:   lookup(diGe),
    zongGe: lookup(zongGe),
    waiGe:  lookup(waiGe),
  }

  // 三才：天格/人格/地格 奇偶 → 阴阳
  const yin = (n: number) => n % 2 === 0 ? '阴' : '阳'
  const sancai = `${yin(tianGe)}${yin(renGe)}${yin(diGe)}`

  const goodCount = Object.values(ratings).filter(r => r.ji === '大吉' || r.ji === '吉').length
  const summary = goodCount >= 4
    ? `五格大多吉祥，${name}这个名字具有很好的能量格局`
    : goodCount >= 2
    ? `五格较为均衡，${name}这个名字有发展潜力，人格运最关键`
    : `五格偏弱，${name}这个名字需要以后天努力弥补先天格局`

  return { name, strokes, tianGe, renGe, diGe, zongGe, waiGe, ratings, sancai, summary }
}
