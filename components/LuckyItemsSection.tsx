'use client'

import { useEffect, useRef, useState } from 'react'
import type { LuckyItem } from '@/types'
import { useLang } from '@/contexts/LangContext'

interface Props { items?: LuckyItem[] }

// ── 平台配置（统一格式：单色，无特殊 badge 样式）────────────────────────
const PLATFORMS = [
  { id: 'pinterest', label: 'Pinterest', color: '#e60023', badge: 'P' },
  { id: 'shein',     label: 'SHEIN',     color: '#9ca3af', badge: 'S' },
  { id: 'etsy',      label: 'Etsy',      color: '#f1641e', badge: 'E' },
  { id: 'amazon',    label: 'Amazon',    color: '#ff9900', badge: 'A' },
]

// 服装类：SHEIN 置首；其余：Etsy 置首（最适合幸运物）
function platformsForItem(category: string) {
  if (category === 'clothing') {
    return [PLATFORMS[1], PLATFORMS[0], PLATFORMS[3]] // SHEIN, Pinterest, Amazon
  }
  return [PLATFORMS[0], PLATFORMS[2], PLATFORMS[3], PLATFORMS[1]] // Pinterest, Etsy, Amazon, SHEIN
}

function platformLink(platform: string, query: string): string {
  const q = encodeURIComponent(query)
  switch (platform) {
    case 'shein':  return `https://www.shein.com/search?keyword=${q}`
    case 'etsy':   return `https://www.etsy.com/search?q=${q}`
    case 'amazon': return `https://www.amazon.com/s?k=${q}`
    default:       return `https://www.pinterest.com/search/pins/?q=${q}`
  }
}

// ── 类别样式配置 ──────────────────────────────────────────────────────
const CATEGORY_COLOR: Record<string, string> = {
  crystal: '#a78bfa', jewelry: '#d4af37', color: '#f97316',
  number: '#3b82f6', plant: '#22c55e', symbol: '#ec4899', clothing: '#f43f5e', other: '#9ca3af',
}
const CATEGORY_EMOJI: Record<string, string> = {
  crystal: '💎', jewelry: '💍', color: '🎨',
  number: '🔢', plant: '🌿', symbol: '✨', clothing: '👗', other: '🌟',
}
const CATEGORY_BG: Record<string, [string, string]> = {
  crystal:  ['#3b0764', '#6d28d9'],
  jewelry:  ['#3d2a00', '#92650a'],
  color:    ['#431407', '#c2410c'],
  number:   ['#172554', '#1d4ed8'],
  plant:    ['#052e16', '#15803d'],
  symbol:   ['#500724', '#be185d'],
  clothing: ['#4c0519', '#be123c'],
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
export default function LuckyItemsSection({ items }: Props) {
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

  const pinterestPlatform = PLATFORMS[0]

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
          const query      = item.searchQuery ?? (lang === 'en' ? item.nameEN : item.name) ?? item.name
          const imgs       = imgMap[idx]

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
                  <div className="flex flex-wrap gap-1.5">
                    <span className="tag text-xs" style={{
                      background: `${itemColor}30`, color: '#fff',
                      border: `1px solid ${itemColor}50`, fontSize: 10,
                    }}>
                      {tr.lucky.categories[item.category] ?? item.category}
                    </span>
                    {boost && boostLabel && (
                      <span className="tag text-xs flex items-center gap-0.5" style={{
                        background: `${boost.color}30`, color: '#fff',
                        border: `1px solid ${boost.color}50`, fontWeight: 600, fontSize: 10,
                      }}>
                        {boost.icon} ↑{boostLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

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
                      href={platformLink('pinterest', query)}
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

              {/* 平台按钮区（统一格式） */}
              <div className="px-4 pb-4 flex gap-2 flex-wrap">
                {platformsForItem(item.category).map(p => (
                  <a
                    key={p.id}
                    href={platformLink(p.id, query)}
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
