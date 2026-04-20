import { NextRequest, NextResponse } from 'next/server'

// ── 淘宝联盟配置 ──────────────────────────────────────────
// 审核通过后在推广位管理里拿到 pid，填在这里
const TAOBAO_PID = process.env.TAOBAO_PID ?? ''  // mm_xxxxxxxx_xxxxxxxx_xxxxxxxx

// Amazon Associates tag（全球用户）
const AMAZON_TAG = process.env.AMAZON_TAG ?? ''   // yoursite-20

// ── 生成淘宝联盟推广链接 ──────────────────────────────────
function buildTaobaoLink(query: string): string {
  const q = encodeURIComponent(query)
  if (!TAOBAO_PID) {
    // pid 未配置时直接跳搜索页（无联盟追踪）
    return `https://s.taobao.com/search?q=${q}`
  }
  // 淘宝联盟标准搜索推广链接格式
  return `https://uland.taobao.com/search/search?keyword=${q}&pid=${TAOBAO_PID}`
}

// ── 生成 Amazon 联盟链接 ──────────────────────────────────
function buildAmazonLink(query: string, country: string): string {
  const q = encodeURIComponent(query)
  const domainMap: Record<string, string> = {
    GB: 'amazon.co.uk', AU: 'amazon.com.au', JP: 'amazon.co.jp', CA: 'amazon.ca',
  }
  const domain = domainMap[country] ?? 'amazon.com'
  const tag = AMAZON_TAG ? `&tag=${AMAZON_TAG}` : ''
  return `https://www.${domain}/s?k=${q}${tag}`
}

// ── 其他平台直链（暂无联盟） ──────────────────────────────
function buildDirectLink(platform: string, query: string, queryZH: string, country: string): string {
  const q  = encodeURIComponent(query)
  const qz = encodeURIComponent(queryZH)
  switch (platform) {
    case 'xiachufang':  return `https://www.xiachufang.com/search/?keyword=${qz}`
    case 'xiaohongshu': return `https://www.xiaohongshu.com/search_result/?keyword=${qz}&type=54`
    case 'shopee': {
      const map: Record<string, string> = { TW: 'shopee.tw', HK: 'shopee.hk', SG: 'shopee.sg', MY: 'shopee.com.my' }
      return `https://${map[country] ?? 'shopee.sg'}/search?keyword=${q}`
    }
    case 'lazada': {
      const map: Record<string, string> = { SG: 'lazada.sg', MY: 'www.lazada.com.my' }
      return `https://${map[country] ?? 'lazada.sg'}/catalog/?q=${q}`
    }
    case 'etsy':    return `https://www.etsy.com/search?q=${q}`
    case 'shein':   return `https://www.shein.com/search?keyword=${q}`
    case 'asos':    return `https://www.asos.com/search/?q=${q}`
    case 'rakuten': return `https://search.rakuten.co.jp/search/mall/${qz}/`
    case 'coupang': return `https://www.coupang.com/np/search?q=${q}`
    default:        return `https://www.pinterest.com/search/pins/?q=${q}`
  }
}

// ── API 入口 ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const platform = searchParams.get('platform') ?? ''
  const q        = searchParams.get('q') ?? ''
  const qzh      = searchParams.get('qzh') ?? q
  const country  = searchParams.get('country') ?? 'other'

  let dest: string

  switch (platform) {
    case 'taobao':
      dest = buildTaobaoLink(qzh || q)
      break
    case 'amazon':
      dest = buildAmazonLink(q, country)
      break
    default:
      dest = buildDirectLink(platform, q, qzh, country)
  }

  // 点击统计（在 Vercel Functions 日志中可见）
  console.log(JSON.stringify({
    event: 'aff_click',
    platform,
    query: q || qzh,
    country,
    ts: new Date().toISOString(),
  }))

  // 302 跳转到目标页
  return NextResponse.redirect(dest, { status: 302 })
}
