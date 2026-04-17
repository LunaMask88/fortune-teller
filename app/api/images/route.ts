import { NextRequest, NextResponse } from 'next/server'

// ── Mock image library ─────────────────────────────────────────────────
// 按关键词精细匹配 → 按 category 兜底
const KEYWORD_IMAGES: Array<[string[], string[]]> = [
  // 水晶 crystals
  [['amethyst', '紫水晶'],       ['https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500&fit=crop&h=500']],
  [['rose quartz', '粉晶', '玫瑰晶'], ['https://images.unsplash.com/photo-1574169208507-843761e11a3f?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1511551203524-9a24350a5771?w=500&fit=crop&h=500']],
  [['clear quartz', '白水晶'],    ['https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1603145733146-ae562a55031e?w=500&fit=crop&h=500']],
  [['citrine', '黄水晶', '黄晶'],  ['https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500']],
  [['obsidian', '黑曜石'],        ['https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1491295440550-e7f8a6e47bf8?w=500&fit=crop&h=500']],
  [['jade', '玉', '翡翠', '绿玉'],  ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1611268586552-3e0c12e2be2b?w=500&fit=crop&h=500']],
  [['turquoise', '绿松石'],        ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1573408301185-9519e4e8b822?w=500&fit=crop&h=500']],
  [['lapis', '青金石'],           ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1511551203524-9a24350a5771?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1491295440550-e7f8a6e47bf8?w=500&fit=crop&h=500']],
  [['tiger eye', '虎眼石'],       ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500&fit=crop&h=500']],
  [['green phantom', '绿幽灵'],   ['https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500&fit=crop&h=500']],
  [['moonstone', '月光石'],       ['https://images.unsplash.com/photo-1511551203524-9a24350a5771?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=500&fit=crop&h=500']],
  // 饰品 jewelry
  [['bracelet', '手链', '手环'],   ['https://images.unsplash.com/photo-1573408301185-9519e4e8b822?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&fit=crop&h=500']],
  [['necklace', '项链'],          ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&fit=crop&h=500']],
  [['pendant', '吊坠', '挂坠'],   ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&fit=crop&h=500']],
  [['earring', '耳环', '耳饰'],   ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1573408301185-9519e4e8b822?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&fit=crop&h=500']],
  [['ring', '戒指', '指环'],      ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&fit=crop&h=500']],
  [['gold', '黄金', '金色'],      ['https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&fit=crop&h=500']],
  [['silver', '白银', '银色'],    ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1573408301185-9519e4e8b822?w=500&fit=crop&h=500']],
  // 香薰/植物 aromatherapy/plants
  [['lavender', '薰衣草'],        ['https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&fit=crop&h=500']],
  [['rose', '玫瑰', '蔷薇'],      ['https://images.unsplash.com/photo-1490750967868-88df5691cc6a?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1548094878-84ced0f33b3c?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1559508551-44bff1de756b?w=500&fit=crop&h=500']],
  [['jasmine', '茉莉'],           ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=500&fit=crop&h=500']],
  [['sandalwood', '檀香', '檀木'], ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1543769657-fcf1cf68bddc?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?w=500&fit=crop&h=500']],
  [['incense', '香薰', '熏香'],   ['https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1543769657-fcf1cf68bddc?w=500&fit=crop&h=500']],
  [['essential oil', '精油', '香精'], ['https://images.unsplash.com/photo-1592845585382-13e671d3a8d7?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&fit=crop&h=500']],
  [['candle', '蜡烛'],            ['https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1543769657-fcf1cf68bddc?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1608831540955-c5cd6af0e1fe?w=500&fit=crop&h=500']],
  [['bamboo', '竹'],              ['https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&fit=crop&h=500']],
  [['lotus', '莲花', '荷花'],     ['https://images.unsplash.com/photo-1559827291-72ebf3d822d5?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1463836035080-3de66f43a6cf?w=500&fit=crop&h=500']],
  [['sage', '鼠尾草', '白鼠尾草'], ['https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&fit=crop&h=500']],
  [['mint', '薄荷'],              ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&fit=crop&h=500']],
  // 符文/符号
  [['rune', '符文'],              ['https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1603145733146-ae562a55031e?w=500&fit=crop&h=500']],
  [['tarot', '塔罗'],             ['https://images.unsplash.com/photo-1572076003973-17a6f3fd4d73?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=500&fit=crop&h=500']],
  // 颜色/织物
  [['blue', '蓝色'],              ['https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop&h=500']],
  [['red', '红色', '朱砂'],       ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1548094878-84ced0f33b3c?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1490750967868-88df5691cc6a?w=500&fit=crop&h=500']],
  [['green', '绿色'],             ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&fit=crop&h=500']],
  [['yellow', '黄色'],            ['https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop&h=500']],
  [['purple', 'violet', '紫色'], ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1511551203524-9a24350a5771?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500']],
  [['white', '白色'],             ['https://images.unsplash.com/photo-1603145733146-ae562a55031e?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500']],
  // 数字
  [['number', 'numeral', '数字', '数'],  ['https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&fit=crop&h=500', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&fit=crop&h=500']],
]

const CATEGORY_IMAGES: Record<string, string[]> = {
  crystal: [
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&fit=crop&h=500',
  ],
  jewelry: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1573408301185-9519e4e8b822?w=500&fit=crop&h=500',
  ],
  plant: [
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500&fit=crop&h=500',
  ],
  color: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=500&fit=crop&h=500',
  ],
  number: [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&fit=crop&h=500',
  ],
  symbol: [
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1572076003973-17a6f3fd4d73?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=500&fit=crop&h=500',
  ],
  other: [
    'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1603145733146-ae562a55031e?w=500&fit=crop&h=500',
  ],
}

function findMockImages(query: string, category?: string): string[] {
  const q = (query + ' ' + (category ?? '')).toLowerCase()
  for (const [keys, imgs] of KEYWORD_IMAGES) {
    if (keys.some(k => q.includes(k.toLowerCase()))) return imgs
  }
  return CATEGORY_IMAGES[category ?? 'other'] ?? CATEGORY_IMAGES.other
}

// ── 各平台搜索落地页 URL ───────────────────────────────────────────────
function platformSearchLink(platform: string, query: string): string {
  const q = encodeURIComponent(query)
  switch (platform) {
    case 'shein':  return `https://www.shein.com/search?keyword=${q}`
    case 'amazon': return `https://www.amazon.com/s?k=${q}`
    default:       return `https://www.pinterest.com/search/pins/?q=${q}`
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query    = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? undefined
  const platform = searchParams.get('platform') ?? 'pinterest'
  const searchLink = platformSearchLink(platform, query)

  // ── Pixabay API（免费，每小时 20k 次）───────────────────────────────
  const pixabayKey = process.env.PIXABAY_API_KEY
  if (pixabayKey && query) {
    try {
      const url = new URL('https://pixabay.com/api/')
      url.searchParams.set('key', pixabayKey)
      url.searchParams.set('q', query)
      url.searchParams.set('image_type', 'photo')
      url.searchParams.set('per_page', '5')
      url.searchParams.set('safesearch', 'true')
      url.searchParams.set('orientation', 'vertical')

      const resp = await fetch(url.toString())
      const data = await resp.json()
      const hits: Array<{ webformatURL: string }> = data.hits ?? []

      if (hits.length > 0) {
        const images = hits.slice(0, 4).map(h => h.webformatURL)
        const links  = images.map(() => searchLink)
        return NextResponse.json({ images, links, source: 'pixabay' })
      }
      // 无结果 → 跌落到 mock
    } catch { /* fallback */ }
  }

  // ── Mock（Unsplash 精选图库）─────────────────────────────────────────
  const images = findMockImages(query, category)
  const links  = images.map(() => searchLink)

  return NextResponse.json({ images, links, source: 'mock' })
}
