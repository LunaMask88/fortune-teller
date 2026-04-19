'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { LuckyItem } from '@/types'
import { useLang } from '@/contexts/LangContext'

interface Props { items?: LuckyItem[]; country?: string }

// ── 平台定义 ──────────────────────────────────────────────────────────
const P = {
  pinterest: { id: 'pinterest', label: 'Pinterest', color: '#e60023', badge: 'P' },
  taobao:    { id: 'taobao',    label: '淘宝',       color: '#ff5000', badge: '淘' },
  xiaohongshu:{ id: 'xiaohongshu', label: '小红书',  color: '#fe2c55', badge: '红' },
  shopee:    { id: 'shopee',    label: 'Shopee',    color: '#ee4d2d', badge: 'S' },
  lazada:    { id: 'lazada',    label: 'Lazada',    color: '#0f146d', badge: 'L' },
  amazon:    { id: 'amazon',    label: 'Amazon',    color: '#ff9900', badge: 'A' },
  etsy:      { id: 'etsy',      label: 'Etsy',      color: '#f1641e', badge: 'E' },
  shein:     { id: 'shein',     label: 'SHEIN',     color: '#9ca3af', badge: 'S' },
  asos:      { id: 'asos',      label: 'ASOS',      color: '#2d2d2d', badge: 'A' },
  rakuten:   { id: 'rakuten',   label: '楽天',       color: '#bf0000', badge: '楽' },
  coupang:   { id: 'coupang',   label: 'Coupang',   color: '#00bbd8', badge: 'C' },
}

// 国家分组
const CN_GROUP  = ['CN']
const CHT_GROUP = ['TW', 'HK', 'MO']  // 繁中市场
const SEA_GROUP = ['SG', 'MY']         // 东南亚
const JP_GROUP  = ['JP']
const KR_GROUP  = ['KR']
const UK_GROUP  = ['GB']
const WEST_GROUP = ['US', 'CA', 'AU', 'NZ']

function getPlatforms(category: string, country = 'other') {
  // 食物类：专属菜谱 / 食材搜索平台
  if (category === 'food') {
    if (CN_GROUP.includes(country) || CHT_GROUP.includes(country)) {
      return [
        { id: 'xiachufang', label: '下厨房', color: '#e05c34', badge: '厨' },
        { id: 'taobao',     label: '淘宝',   color: '#ff5000', badge: '淘' },
      ]
    }
    if (JP_GROUP.includes(country)) {
      return [{ id: 'rakuten', label: '楽天', color: '#bf0000', badge: '楽' }]
    }
    return [{ id: 'amazon', label: 'Amazon', color: '#ff9900', badge: 'A' }]
  }

  const isClothing = category === 'clothing'
  if (CN_GROUP.includes(country)) {
    return isClothing
      ? [P.taobao, P.xiaohongshu, P.pinterest]
      : [P.taobao, P.xiaohongshu, P.etsy, P.pinterest]
  }
  if (CHT_GROUP.includes(country)) {
    return isClothing
      ? [P.shopee, P.shein, P.pinterest]
      : [P.shopee, P.etsy, P.pinterest]
  }
  if (SEA_GROUP.includes(country)) {
    return isClothing
      ? [P.shopee, P.lazada, P.pinterest]
      : [P.shopee, P.lazada, P.etsy, P.pinterest]
  }
  if (JP_GROUP.includes(country)) {
    return isClothing
      ? [P.rakuten, P.amazon, P.pinterest]
      : [P.rakuten, P.etsy, P.amazon, P.pinterest]
  }
  if (KR_GROUP.includes(country)) {
    return isClothing
      ? [P.coupang, P.shein, P.pinterest]
      : [P.coupang, P.etsy, P.pinterest]
  }
  if (UK_GROUP.includes(country)) {
    return isClothing
      ? [P.asos, P.amazon, P.pinterest]
      : [P.etsy, P.amazon, P.pinterest]
  }
  if (WEST_GROUP.includes(country)) {
    return isClothing
      ? [P.amazon, P.etsy, P.shein, P.pinterest]
      : [P.etsy, P.amazon, P.pinterest]
  }
  // 默认
  return isClothing
    ? [P.shein, P.etsy, P.amazon, P.pinterest]
    : [P.etsy, P.amazon, P.pinterest]
}

