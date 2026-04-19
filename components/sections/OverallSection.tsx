'use client'

import { useEffect, useState } from 'react'
import type { FortuneReading, FortuneAnswer } from '@/types'
import { useLang } from '@/contexts/LangContext'
import RadarChart from '@/components/RadarChart'

interface Props { fortune: FortuneReading }

const TREND_ICON  = { up: '↑', stable: '→', down: '↓' }
const TREND_COLOR = { up: '#4ade80', stable: 'var(--gold)', down: 'var(--rose)' }

const CAT_COLORS: Record<string, string> = {
  career: '#d4af37', wealth: '#22c55e', love: '#f43f5e',
  health: '#3b82f6', luck: '#a78bfa',
}

export default function OverallSection({ fortune }: Props) {
  const { tr, lang } = useLang()
  const cats = Object.entries(fortune.categories) as [string, { score: number; label: string; trend: 'up'|'stable'|'down'; summary: string }][]

  // 分数滚动动效：从 0 计数到实际值
  const [displayScore, setDisplayScore] = useState(0)
  useEffect(() => {
    const target = fortune.overallScore
    let current = 0
    const step = Math.max(1, Math.floor(target / 40))
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setDisplayScore(current)
      if (current >= target) clearInterval(timer)
    }, 40)
    return () => clearInterval(timer)
  }, [fortune.overallScore])

  const scoreColor = displayScore >= 80 ? '#d4af37' : displayScore >= 60 ? '#a78bfa' : displayScore >= 40 ? '#f97316' : '#f87171'

  // 雷达图轴配置
  const radarAxes = cats.map(([key, cat]) => ({
    key,
    label: cat.label,
    score: cat.score,
    color: CAT_COLORS[key] ?? '#a78bfa',
  }))

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>{tr.sections.overall}</h2>

      {/* 总分 + 第一条摘要 */}
      <div className="mystic-card p-6 flex items-center gap-6">
        {/* 分数圆环 */}
        <div className="relative flex-shrink-0" style={{ width: 90, height: 90 }}>
          <svg width={90} height={90} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={45} cy={45} r={36} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
            <circle
              cx={45} cy={45} r={36} fill="none"
              stroke={scoreColor} strokeWidth={8} strokeLinecap="round"
              strokeDasharray={`${(displayScore / 100) * 2 * Math.PI * 36} ${2 * Math.PI * 36}`}
              style={{ filter: `drop-shadow(0 0 5px ${scoreColor}80)`, transition: 'stroke-dasharray 0.1s linear, stroke 0.3s' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: scoreColor, transition: 'color 0.3s' }}>{displayScore}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{tr.ui.overall.scoreLabel}</span>
          </div>
        </div>
        {fortune.summary[0] && (
          <div className="flex-1">
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--gold)' }}>{fortune.summary[0].title}</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{fortune.summary[0].body}</p>
          </div>
        )}
      </div>

      {/* 雷达图 */}
      <div className="mystic-card p-4 flex justify-center">
        <RadarChart axes={radarAxes} size={220} />
      </div>

      {/* 其余 summary 卡片 */}
      {fortune.summary.slice(1).map((item, idx) => {
        const icons = ['☯️', '🎯', '💡', '✨']
        return (
          <div key={idx} className="gold-card px-4 py-3">
            <p className="text-xs font-semibold mb-1.5 flex items-center gap-1.5">
              <span>{icons[idx] ?? '✨'}</span>
              <span style={{ color: 'var(--gold)' }}>{item.title}</span>
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{item.body}</p>
          </div>
        )
      })}

      {/* 五维进度条 */}
      <div className="grid grid-cols-1 gap-3">
        {cats.map(([key, cat]) => (
          <div key={cat.label} className="gold-card px-4 py-3 flex items-center gap-4">
            <div className="text-sm font-medium w-16 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
              {cat.label}
            </div>
            <div className="flex-1 fortune-bar">
              <div
                className="fortune-bar-fill"
                style={{
                  width: `${cat.score}%`,
                  background: `linear-gradient(90deg, ${CAT_COLORS[key] ?? 'var(--purple)'} 0%, var(--gold) 100%)`,
                }}
              />
            </div>
            <div className="text-sm font-bold w-8 text-right" style={{ color: CAT_COLORS[key] ?? 'var(--gold)' }}>
              {cat.score}
            </div>
            <span
              className="tag text-xs flex-shrink-0"
              style={{
                background: `${TREND_COLOR[cat.trend]}18`,
                color: TREND_COLOR[cat.trend],
                border: `1px solid ${TREND_COLOR[cat.trend]}40`,
              }}
            >
              {TREND_ICON[cat.trend]} {cat.trend === 'up' ? tr.ui.overall.trend.up : cat.trend === 'stable' ? tr.ui.overall.trend.stable : tr.ui.overall.trend.down}
            </span>
          </div>
        ))}
      </div>

      {/* 各项详情 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cats.map(([key, cat]) => (
          <div key={cat.label} className="mystic-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm" style={{ color: CAT_COLORS[key] ?? 'var(--gold)' }}>{cat.label}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{cat.score}{tr.ui.overall.scoreUnit}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{cat.summary}</p>
          </div>
        ))}
      </div>

      {/* 针对性问题解答 */}
      {fortune.answers && fortune.answers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--purple-light)' }}>
            <span>🔍</span> {tr.sections.questionsAnswered}
          </h3>
          {fortune.answers.map((item: FortuneAnswer, idx: number) => (
            <div key={idx} className="mystic-card p-4" style={{ borderLeft: '3px solid rgba(124,58,237,0.5)' }}>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>
                Q{idx + 1}. {item.question}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
