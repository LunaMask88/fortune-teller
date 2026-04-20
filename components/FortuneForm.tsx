'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserInput, FullReading } from '@/types'
import { useLang } from '@/contexts/LangContext'
import {
  loadProfile, saveProfile, saveLastReading,
  getAndClearQuickPeriod,
  type UserProfile,
} from '@/lib/user-profile'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
function hourLabel(h: number) {
  const names = ['子', '子', '丑', '丑', '寅', '寅', '卯', '卯', '辰', '辰', '巳', '巳',
                 '午', '午', '未', '未', '申', '申', '酉', '酉', '戌', '戌', '亥', '亥']
  return `${String(h).padStart(2, '0')}:00（${names[h]}时）`
}

// 常用国家/地区列表，优先中文市场
const COUNTRIES = [
  { code: 'CN', zh: '中国大陆', en: 'China (Mainland)' },
  { code: 'TW', zh: '台湾',     en: 'Taiwan' },
  { code: 'HK', zh: '香港',     en: 'Hong Kong' },
  { code: 'MO', zh: '澳门',     en: 'Macao' },
  { code: 'SG', zh: '新加坡',   en: 'Singapore' },
  { code: 'MY', zh: '马来西亚', en: 'Malaysia' },
  { code: 'US', zh: '美国',     en: 'United States' },
  { code: 'CA', zh: '加拿大',   en: 'Canada' },
  { code: 'AU', zh: '澳大利亚', en: 'Australia' },
  { code: 'NZ', zh: '新西兰',   en: 'New Zealand' },
  { code: 'GB', zh: '英国',     en: 'United Kingdom' },
  { code: 'JP', zh: '日本',     en: 'Japan' },
  { code: 'KR', zh: '韩国',     en: 'South Korea' },
  { code: 'DE', zh: '德国',     en: 'Germany' },
  { code: 'FR', zh: '法国',     en: 'France' },
  { code: 'NL', zh: '荷兰',     en: 'Netherlands' },
  { code: 'other', zh: '其他',  en: 'Other' },
] as const

const ALL_SYSTEMS = [
  { slug: 'bazi',        icon: '☯️', zh: '八字',  en: 'BaZi' },
  { slug: 'astrology',   icon: '⭐', zh: '星座',  en: 'Astrology' },
  { slug: 'tarot',       icon: '🔮', zh: '塔罗',  en: 'Tarot' },
  { slug: 'ziwei',       icon: '🏛️', zh: '紫微',  en: 'Zi Wei' },
  { slug: 'numerology',  icon: '🔢', zh: '数命',  en: 'Numerology' },
  { slug: 'lucky',       icon: '🎁', zh: '幸运物', en: 'Lucky' },
  { slug: 'liuyao',      icon: '卦', zh: '六爻',  en: 'Liu Yao' },
  { slug: 'meihua',      icon: '🌸', zh: '梅花',  en: 'Meihua' },
  { slug: 'runes',       icon: '᛭', zh: '符文',  en: 'Runes' },
  { slug: 'humandesign', icon: '⬡', zh: '人类图', en: 'Human Design' },
  { slug: 'vedic',       icon: '🌙', zh: '吠陀',  en: 'Vedic' },
  { slug: 'xingming',    icon: '字', zh: '姓名',  en: 'Name' },
]
const ALL_SLUGS = ALL_SYSTEMS.map(s => s.slug)