function platformLink(id: string, query: string, queryZH: string, country = 'other'): string {
  const q  = encodeURIComponent(query)
  const qz = encodeURIComponent(queryZH)
  switch (id) {
    case 'xiachufang': return `https://www.xiachufang.com/search/?keyword=${qz}`
    case 'taobao':     return `https://s.taobao.com/search?q=${qz}`
    case 'xiaohongshu':return `https://www.xiaohongshu.com/search_result/?keyword=${qz}&type=54`
    case 'shopee': {
      const shopeeMap: Record<string, string> = { TW: 'shopee.tw', HK: 'shopee.hk', SG: 'shopee.sg', MY: 'shopee.com.my' }
      const domain = shopeeMap[country] ?? 'shopee.sg'
      return `https://${domain}/search?keyword=${q}`
    }
    case 'lazada': {
      const lazadaMap: Record<string, string> = { SG: 'lazada.sg', MY: 'www.lazada.com.my' }
      const domain = lazadaMap[country] ?? 'lazada.sg'
      return `https://${domain}/catalog/?q=${q}`
    }
    case 'amazon': {
      const amazonMap: Record<string, string> = { GB: 'amazon.co.uk', AU: 'amazon.com.au', JP: 'amazon.co.jp', CA: 'amazon.ca' }
      const domain = amazonMap[country] ?? 'amazon.com'
      return `https://www.${domain}/s?k=${q}`
    }
    case 'etsy':    return `https://www.etsy.com/search?q=${q}`
    case 'shein':   return `https://www.shein.com/search?keyword=${q}`
    case 'asos':    return `https://www.asos.com/search/?q=${q}`
    case 'rakuten': return `https://search.rakuten.co.jp/search/mall/${qz}/`
    case 'coupang': return `https://www.coupang.com/np/search?q=${q}`
    default:        return `https://www.pinterest.com/search/pins/?q=${q}`
  }
}

// ── 类别样式配置 ──────────────────────────────────────────────────────
const CATEGORY_COLOR: Record<string, string> = {
  crystal: '#a78bfa', jewelry: '#d4af37', color: '#f97316',
  number: '#3b82f6', plant: '#22c55e', symbol: '#ec4899',
  clothing: '#f43f5e', food: '#fb923c', other: '#9ca3af',
}
const CATEGORY_EMOJI: Record<string, string> = {
  crystal: '💎', jewelry: '💍', color: '🎨',
  number: '🔢', plant: '🌿', symbol: '✨', clothing: '👗', food: '🍽️', other: '🌟',
}
const CATEGORY_BG: Record<string, [string, string]> = {
  crystal:  ['#3b0764', '#6d28d9'],
  jewelry:  ['#3d2a00', '#92650a'],
  color:    ['#431407', '#c2410c'],
  number:   ['#172554', '#1d4ed8'],
  plant:    ['#052e16', '#15803d'],
  symbol:   ['#500724', '#be185d'],
  clothing: ['#4c0519', '#be123c'],
  food:     ['#431407', '#b45309'],
  other:    ['#111827', '#374151'],
}

// ── 运势提升配置 ──────────────────────────────────────────────────────
const BOOST_CONFIG: Record<string, { color: string; zh: string; en: string; icon: string }> = {
  career: { color: '#d4af37', zh: '事业运', en: 'Career',  icon: '💼' },
  wealth: { color: '#22c55e', zh: '财运',   en: 'Wealth',  icon: '💰' },
  love:   { color: '#f43f5e', zh: '感情运', en: 'Love',    icon: '❤️' },
  health: { color: '#3b82f6', zh: '健康运', en: 'Health',  icon: '🌿' },
  luck:   { color: '#a78bfa', zh: '整体运', en: 'Luck',    icon: '✨' },
}

// ── 图片状态 ──────────────────────────────────────────────────────────
interface ImgState { urls: string[]; loading: boolean }

