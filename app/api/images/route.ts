import { NextRequest, NextResponse } from 'next/server'

// 图片 + Pinterest 链接响应
// images: 缩略图 URL 数组
// links:  对应的 Pinterest pin 页面（SerpAPI）或 Pinterest 搜索页（Mock）
// source: 'serpapi' | 'mock'

// 按 LuckyItem.category 分组的 mock 缩略图
const CATEGORY_IMAGES: Record<string, string[]> = {
  crystal: [
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
  ],
  jewelry: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
    'https://images.unsplash.com/photo-1573408301185-9519e4e8b822?w=400',
  ],
  plant: [
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400',
  ],
  color: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400',
  ],
  number: [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
  ],
  symbol: [
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400',
    'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=400',
  ],
  other: [
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400',
    'https://images.unsplash.com/photo-1603145733146-ae562a55031e?w=400',
  ],
}

// 关键词精细匹配
const KEYWORD_IMAGES: Record<string, string[]> = {
  amethyst: [
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    'https://images.unsplash.com/photo-1573408301185-9519e4e8b822?w=400',
  ],
  'rose quartz': [
    'https://images.unsplash.com/photo-1574169208507-843761e11a3f?w=400',
    'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=400',
  ],
  'clear quartz': [
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400',
  ],
  citrine: [
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400',
  ],
  jade: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
    'https://images.unsplash.com/photo-1611268586552-3e0c12e2be2b?w=400',
  ],
  obsidian: [
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400',
  ],
  bracelet: [
    'https://images.unsplash.com/photo-1573408301185-9519e4e8b822?w=400',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400',
  ],
  necklace: [
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
    'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400',
  ],
  pendant: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  ],
  candle: [
    'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=400',
    'https://images.unsplash.com/photo-1543769657-fcf1cf68bddc?w=400',
  ],
  incense: [
    'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?w=400',
    'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400',
  ],
  lavender: [
    'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=400',
    'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=400',
  ],
  lotus: [
    'https://images.unsplash.com/photo-1559827291-72ebf3d822d5?w=400',
    'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400',
  ],
  bamboo: [
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400',
  ],
  gold: [
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400',
  ],
  essential: [
    'https://images.unsplash.com/photo-1592845585382-13e671d3a8d7?w=400',
    'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400',
  ],
}

function findMockImages(query: string, category?: string): string[] {
  const q = query.toLowerCase()
  // 精确关键词优先
  for (const [key, imgs] of Object.entries(KEYWORD_IMAGES)) {
    if (q.includes(key)) return imgs
  }
  // 按类别回退
  if (category && CATEGORY_IMAGES[category]) return CATEGORY_IMAGES[category]
  return CATEGORY_IMAGES.other
}

// 各平台对应的 site 过滤域名
const PLATFORM_SITE: Record<string, string> = {
  pinterest: 'pinterest.com',
  shein:     'shein.com',
  amazon:    'amazon.com',
}

// Mock 模式各平台搜索落地页
function mockPlatformLink(platform: string, query: string): string {
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

  const siteDomain = PLATFORM_SITE[platform] ?? 'pinterest.com'

  // ── SerpAPI 模式 ──────────────────────────────────────────────────
  const serpApiKey = process.env.SERPAPI_KEY
  if (serpApiKey && query) {
    try {
      const url = new URL('https://serpapi.com/search')
      url.searchParams.set('engine', 'google_images')
      url.searchParams.set('q', `${query} site:${siteDomain}`)
      url.searchParams.set('num', '5')
      url.searchParams.set('hl', 'zh-CN')
      url.searchParams.set('api_key', serpApiKey)

      const resp = await fetch(url.toString())
      const data = await resp.json()

      const results: Array<{ original?: string; thumbnail: string; link: string }> =
        (data.images_results ?? []).slice(0, 5)

      const images = results.map(r => {
        // Pinterest 图片优先用 i.pinimg.com 直链，降至 474x 省流量
        if (r.original?.includes('i.pinimg.com')) {
          return r.original.replace(/\/\d+x\//, '/474x/')
        }
        return r.thumbnail
      })
      // Pinterest 保留具体 pin 页；购物平台统一跳搜索结果页，避免售罄/下架
      const searchLink = mockPlatformLink(platform, query)
      const links = results.map(r =>
        platform === 'pinterest' ? r.link : searchLink
      )

      return NextResponse.json({ images, links, source: 'serpapi' })
    } catch {
      // fallback to mock
    }
  }

  // ── Mock 模式 ──────────────────────────────────────────────────────
  const images = findMockImages(query, category)
  const fallbackLink = mockPlatformLink(platform, query)
  const links = images.map(() => fallbackLink)

  return NextResponse.json({ images, links, source: 'mock' })
}
