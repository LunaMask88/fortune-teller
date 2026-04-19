'use client'

import { useRef, useState } from 'react'
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

// ── PersonForm 独立为顶层组件，避免父组件重渲染时卸载/重挂 ─────────────
interface PersonFormProps {
  label: string
  data: MatchPersonInput
  setField: <K extends keyof MatchPersonInput>(k: K, v: MatchPersonInput[K]) => void
  timeUnknown: boolean
  setTimeUnknown: (v: boolean) => void
  isZH: boolean
}

function PersonForm({ label, data, setField, timeUnknown, setTimeUnknown, isZH }: PersonFormProps) {
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

// ── 配对结果分享卡（纯 inline 样式，供 html2canvas）────────────────────
interface MatchShareCardProps {
  person1: MatchPersonInput
  person2: MatchPersonInput
  result: MatchResult
  lang: 'zh' | 'en'
  qrUrl: string
}

function MatchShareCard({ person1, person2, result, lang, qrUrl }: MatchShareCardProps) {
  const isZH = lang === 'zh'
  const scoreColor = result.score >= 80 ? '#d4af37' : result.score >= 65 ? '#22c55e' : result.score >= 50 ? '#a78bfa' : '#f97316'
  const dims = Object.entries(result.dimensions) as [string, { score: number; label: string }][]

  return (
    <div style={{
      width: 375, padding: '28px 24px 24px',
      background: 'linear-gradient(160deg, #0d0b1e 0%, #1a0a2e 40%, #0d0b1e 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#fff', borderRadius: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* 背景光晕 */}
      <div style={{ position:'absolute', top:-60, right:-60, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle,rgba(244,63,94,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-40, left:-40, width:140, height:140, borderRadius:'50%', background:'radial-gradient(circle,rgba(167,139,250,0.2) 0%,transparent 70%)', pointerEvents:'none' }} />

      {/* 标题 */}
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>MysticPalantir · {isZH ? '合盘配对' : 'Compatibility'}</div>
        <div style={{ fontSize:18, fontWeight:800, color:'#fff' }}>
          {person1.name} <span style={{ color:'#f43f5e' }}>♥</span> {person2.name}
        </div>
      </div>

      {/* 总分 */}
      <div style={{ textAlign:'center', marginBottom:20, padding:'16px 0', background:'rgba(255,255,255,0.04)', borderRadius:14, border:`1px solid ${scoreColor}30` }}>
        <div style={{ fontSize:56, fontWeight:800, color:scoreColor, lineHeight:1 }}>{result.score}</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:4 }}>{isZH ? '综合契合分' : 'Compatibility Score'}</div>
        <div style={{ margin:'10px 24px 0', height:6, borderRadius:3, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
          <div style={{ width:`${result.score}%`, height:'100%', borderRadius:3, background:'linear-gradient(90deg,#f43f5e,#a78bfa)' }} />
        </div>
      </div>

      {/* 四维 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
        {dims.map(([k, d]) => {
          const color = DIM_COLORS[k] ?? '#a78bfa'
          return (
            <div key={k} style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'10px 12px' }}>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{DIM_ICONS[k]} {d.label}</div>
              <div style={{ fontSize:22, fontWeight:700, color, marginBottom:4 }}>{d.score}</div>
              <div style={{ height:3, borderRadius:2, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                <div style={{ width:`${d.score}%`, height:'100%', background:color }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* 建议摘要 */}
      {result.summary[0] && (
        <div style={{ fontSize:11, lineHeight:1.7, color:'rgba(255,255,255,0.55)', marginBottom:16, padding:'10px 12px', background:'rgba(255,255,255,0.03)', borderRadius:10 }}>
          {result.summary[0].slice(0, 80)}…
        </div>
      )}

      {/* 底部 QR + 引导 */}
      <div style={{ display:'flex', alignItems:'center', gap:12, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        {qrUrl && (
          <div style={{ width:58, height:58, flexShrink:0, borderRadius:8, overflow:'hidden', border:'1px solid rgba(244,63,94,0.35)', background:'#060412', padding:3 }}>
            <img src={qrUrl} alt="QR" width={52} height={52} style={{ display:'block' }} />
          </div>
        )}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#f43f5e', marginBottom:3 }}>
            {isZH ? '扫码测你们的契合度' : 'Scan to check your compatibility'}
          </div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>mysticpalantir.com</div>
        </div>
        <div style={{ fontSize:28, flexShrink:0 }}>💕</div>
      </div>
    </div>
  )
}

// ── 主组件 ──────────────────────────────────────────────────────────────
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
  const [sharingImg, setSharingImg] = useState(false)
  const [qrUrl, setQrUrl] = useState('')
  const shareCardRef = useRef<HTMLDivElement>(null)

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
          else if (event.type === 'result') {
            setResult(event.data)
            setLoading(false)
            setProgress(null)
            // 预生成 QR 码
            import('qrcode').then(({ toDataURL }) =>
              toDataURL('https://mysticpalantir.com/match', {
                width: 120, margin: 1,
                color: { dark: '#f43f5e', light: '#060412' },
              })
            ).then(setQrUrl).catch(() => {})
          }
          else if (event.type === 'error') throw new Error(event.message)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (isZH ? '分析失败，请重试' : 'Analysis failed'))
      setLoading(false)
      setProgress(null)
    }
  }

  async function handleShare() {
    if (!shareCardRef.current || !result) return
    setSharingImg(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2, useCORS: true, backgroundColor: null,
        width: 375, windowWidth: 375,
      })
      const title = isZH
        ? `${result.person1.name} × ${result.person2.name} 契合度 ${result.result.score}分`
        : `${result.person1.name} × ${result.person2.name} Compatibility ${result.result.score}`

      canvas.toBlob(async blob => {
        if (!blob) return
        const file = new File([blob], 'match-result.png', { type: 'image/png' })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title })
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href = url; a.download = 'match-result.png'; a.click()
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } catch { /* ignore */ }
    finally { setSharingImg(false) }
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
            isZH={isZH}
          />

          <div className="text-center text-2xl">💕</div>

          <PersonForm
            label={isZH ? '乙方' : 'Person 2'}
            data={person2} setField={set2}
            timeUnknown={time2Unknown} setTimeUnknown={setTime2Unknown}
            isZH={isZH}
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
                style={{ width: `${result.result.score}%`, background: 'linear-gradient(90deg,#f43f5e,#a78bfa)' }} />
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

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={() => { setResult(null); setProgress(null) }}
              className="flex-1 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {isZH ? '← 重新分析' : '← New Analysis'}
            </button>
            <button
              onClick={handleShare}
              disabled={sharingImg}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: sharingImg ? 'rgba(244,63,94,0.05)' : 'rgba(244,63,94,0.12)',
                color: sharingImg ? 'var(--text-muted)' : '#f43f5e',
                border: '1px solid rgba(244,63,94,0.3)',
                cursor: sharingImg ? 'not-allowed' : 'pointer',
              }}
            >
              {sharingImg ? (isZH ? '生成中…' : 'Generating…') : (isZH ? '💕 分享结果' : '💕 Share')}
            </button>
          </div>

          {/* 隐藏的分享卡片（供 html2canvas 截图） */}
          <div ref={shareCardRef} style={{ position: 'absolute', left: -9999, top: 0 }}>
            <MatchShareCard
              person1={result.person1}
              person2={result.person2}
              result={result.result}
              lang={lang}
              qrUrl={qrUrl}
            />
          </div>
        </div>
      )}
    </div>
  )
}
