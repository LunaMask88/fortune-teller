'use client'

import { useEffect, useRef, useState } from 'react'
import type { LuckyItem } from '@/types'
import { useLang } from '@/contexts/LangContext'

interface Props { items?: LuckyItem[] }

// ── 平台配置 ──────────────────────────────────────────────────────────
type Platform = 'pinterest' | 'shein' | 'amazon'

const PLATFORMS: { id: Platform; label: string; color: string; badge: string; badgeBg?: string; badgeColor?: string }[] = [
  { id: 'pinterest', label: 'Pinterest', color: '#e60023', badge: 'P' },
  { id: 'shein',     label: 'SHEIN',     color: '#222222', badge: 'S', badgeBg: '#000000', badgeColor: '#ffffff' },
  { id: 'amazon',    label: 'Amazon',    color: '#ff9900', badge: 'A' },
]

// ── 物件类别配置 ──────────────────────────────────────────────────────
const CATEGORY_COLOR: Record<string, string> = {
  crystal: '#a78bfa', jewelry: '#d4af37', color: '#f97316',
  number: '#3b82f6', plant: '#22c55e', symbol: '#ec4899', other: '#9ca3af',
}
const CATEGORY_EMOJI: Record<string, string> = {
  crystal: '💎', jewelry: '💍', color: '🎨',
  number: '🔢', plant: '🌿', symbol: '✨', other: '🌟',
}

// ── 运势提升配置 ──────────────────────────────────────────────────────
const BOOST_CONFIG: Record<string, { color: string; zh: string; en: string; icon: string }> = {
  career: { color: '#d4af37', zh: '事业运', en: 'Career',  icon: '💼' },
  wealth: { color: '#22c55e', zh: '财运',   en: 'Wealth',  icon: '💰' },
  love:   { color: '#f43f5e', zh: '感情运', en: 'Love',    icon: '❤️' },
  health: { color: '#3b82f6', zh: '健康运', en: 'Health',  icon: '🌿' },
  luck:   { color: '#a78bfa', zh: '整体运', en: 'Luck',    icon: '✨' },
}

// ── 类型 ─────────────────────────────────────────────────────────────
interface FetchedResult { images: string[]; links: string[] }

interface ItemState extends LuckyItem {
  images: string[]
  links: string[]
  loadingImages: boolean
}

