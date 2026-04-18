import { NextRequest, NextResponse } from 'next/server'

// ── 各平台搜索落地页 URL ───────────────────────────────────────────────
function platformSearchLink(platform: string, query: string): string {
  const q = encodeURIComponent(query)
  switch (platform) {
    case 'shein':  return `https://www.shein.com/search?keyword=${q}`
    case 'etsy':   return `https://www.etsy.com/search?q=${q}`
    case 'amazon': return `https://www.amazon.com/s?k=${q}`
    default:       return `https://www.pinterest.com/search/pins/?q=${q}`
  }
}

// ── Fallback：精选 Unsplash 图库（按类别）────────────────────────────
const CATEGORY_FALLBACK: Record<string, string[]> = {
  crystal:  [
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&fit=crop&h=500',
  ],
  jewelry:  [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1573408301185-9519e4e8b822?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&fit=crop&h=500',
  ],
  clothing: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&fit=crop&h=500',
  ],
  plant:    [
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&fit=crop&h=500',
  ],
  symbol:   [
    'https://images.unsplash.com/photo-1572076003973-17a6f3fd4d73?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1603145733146-ae562a55031e?w=500&fit=crop&h=500',
  ],
  color:    [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&fit=crop&h=500',
  ],
  number:   [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&fit=crop&h=500',
  ],
  other:    [
    'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=500&fit=crop&h=500',
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&fit=crop&h=500',
  ],
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query    = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? 'other'
  const platform = searchParams.get('platform') ?? 'pinterest'
  const searchLink = platformSearchLink(platform, query)

  // 按类别追加修饰词，让 Unsplash 返回更像产品图的结果
  const CATEGORY_SUFFIX: Record<string, string> = {
    crystal:  'crystal gemstone healing jewelry',
    jewelry:  'jewelry accessory product',
    clothing: 'fashion outfit style women',
    plant:    'aromatherapy botanical product bottle',
    symbol:   'spiritual mystical charm',
    color:    'fashion lifestyle aesthetic',
    number:   'minimal design art',
    other:    'product lifestyle',
  }
  const enhancedQuery = query + ' ' + (CATEGORY_SUFFIX[category] ?? 'product')

  // ── Unsplash API（免费 50 req/hr，需 UNSPLASH_ACCESS_KEY）───────────
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY
  if (unsplashKey && query) {
    try {
      const url = new URL('https://api.unsplash.com/search/photos')
      url.searchParams.set('query', enhancedQuery)
      url.searchParams.set('per_page', '4')
      url.searchParams.set('orientation', 'squarish')
      url.searchParams.set('order_by', 'relevant')

      const resp = await fetch(url.toString(), {
        headers: { Authorization: `Client-ID ${unsplashKey}` },
      })
      const data = await resp.json()
      const results: Array<{ urls: { small: string } }> = data.results ?? []

      if (results.length > 0) {
        const images = results.map(r => r.urls.small)
        const links  = images.map(() => searchLink)
        return NextResponse.json({ images, links, source: 'unsplash' })
      }
    } catch { /* fallback */ }
  }

  // ── Fallback：按类别返回精选图片 ─────────────────────────────────────
  const images = CATEGORY_FALLBACK[category] ?? CATEGORY_FALLBACK.other
  const links  = images.map(() => searchLink)
  return NextResponse.json({ images, links, source: 'mock' })
}
