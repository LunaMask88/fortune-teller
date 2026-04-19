'use client'

import { useState } from 'react'
import { useLang } from '@/contexts/LangContext'
import { loadProfile } from '@/lib/user-profile'
import type { MatchPersonInput, MatchResult } from '@/types'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
function hourLabel(h: number) {
  const names = ['子','子','丑','丑','寅','寅','卯','卯','辰','辰','巳','巳',
                 '午','午','未','未','申','申','酉','酉','戌','戌','亥','亥']
  return `${String(h).padStart(2,'0')}:00（${names[h]}时）`
}

const EMPTY_PERSON: MatchPersonInput = {
  name: '', birthYear: 1990, birthMonth: 1, birthDay: 1, birthHour: 12, gender: 'female',
}

const DIM_COLORS: Record<string, string> = {
  communication: '#a78bfa', values: '#d4af37', emotion: '#f43f5e', growth: '#22c55e',
}
const DIM_ICONS: Record<string, string> = {
  communication: '💬', values: '🤝', emotion: '❤️', growth: '🌱',
}

export default function MatchForm() {
  const { tr, lang } = useLang()
  const isZH = lang === 'zh'

  const [person1, setPerson1] = useState<MatchPersonInput>(() => {
    const p = loadProfile()
    if (p) return { name: p.name, birthYear: p.birthYear, birthMonth: p.birthMonth, birthDay: p.birthDay, birthHour: p.birthHour, gender: p.gender === 'undisclosed' ? 'female' : p.gender }
    return EMPTY_PERSON
  })
  const [person2, setPerson2] = useState<MatchPersonInput>({ ...EMPTY_PERSON, gender: 'male' })
  const [time1Unknown, setTime1Unknown] = useState(false)
  const [time2Unknown, setTime2Unknown] = useState(false)

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<{ step: string; pct: number } | null>(null)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ person1: MatchPersonInput; person2: MatchPersonInput; result: MatchResult } | null>(null)

  function set1<K extends keyof MatchPersonInput>(k: K, v: MatchPersonInput[K]) {
    setPerson1(p => ({ ...p, [k]: v }))
  }
  function set2<K extends keyof MatchPersonInput>(k: K, v: MatchPersonInput[K]) {
    setPerson2(p => ({ ...p, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!person1.name.trim() || !person2.name.trim()) {
      setError(isZH ? '请填写双方姓名' : 'Please enter both names')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)
    setProgress({ step: isZH ? '启动中…' : 'Starting…', pct: 5 })

    try {
      const resp = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person1, person2, lang }),
      })
      if (!resp.ok) throw new Error(isZH ? '请求失败' : 'Request failed')

      const reader = resp.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const event = JSON.parse(line.slice(6))
          if (event.type === 'progress') setProgress({ step: event.step, pct: event.pct })
          else if (event.type === 'result') { setResult(event.data); setLoading(false); setProgress(null) }
          else if (event.type === 'error') throw new Error(event.message)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (isZH ? '分析失败，请重试' : 'Analysis failed'))
      setLoading(false)
      setProgress(null)
    }
  }

  function PersonForm({
    label, data, setField, timeUnknown, setTimeUnknown,
  }: {
    label: string
    data: MatchPersonInput
    setField: <K extends keyof MatchPersonInput>(k: K, v: MatchPersonInput[K]) => void
    timeUnknown: boolean
    setTimeUnknown: (v: boolean) => void
  }) {
    return (
      <div className="mystic-card p-4 space-y-3">
        <div className="text-sm font-semibold mb-2" style={{ color: 'var(--gold)' }}>{label}</div>

        {/* 姓名 */}
        <input
          className="mystic-input w-full"
          placeholder={isZH ? '姓名' : 'Name'}
          value={data.name}
          onChange={e => setField('name', e.target.value)}
        />

        {/* 性别 */}
        <div className="flex gap-2">
          {(['female', 'male'] as const).map(g => (
            <button
              key={g}
              type="button"
              onClick={() => setField('gender', g)}
              className="flex-1 py-2 rounded-xl text-sm transition-all"
              style={{
                background: data.gender === g ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${data.gender === g ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: data.gender === g ? 'var(--gold)' : 'var(--text-muted)',
              }}
            >
              {g === 'female' ? (isZH ? '♀ 女' : '♀ Female') : (isZH ? '♂ 男' : '♂ Male')}
            </button>
          ))}
        </div>

        {/* 出生日期 */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'birthYear' as const,  min: 1920, max: 2010, placeholder: isZH ? '年' : 'Year' },
            { key: 'birthMonth' as const, min: 1,    max: 12,   placeholder: isZH ? '月' : 'Mon' },
            { key: 'birthDay' as const,   min: 1,    max: 31,   placeholder: isZH ? '日' : 'Day' },
          ].map(({ key, min, max, placeholder }) => (
            <input
              key={key}
              type="number"
              className="mystic-input text-center"
              placeholder={placeholder}
              min={min} max={max}
              value={data[key]}
              onChange={e => setField(key, parseInt(e.target.value) || min)}
            />
          ))}
        </div>

        {/* 出生时辰 */}
        <div>
          <label className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={timeUnknown}
              onChange={e => { setTimeUnknown(e.target.checked); setField('birthHour', e.target.checked ? null : 12) }}
            />
            {isZH ? '出生时间不知道' : 'Birth time unknown'}
          </label>
          {!timeUnknown && (
            <select
              className="mystic-input w-full text-sm"
              value={data.birthHour ?? 12}
              onChange={e => setField('birthHour', parseInt(e.target.value))}
            >
              {HOURS.map(h => <option key={h} value={h}>{hourLabel(h)}</option>)}
            </select>
          )}
        </div>
      </div>
    )
  }

  const scoreColor = (s: number) =>
    s >= 80 ? '#d4af37' : s >= 65 ? '#22c55e' : s >= 50 ? '#a78bfa' : '#f97316'

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold text-center mb-6" style={{ color: 'var(--gold)' }}>
            {isZH ? '💕 合盘配对分析' : '💕 Compatibility Reading'}
          </h1>
          <p className="text-xs text-center mb-4" style={{ color: 'var(--text-muted)' }}>
            {isZH ? '融合八字五行与西洋星座，分析两人命理契合度' : 'BaZi + Astrology compatibility analysis'}
          </p>

          <PersonForm
            label={isZH ? '甲方' : 'Person 1'}
            data={person1} setField={set1}
            timeUnknown={time1Unknown} setTimeUnknown={setTime1Unknown}
          />

          <div className="text-center text-2xl">💕</div>

          <PersonForm
            label={isZH ? '乙方' : 'Person 2'}
            data={person2} setField={set2}
            timeUnknown={time2Unknown} setTimeUnknown={setTime2Unknown}
          />

          {error && (
            <p className="text-sm text-center py-2 px-4 rounded-lg" style={{ background: 'rgba(201,123,132,0.1)', color: 'var(--rose)', border: '1px solid rgba(201,123,132,0.2)' }}>
              {error}
            </p>
          )}

          {loading && progress && (
            <div className="mystic-card p-4 space-y-2">
              <div className="flex justify-between text-xs" style={{ color: 'var(--gold)' }}>
                <span className="flex items-center gap-1"><span className="animate-spin">✦</span>{progress.step}</span>
                <span>{progress.pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress.pct}%`, background: 'linear-gradient(90deg,#f43f5e,#a78bfa)' }} />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-base transition-all"
            style={{
              background: loading ? 'rgba(244,63,94,0.1)' : 'linear-gradient(135deg,#f43f5e,#a78bfa)',
              color: loading ? 'var(--text-muted)' : '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(244,63,94,0.3)',
            }}
          >
            {loading ? (isZH ? '分析中…' : 'Analyzing…') : (isZH ? '💕 开始合盘分析' : '💕 Start Analysis')}
          </button>
        </form>
      ) : (
        /* 结果页 */
        <div className="space-y-5">
          <div className="text-center">
            <h1 className="text-xl font-bold" style={{ color: 'var(--gold)' }}>
              {result.person1.name} × {result.person2.name}
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {isZH ? '合盘契合分析报告' : 'Compatibility Report'}
            </p>
          </div>

          {/* 总分 */}
          <div className="mystic-card p-6 text-center" style={{ border: `1px solid ${scoreColor(result.result.score)}40` }}>
            <div className="text-6xl font-bold mb-1" style={{ color: scoreColor(result.result.score) }}>
              {result.result.score}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {isZH ? '综合契合分' : 'Compatibility Score'}
            </div>
            <div className="mt-3 w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${result.result.score}%`, background: `linear-gradient(90deg,#f43f5e,#a78bfa)` }} />
            </div>
          </div>

          {/* 四维 */}
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(result.result.dimensions) as [string, { score: number; label: string; summary: string }][]).map(([k, d]) => (
              <div key={k} className="mystic-card p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span>{DIM_ICONS[k] ?? '✨'}</span>
                  <span className="text-xs font-semibold" style={{ color: DIM_COLORS[k] ?? '#a78bfa' }}>{d.label}</span>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: DIM_COLORS[k] ?? '#a78bfa' }}>{d.score}</div>
                <div className="w-full h-1 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: DIM_COLORS[k] ?? '#a78bfa' }} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{d.summary}</p>
              </div>
            ))}
          </div>

          {/* 综合分析 */}
          <div className="space-y-3">
            {result.result.summary.map((para, i) => (
              <div key={i} className="mystic-card p-4">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{para}</p>
              </div>
            ))}
          </div>

          {/* 核心建议 */}
          <div className="mystic-card p-4" style={{ border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.05)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--gold)' }}>
              {isZH ? '💡 相处建议' : '💡 Key Advice'}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{result.result.advice}</p>
          </div>

          {/* 幸运活动 */}
          {result.result.luckyActivities?.length > 0 && (
            <div className="mystic-card p-4">
              <div className="text-xs font-semibold mb-3" style={{ color: 'var(--gold)' }}>
                {isZH ? '🎯 适合两人的活动' : '🎯 Lucky Activities'}
              </div>
              <div className="flex flex-wrap gap-2">
                {result.result.luckyActivities.map((act, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs"
                    style={{ background: 'rgba(167,139,250,0.12)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.25)' }}>
                    {act}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => { setResult(null); setProgress(null) }}
            className="w-full py-3 rounded-xl text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {isZH ? '← 重新分析' : '← New Analysis'}
          </button>
        </div>
      )}
    </div>
  )
}