// ── 组件 ─────────────────────────────────────────────────────────────
export default function LuckyItemsSection({ items }: Props) {
  const { tr, lang } = useLang()
  const safeItems = items ?? []
  const [platform, setPlatform] = useState<Platform>('pinterest')
  const [enriched, setEnriched] = useState<ItemState[]>(
    safeItems.map(item => ({ ...item, images: [], links: [], loadingImages: true }))
  )

  // 缓存：平台 → 每个 item 的 {images, links}
  const cacheRef = useRef<Partial<Record<Platform, FetchedResult[]>>>({})

  useEffect(() => {
    if (safeItems.length === 0) return

    // 命中缓存 → 直接恢复，无网络请求
    const cached = cacheRef.current[platform]
    if (cached) {
      setEnriched(prev => prev.map((e, i) => ({
        ...e,
        images: cached[i]?.images ?? [],
        links:  cached[i]?.links ?? [],
        loadingImages: false,
      })))
      return
    }

    // 未命中 → loading + 并发拉取
    setEnriched(prev => prev.map(e => ({ ...e, loadingImages: true })))

    const results: FetchedResult[] = safeItems.map(() => ({ images: [], links: [] }))
    let finished = 0

    safeItems.forEach((item, idx) => {
      const q   = encodeURIComponent(item.searchQuery ?? item.name ?? '')
      const cat = item.category ?? 'other'
      fetch(`/api/images?q=${q}&category=${cat}&platform=${platform}`)
        .then(r => r.json())
        .then(({ images, links }: FetchedResult) => {
          results[idx] = { images, links: links ?? [] }
        })
        .catch(() => {
          results[idx] = { images: [], links: [] }
        })
        .finally(() => {
          finished++
          // 每完成一个就更新对应项，不必等全部完成
          setEnriched(prev => prev.map((e, i) =>
            i === idx
              ? { ...e, images: results[idx].images, links: results[idx].links, loadingImages: false }
              : e
          ))
          // 全部完成后写入缓存
          if (finished === safeItems.length) {
            cacheRef.current[platform] = [...results]
          }
        })
    })
  }, [platform]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const activePlatform = PLATFORMS.find(p => p.id === platform)!

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>{tr.lucky.title}</h2>

      {/* 平台筛选 pills */}
      <div className="flex gap-2 flex-wrap">
        {PLATFORMS.map(p => {
          const active = platform === p.id
          return (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: active ? `${p.color}20` : 'rgba(255,255,255,0.04)',
                color:      active ? p.color          : 'var(--text-muted)',
                border:     active ? `1px solid ${p.color}60` : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center font-bold"
                style={{
                  background: active ? (p.badgeBg ?? p.color) : 'rgba(255,255,255,0.2)',
                  color: p.badgeColor ?? '#ffffff',
                  fontSize: 9,
                }}
              >
                {p.badge}
              </span>
              {p.label}
            </button>
          )
        })}
      </div>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {tr.lucky.clickHint(activePlatform.label)}
      </p>

      {/* 物件卡片列表 */}
      <div className="grid grid-cols-1 gap-4">
        {enriched.map((item, idx) => {
          const itemColor = CATEGORY_COLOR[item.category] ?? '#9ca3af'
          const emoji     = CATEGORY_EMOJI[item.category] ?? '✨'
          const fallbackLink = buildFallbackLink(platform, item.searchQuery ?? item.name ?? '')

          return (
            <div key={idx} className="mystic-card overflow-hidden">
              {/* 图片横向滚动区 */}
              <div className="flex gap-2 p-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {item.loadingImages ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-20 h-20 rounded-xl flex-shrink-0 animate-pulse"
                      style={{ background: 'rgba(255,255,255,0.05)' }} />
                  ))
                ) : (
                  <>
                    {/* emoji 占位卡——始终可见，点击跳搜索 */}
                    <a
                      href={fallbackLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl hover:opacity-80 transition-opacity"
                      style={{ background: `${itemColor}15`, border: `1px solid ${itemColor}30` }}
                      title={`在 ${activePlatform.label} 搜索`}
                    >
                      {emoji}
                      <PlatformBadge platform={activePlatform} />
                    </a>

                    {/* 实际图片，各自对应商品链接 */}
                    {item.images.slice(0, 3).map((url, i) => {
                      const href = item.links[i] ?? fallbackLink
                      return (
                        <a
                          key={i}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden block hover:opacity-80 transition-opacity"
                          style={{ border: `1px solid ${itemColor}30` }}
                          title={`在 ${activePlatform.label} 查看`}
                        >
                          <img
                            src={url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={e => {
                              (e.target as HTMLImageElement).parentElement!.style.display = 'none'
                            }}
                          />
                          <PlatformBadge platform={activePlatform} />
                        </a>
                      )
                    })}
                  </>
                )}
              </div>

              {/* 文字信息区 */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                  <span className="tag text-xs" style={{
                    background: `${itemColor}15`, color: itemColor, border: `1px solid ${itemColor}30`,
                  }}>
                    {tr.lucky.categories[item.category] ?? item.category}
                  </span>
                  {/* 运势提升标签 */}
                  {item.boosts && BOOST_CONFIG[item.boosts] && (() => {
                    const boost = BOOST_CONFIG[item.boosts!]
                    const label = tr.lucky.boosts?.[item.boosts!] ?? (lang === 'en' ? boost.en : boost.zh)
                    return (
                      <span className="tag text-xs flex items-center gap-0.5" style={{
                        background: `${boost.color}18`,
                        color: boost.color,
                        border: `1px solid ${boost.color}40`,
                        fontWeight: 600,
                      }}>
                        {boost.icon} ↑{label}
                      </span>
                    )
                  })()}
                  {item.nameEN && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.nameEN}</span>
                  )}
                </div>
                <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>
                  {item.reason}
                </p>
                {/* 直搜按钮 */}
                <a
                  href={fallbackLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:opacity-80 transition-opacity"
                  style={{
                    background: `${activePlatform.color}15`,
                    color:      activePlatform.color,
                    border:     `1px solid ${activePlatform.color}30`,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{activePlatform.badge}</span>
                  {tr.lucky.searchOn(activePlatform.label)}
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── 小工具 ────────────────────────────────────────────────────────────
function PlatformBadge({ platform }: { platform: typeof PLATFORMS[number] }) {
  return (
    <span
      className="absolute top-1 right-1 rounded-full flex items-center justify-center font-bold"
      style={{
        width: 18, height: 18, fontSize: 10, lineHeight: 1,
        background: platform.badgeBg ?? platform.color,
        color: platform.badgeColor ?? '#ffffff',
      }}
    >
      {platform.badge}
    </span>
  )
}

function buildFallbackLink(platform: Platform, query: string): string {
  const q = encodeURIComponent(query)
  switch (platform) {
    case 'shein':  return `https://www.shein.com/search?keyword=${q}`
    case 'amazon': return `https://www.amazon.com/s?k=${q}`
    default:       return `https://www.pinterest.com/search/pins/?q=${q}`
  }
}