// ── 组件 ─────────────────────────────────────────────────────────────
export default function LuckyItemsSection({ items, country }: Props) {
  const { tr, lang } = useLang()
  const safeItems = items ?? []

  // Pinterest 图片（每个物件独立状态）
  const [imgMap, setImgMap] = useState<ImgState[]>(
    safeItems.map(() => ({ urls: [], loading: true }))
  )
  const fetched = useRef(false)

  useEffect(() => {
    if (safeItems.length === 0 || fetched.current) return
    fetched.current = true

    safeItems.forEach((item, idx) => {
      const q = encodeURIComponent(item.searchQuery ?? item.nameEN ?? item.name ?? '')
      const cat = item.category ?? 'other'
      fetch(`/api/images?q=${q}&category=${cat}&platform=pinterest`)
        .then(r => r.json())
        .then(({ images }: { images: string[] }) => {
          setImgMap(prev => prev.map((s, i) =>
            i === idx ? { urls: images.slice(0, 4), loading: false } : s
          ))
        })
        .catch(() => {
          setImgMap(prev => prev.map((s, i) =>
            i === idx ? { urls: [], loading: false } : s
          ))
        })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (safeItems.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>{tr.lucky.title}</h2>
        <div className="mystic-card p-8 text-center">
          <div className="text-4xl mb-3">✨</div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{tr.lucky.empty}</p>
        </div>
      </section>
    )
  }

  const pinterestPlatform = P.pinterest

  // 复制搜索词到剪贴板
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const handleCopy = useCallback((text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    })
  }, [])

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>{tr.lucky.title}</h2>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {lang === 'en' ? 'Click a platform button to search for this item' : '点击平台按钮，直达搜索结果'}
      </p>

      <div className="grid grid-cols-1 gap-3">
        {safeItems.map((item, idx) => {
          const itemColor  = CATEGORY_COLOR[item.category] ?? '#9ca3af'
          const emoji      = CATEGORY_EMOJI[item.category] ?? '✨'
          const [bgFrom, bgTo] = CATEGORY_BG[item.category] ?? CATEGORY_BG.other
          const boost      = item.boosts ? BOOST_CONFIG[item.boosts] : null
          const boostLabel = boost ? (tr.lucky.boosts?.[item.boosts!] ?? (lang === 'en' ? boost.en : boost.zh)) : null
          const queryEN    = item.searchQuery ?? item.nameEN ?? item.name ?? ''
          const queryZH    = item.name ?? item.nameEN ?? ''
          const query      = queryEN  // 用于图片搜索和非中文平台
          const imgs       = imgMap[idx]
          const platforms  = getPlatforms(item.category, country)

          return (
            <div key={idx} className="mystic-card overflow-hidden">

              {/* 彩色头部 */}
              <div
                className="px-4 pt-4 pb-3 flex items-start gap-3"
                style={{ background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgTo} 100%)` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)' }}
                >
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base leading-tight text-white mb-1">{item.name}</div>
                  {item.nameEN && item.nameEN !== item.name && (
                    <div className="text-xs text-white/60 mb-1.5">{item.nameEN}</div>
                  )}
                  <span className="tag text-xs" style={{
                    background: `${itemColor}30`, color: '#fff',
                    border: `1px solid ${itemColor}50`, fontSize: 10,
                  }}>
                    {tr.lucky.categories[item.category] ?? item.category}
                  </span>
                </div>
              </div>

              {/* 运势提升条 */}
              {boost && boostLabel && (
                <div
                  className="mx-4 mt-3 rounded-xl px-3 py-2 flex items-center gap-2"
                  style={{
                    background: `linear-gradient(90deg, ${boost.color}22 0%, ${boost.color}10 100%)`,
                    border: `1px solid ${boost.color}60`,
                    boxShadow: `0 0 12px ${boost.color}25`,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{boost.icon}</span>
                  <div className="flex flex-col leading-tight">
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
                      {lang === 'en' ? 'Boosts' : '提升运势'}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: boost.color }}>
                      {boostLabel}
                    </span>
                  </div>
                  <div className="flex-1 ml-1">
                    <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '75%', borderRadius: 2, background: `linear-gradient(90deg, ${boost.color}, ${boost.color}88)` }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: boost.color }}>↑</span>
                </div>
              )}

              {/* Pinterest 图片条 */}
              <div className="flex gap-2 px-3 pt-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {imgs?.loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-24 h-24 rounded-xl flex-shrink-0 animate-pulse"
                      style={{ background: 'rgba(255,255,255,0.05)' }} />
                  ))
                ) : imgs?.urls.length > 0 ? (
                  imgs.urls.map((url, i) => (
                    <a
                      key={i}
                      href={platformLink('pinterest', queryEN, queryZH, country)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden block hover:opacity-85 transition-opacity"
                      style={{ border: `1px solid ${itemColor}30` }}
                    >
                      <img
                        src={url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
                      />
                      {/* Pinterest 小角标 */}
                      <span
                        className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center font-bold text-white"
                        style={{ background: pinterestPlatform.color, fontSize: 9 }}
                      >P</span>
                    </a>
                  ))
                ) : null}
              </div>

              {/* 原因文字 */}
              <div className="px-4 py-3">
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.reason}
                </p>
              </div>

              {/* 搜索词 + 复制 */}
              <div className="px-4 pb-2 flex items-center gap-2">
                <span className="text-xs font-mono truncate flex-1 px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', maxWidth: '70%' }}>
                  {query}
                </span>
                <button
                  onClick={() => handleCopy(query, idx)}
                  className="text-xs px-2 py-1 rounded-lg transition-all flex-shrink-0"
                  style={{
                    background: copiedIdx === idx ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                    color: copiedIdx === idx ? '#22c55e' : 'var(--text-muted)',
                    border: `1px solid ${copiedIdx === idx ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {copiedIdx === idx ? (lang === 'en' ? '✓ Copied' : '✓ 已复制') : (lang === 'en' ? 'Copy' : '复制')}
                </button>
              </div>

              {/* 平台按钮区（统一格式） */}
              <div className="px-4 pb-4 flex gap-2 flex-wrap">
                {platforms.map(p => (
                  <a
                    key={p.id}
                    href={platformLink(p.id, queryEN, queryZH, country)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
                    style={{
                      background: `${p.color}15`,
                      color: p.color,
                      border: `1px solid ${p.color}40`,
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ background: p.color, fontSize: 9 }}
                    >
                      {p.badge}
                    </span>
                    {p.label}
                  </a>
                ))}
              </div>

            </div>
          )
        })}
      </div>
    </section>
  )
}
