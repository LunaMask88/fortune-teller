'use client'

import type { FortuneReading, FortuneAnswer } from '@/types'
import { useLang } from '@/contexts/LangContext'

interface Props { fortune: FortuneReading }

const TREND_ICON = { up: '↑', stable: '→', down: '↓' }
const TREND_COLOR = { up: '#4ade80', stable: 'var(--gold)', down: 'var(--rose)' }

function ScoreRing({ score }: { score: number }) {
  const r = 48
  const circumference = 2 * Math.PI * r
  const dash = (score / 100) * circumference

  const color = score >= 80 ? '#d4af37' : score >= 60 ? '#a78bfa' : score >= 40 ? '#f97316' : '#f87171'

  return (
    <svg width={120} height={120} className="score-ring" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={60} cy={60} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
      <circle
        cx={60} cy={60} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  )
}

export default function OverallSection({ fortune }: Props) {
  const { tr } = useLang()
  const cats = Object.values(fortune.categories)

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>{tr.sections.overall}</h2>

      {/* 总分 */}
      <div className="mystic-card p-6 flex items-center gap-6">
        <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
          <ScoreRing score={fortune.overallScore} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: 'var(--gold)' }}>{fortune.overallScore}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>综合分</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
            {fortune.summary}
          </p>
        </div>
      </div>

      {/* 五维分项 */}
      <div className="grid grid-cols-1 gap-3">
        {cats.map(cat => (
          <div key={cat.label} className="gold-card px-4 py-3 flex items-center gap-4">
            <div className="text-sm font-medium w-16 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
              {cat.label}
            </div>
            <div className="flex-1 fortune-bar">
              <div
                className="fortune-bar-fill"
                style={{
                  width: `${cat.score}%`,
                  background: `linear-gradient(90deg, var(--purple) 0%, var(--gold) 100%)`,
                }}
              />
            </div>
            <div className="text-sm font-bold w-8 text-right" style={{ color: 'var(--gold)' }}>
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
              {TREND_ICON[cat.trend]} {cat.trend === 'up' ? '上升' : cat.trend === 'stable' ? '平稳' : '下降'}
            </span>
          </div>
        ))}
      </div>

      {/* 各项详情 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cats.map(cat => (
          <div key={cat.label} className="mystic-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm" style={{ color: 'var(--gold)' }}>{cat.label}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{cat.score} 分</span>
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
