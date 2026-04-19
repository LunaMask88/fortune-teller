'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadProfile, loadLastReading, setQuickPeriod, type UserProfile } from '@/lib/user-profile'
import type { FullReading } from '@/types'
import { useLang } from '@/contexts/LangContext'

export default function QuickEntry() {
  const router = useRouter()
  const { lang } = useLang()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [lastReading, setLastReading] = useState<FullReading | null>(null)

  useEffect(() => {
    const p = loadProfile()
    const r = loadLastReading()
    setProfile(p)
    setLastReading(r)
  }, [])

  if (!profile) return null

  const PERIODS = [
    { value: 'today', icon: '☀️', zh: '今日', en: 'Today' },
    { value: 'month', icon: '🌙', zh: '本月', en: 'Month' },
    { value: 'year',  icon: '🌟', zh: '今年', en: 'Year'  },
    { value: 'life',  icon: '✨', zh: '人生', en: 'Life'  },
  ]

  const score = lastReading?.fortune?.overallScore
  const readingDate = lastReading?.fortune?.generatedAt
    ? new Date(lastReading.fortune.generatedAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })
    : null

  function handleQuick(period: string) {
    setQuickPeriod(period)
    router.push('/reading')
  }

  return (
    <div
      className="mystic-card p-4 w-full"
      style={{ border: '1px solid rgba(212,175,55,0.25)' }}
    >
      {/* 顶部：欢迎 + 上次解读 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔮</span>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>
              {lang === 'zh' ? `欢迎回来，${profile.name}` : `Welcome back, ${profile.name}`}
            </div>
            {score !== undefined && readingDate && (
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {lang === 'zh'
                  ? `上次解读：${score}分 · ${readingDate}`
                  : `Last reading: ${score}pts · ${readingDate}`}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => router.push('/reading')}
          className="text-xs px-2 py-1 rounded-lg"
          style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {lang === 'zh' ? '更新信息' : 'Update'}
        </button>
      </div>

      {/* 快捷周期按钮 */}
      <div className="grid grid-cols-4 gap-2">
        {PERIODS.map(p => (
          <button
            key={p.value}
            onClick={() => handleQuick(p.value)}
            className="py-2 rounded-xl text-xs font-medium flex flex-col items-center gap-0.5 transition-all hover:opacity-80 active:scale-95"
            style={{
              background: p.value === 'life'
                ? 'rgba(212,175,55,0.12)'
                : 'rgba(124,58,237,0.12)',
              border: `1px solid ${p.value === 'life' ? 'rgba(212,175,55,0.3)' : 'rgba(124,58,237,0.3)'}`,
              color: p.value === 'life' ? 'var(--gold)' : 'var(--purple-light)',
            }}
          >
            <span>{p.icon}</span>
            <span>{lang === 'zh' ? p.zh : p.en}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