export default function FortuneForm() {
  const router = useRouter()
  const { tr, lang } = useLang()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<{ step: string; pct: number } | null>(null)
  const [error, setError] = useState('')
  const [timeUnknown, setTimeUnknown] = useState(false)
  const autoSubmitRef = useRef(false)
  const [selectedSystems, setSelectedSystems] = useState<string[]>(ALL_SLUGS)
  const [showSystems, setShowSystems] = useState(false)

  const [form, setForm] = useState<UserInput>({
    name: '',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    gender: 'female',
    country: 'CN',
    city: '',
    period: 'today',
    context: '',
    questions: [],
  })

  function set<K extends keyof UserInput>(key: K, value: UserInput[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  // ── 挂载时从 localStorage 自动填充档案 ──────────────────
  useEffect(() => {
    const profile = loadProfile()
    if (!profile) return
    setForm(f => ({
      ...f,
      name: profile.name,
      birthYear: profile.birthYear,
      birthMonth: profile.birthMonth,
      birthDay: profile.birthDay,
      birthHour: profile.birthHour,
      gender: profile.gender,
      country: profile.country ?? 'CN',
      city: profile.city ?? '',
    }))
    if (profile.birthHour === null) setTimeUnknown(true)

    // 快捷入口：检查是否有待执行的 period 快速提交
    const quickPeriod = getAndClearQuickPeriod()
    if (quickPeriod && !autoSubmitRef.current) {
      autoSubmitRef.current = true
      setForm(f => ({ ...f, period: quickPeriod as UserInput['period'] }))
      // 用 setTimeout 等待 state 更新完成后自动提交
      setTimeout(() => {
        document.getElementById('fortune-submit-btn')?.click()
      }, 100)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ★ 用户决策点：出生时间不知道时的处理策略
  // 选择：(a) 用午时(12)作为默认 (b) 完全跳过时柱计算 (c) 提示用户尽量填写
  function handleTimeUnknown(unknown: boolean) {
    setTimeUnknown(unknown)
    set('birthHour', unknown ? null : 12)
  }

  // 单次 SSE 请求，抛出即失败
  async function attemptFortune(payload: object): Promise<void> {
    const resp = await fetch('/api/fortune', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!resp.ok) throw new Error(tr.form.errorFailed)

    const reader = resp.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let gotResult = false

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const event = JSON.parse(line.slice(6))
        if (event.type === 'progress') {
          setProgress({ step: event.step, pct: event.pct })
        } else if (event.type === 'result') {
          gotResult = true
          sessionStorage.setItem('fortune_reading', JSON.stringify(event.data))
          const profile: UserProfile = {
            name: form.name, birthYear: form.birthYear, birthMonth: form.birthMonth,
            birthDay: form.birthDay, birthHour: form.birthHour, gender: form.gender,
            country: form.country, city: form.city || undefined,
            lang,
          }
          saveProfile(profile)
          saveLastReading(event.data as FullReading)
          router.push('/result')
        } else if (event.type === 'error') {
          throw new Error(event.message)
        }
      }
    }
    if (!gotResult) throw new Error('no result')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError(tr.form.errorName); return }
    setError('')
    setLoading(true)
    setProgress({ step: lang === 'en' ? 'Starting…' : '启动中…', pct: 5 })

    const payload = {
      ...form,
      lang,
      systems: selectedSystems.length === ALL_SLUGS.length ? undefined : selectedSystems,
    }

    try {
      await attemptFortune(payload)
    } catch {
      // 第一次失败（冷启动 / 瞬断）→ 静默重试一次
      try {
        setProgress({ step: lang === 'en' ? 'Reconnecting…' : '正在重连…', pct: 8 })
        await attemptFortune(payload)
      } catch (err) {
        setError(err instanceof Error ? err.message : tr.form.errorRetry)
        setLoading(false)
        setProgress(null)
      }
    }
  }

  const PERIOD_OPTIONS = [
    { value: 'today', label: tr.form.periods.today.label, icon: tr.form.periods.today.icon },
    { value: 'month', label: tr.form.periods.month.label, icon: tr.form.periods.month.icon },
    { value: 'year',  label: tr.form.periods.year.label,  icon: tr.form.periods.year.icon },
  ] as const
  const isLife = form.period === 'life'

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto px-4 py-8">
      <div className="mystic-card p-6 md:p-8 space-y-6">
        {/* 姓名 */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>
            {tr.form.name} <span style={{ color: 'var(--rose)' }}>*</span>
          </label>
          <input
            className="mystic-input"
            placeholder={tr.form.namePlaceholder}
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{tr.form.nameHint}</p>
        </div>

        {/* 性别 */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>{tr.form.gender}</label>
          <div className="flex gap-2">
            {([
              { value: 'female',     label: `♀ ${tr.form.female}` },
              { value: 'male',       label: `♂ ${tr.form.male}` },
              { value: 'undisclosed', label: lang === 'en' ? '— N/A' : '— 不披露' },
            ] as const).map(g => (
              <button
                key={g.value}
                type="button"
                onClick={() => set('gender', g.value)}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: form.gender === g.value ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${form.gender === g.value ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: form.gender === g.value ? 'var(--gold)' : 'var(--text-muted)',
                }}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* 所在地区 */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>
            {lang === 'en' ? 'Country / Region' : '所在国家/地区'}
            <span className="text-xs font-normal ml-2" style={{ color: 'var(--text-muted)' }}>
              {lang === 'en' ? '(affects shopping recommendations)' : '（影响幸运物购买平台推荐）'}
            </span>
          </label>
          <select
            className="mystic-input"
            value={form.country ?? 'CN'}
            onChange={e => set('country', e.target.value)}
          >
            <option value="undisclosed">{lang === 'en' ? '— Prefer not to say' : '— 不披露'}</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {lang === 'en' ? c.en : c.zh}
              </option>
            ))}
          </select>
          {form.country && form.country !== 'undisclosed' && (
            <input
              className="mystic-input mt-2"
              placeholder={lang === 'en' ? 'City (optional)' : '城市（选填）'}
              value={form.city ?? ''}
              onChange={e => set('city', e.target.value)}
              maxLength={40}
            />
          )}
        </div>

        {/* 出生日期 */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>
            {tr.form.birthDate} <span style={{ color: 'var(--rose)' }}>*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="number" className="mystic-input text-center"
                min={1900} max={2024} value={form.birthYear}
                onChange={e => set('birthYear', parseInt(e.target.value) || 1990)}
                placeholder={tr.form.year}
              />
              <p className="text-xs text-center mt-1" style={{ color: 'var(--text-muted)' }}>{tr.form.year}</p>
            </div>
            <div>
              <select
                className="mystic-input"
                value={form.birthMonth}
                onChange={e => set('birthMonth', parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} {tr.form.month}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="mystic-input"
                value={form.birthDay}
                onChange={e => set('birthDay', parseInt(e.target.value))}
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} {tr.form.day}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 出生时辰 */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>{tr.form.birthHour}</label>
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={timeUnknown}
              onChange={e => handleTimeUnknown(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--gold)' }}
            />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{tr.form.timeUnknown}</span>
          </label>
          {!timeUnknown && (
            <select
              className="mystic-input"
              value={form.birthHour ?? 12}
              onChange={e => set('birthHour', parseInt(e.target.value))}
            >
              {HOURS.map(h => (
                <option key={h} value={h}>{hourLabel(h)}</option>
              ))}
            </select>
          )}
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            {tr.form.timeHint}
          </p>
        </div>

        {/* 运势周期 */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--gold)' }}>{tr.form.period}</label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {PERIOD_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('period', opt.value)}
                className="py-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1"
                style={{
                  background: form.period === opt.value ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${form.period === opt.value ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.1)'}`,
                  color: form.period === opt.value ? 'var(--purple-light)' : 'var(--text-muted)',
                }}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
          {/* 人生报告 — 全宽高级选项 */}
          <button
            type="button"
            onClick={() => set('period', 'life')}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            style={{
              background: isLife ? 'linear-gradient(135deg, #d4af37 0%, #b8952e 100%)' : 'rgba(212,175,55,0.06)',
              border: `1px solid ${isLife ? 'transparent' : 'rgba(212,175,55,0.4)'}`,
              color: isLife ? '#0a0a0a' : 'var(--gold)',
              boxShadow: isLife ? '0 4px 16px rgba(212,175,55,0.3)' : 'none',
            }}
          >
            <span>✨</span>
            <span>{tr.form.periods.life.label}</span>
            <span className="text-xs font-normal opacity-70 ml-1">
              {lang === 'en' ? '· Lifetime destiny reading' : '· 终生命格深度解读'}
            </span>
          </button>
        </div>

        {/* 当前状况 */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>
            {tr.form.context} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>（{tr.form.contextOptional}）</span>
          </label>
          <textarea
            className="mystic-input resize-none"
            rows={3}
            maxLength={300}
            placeholder={tr.form.contextPlaceholder}
            value={form.context ?? ''}
            onChange={e => set('context', e.target.value)}
          />
          <p className="mt-1 text-xs text-right" style={{ color: 'var(--text-muted)' }}>
            {(form.context ?? '').length} / 300
          </p>
        </div>

        {/* 你想问的问题 */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>
            {tr.form.questions} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>（{tr.form.questionsOptional}）</span>
          </label>

          {/* 快速添加建议 */}
          {(form.questions ?? []).length < 5 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tr.form.suggestedQ.map((q: string) => {
                const already = (form.questions ?? []).includes(q)
                if (already) return null
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => set('questions', [...(form.questions ?? []), q])}
                    className="text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-70"
                    style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--purple-light)', border: '1px solid rgba(124,58,237,0.25)' }}
                  >
                    + {q}
                  </button>
                )
              })}
            </div>
          )}

          {/* 问题列表 */}
          <div className="space-y-2">
            {(form.questions ?? []).map((q, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  className="mystic-input flex-1"
                  placeholder={tr.form.questionPlaceholder(idx + 1)}
                  maxLength={60}
                  value={q}
                  onChange={e => set('questions', (form.questions ?? []).map((old, i) => i === idx ? e.target.value : old))}
                />
                <button
                  type="button"
                  onClick={() => set('questions', (form.questions ?? []).filter((_, i) => i !== idx))}
                  className="px-3 rounded-xl text-sm transition-opacity hover:opacity-70"
                  style={{ background: 'rgba(201,123,132,0.1)', color: 'var(--rose)', border: '1px solid rgba(201,123,132,0.2)' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* 添加自定义问题 */}
          {(form.questions ?? []).length < 5 && (
            <button
              type="button"
              onClick={() => set('questions', [...(form.questions ?? []), ''])}
              className="mt-2 w-full py-2 rounded-xl text-sm transition-opacity hover:opacity-70"
              style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.15)' }}
            >
              + {tr.form.addQuestion}
            </button>
          )}
        </div>

        {/* 命理体系多选 */}
        <div>
          <button
            type="button"
            onClick={() => setShowSystems(v => !v)}
            className="w-full flex items-center justify-between text-sm py-2 px-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}
          >
            <span>{lang === 'en' ? '⚙️ Divination Systems' : '⚙️ 命理体系'}</span>
            <span style={{ color: selectedSystems.length === ALL_SLUGS.length ? 'var(--text-muted)' : 'var(--gold)' }}>
              {selectedSystems.length === ALL_SLUGS.length
                ? (lang === 'en' ? 'All 12 ▾' : '全选 12 ▾')
                : `${selectedSystems.length}/12 ▾`}
            </span>
          </button>
          {showSystems && (
            <div className="mt-2 p-3 rounded-xl space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                <span>{lang === 'en' ? 'Select systems to include' : '选择参与解读的体系'}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSelectedSystems(ALL_SLUGS)} style={{ color: 'var(--gold)' }}>
                    {lang === 'en' ? 'All' : '全选'}
                  </button>
                  <span style={{ opacity: 0.3 }}>·</span>
                  <button type="button" onClick={() => setSelectedSystems([])} style={{ color: 'var(--text-muted)' }}>
                    {lang === 'en' ? 'None' : '清空'}
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SYSTEMS.map(s => {
                  const on = selectedSystems.includes(s.slug)
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => setSelectedSystems(prev =>
                        on ? prev.filter(x => x !== s.slug) : [...prev, s.slug]
                      )}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all"
                      style={{
                        background: on ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${on ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        color: on ? 'var(--gold)' : 'var(--text-muted)',
                      }}
                    >
                      <span>{s.icon}</span>
                      <span>{lang === 'en' ? s.en : s.zh}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-center py-2 px-4 rounded-lg" style={{ background: 'rgba(201,123,132,0.1)', color: 'var(--rose)', border: '1px solid rgba(201,123,132,0.2)' }}>
            {error}
          </p>
        )}

        {/* 进度条（loading 时显示） */}
        {loading && progress && (
          <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--gold)' }}>
              <span className="flex items-center gap-1.5">
                <span className="animate-spin inline-block">✦</span>
                {progress.step}
              </span>
              <span>{progress.pct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress.pct}%`,
                  background: 'linear-gradient(90deg, #d4af37 0%, #a78bfa 100%)',
                  boxShadow: '0 0 8px rgba(212,175,55,0.5)',
                }}
              />
            </div>
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              {lang === 'en' ? 'Please wait, this usually takes 20–40 seconds' : '请稍候，通常需要 20–40 秒'}
            </p>
          </div>
        )}

        <button
          id="fortune-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-base transition-all"
          style={{
            background: loading ? 'rgba(212,175,55,0.15)' : 'linear-gradient(135deg, #d4af37 0%, #b8952e 100%)',
            color: loading ? 'var(--text-muted)' : '#0a0a0a',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(212,175,55,0.3)',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span> {tr.form.submitting}
            </span>
          ) : tr.form.submit}
        </button>
      </div>
    </form>
  )
}
