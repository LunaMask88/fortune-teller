'use client'

import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import QuickEntry from '@/components/QuickEntry'

// 静态星星（避免 hydration mismatch）
const STARS = [
  { id: 0, x: 5.2, y: 12.4, size: 1.2, delay: 0.5 },
  { id: 1, x: 15.7, y: 34.1, size: 1.8, delay: 1.2 },
  { id: 2, x: 24.3, y: 8.6, size: 0.9, delay: 2.1 },
  { id: 3, x: 33.8, y: 55.2, size: 1.5, delay: 0.8 },
  { id: 4, x: 42.1, y: 21.7, size: 2.0, delay: 3.0 },
  { id: 5, x: 51.4, y: 78.3, size: 1.1, delay: 1.7 },
  { id: 6, x: 63.9, y: 15.8, size: 1.6, delay: 0.3 },
  { id: 7, x: 72.5, y: 42.6, size: 0.8, delay: 2.5 },
  { id: 8, x: 84.2, y: 67.9, size: 1.4, delay: 1.0 },
  { id: 9, x: 91.7, y: 29.4, size: 1.9, delay: 3.5 },
  { id: 10, x: 8.9, y: 88.2, size: 1.3, delay: 0.7 },
  { id: 11, x: 19.3, y: 62.5, size: 1.7, delay: 2.8 },
  { id: 12, x: 47.6, y: 91.3, size: 0.9, delay: 1.4 },
  { id: 13, x: 78.4, y: 5.7, size: 2.1, delay: 0.2 },
  { id: 14, x: 96.1, y: 84.6, size: 1.0, delay: 3.2 },
  { id: 15, x: 36.2, y: 44.8, size: 1.5, delay: 2.0 },
  { id: 16, x: 58.7, y: 32.1, size: 1.2, delay: 1.6 },
  { id: 17, x: 87.3, y: 51.4, size: 1.8, delay: 0.9 },
  { id: 18, x: 12.8, y: 76.9, size: 0.7, delay: 2.3 },
  { id: 19, x: 69.4, y: 93.7, size: 1.4, delay: 1.1 },
]

export default function HomePage() {
  const { tr } = useLang()

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden">
      {/* 星星背景 */}
      <div className="particles" aria-hidden>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {STARS.map(s => (
            <circle
              key={s.id}
              cx={`${s.x}%`}
              cy={`${s.y}%`}
              r={s.size}
              fill="white"
              style={{
                animation: `twinkle ${2 + s.delay}s ease-in-out infinite`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-12 max-w-3xl mx-auto w-full">
        {/* 水晶球装饰 */}
        <div className="relative mb-8 animate-float" style={{ width: 120, height: 120 }}>
          <div style={{
            width: 120, height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(212,175,55,0.3) 0%, rgba(124,58,237,0.4) 40%, rgba(6,4,18,0.9) 100%)',
            boxShadow: '0 0 40px rgba(124,58,237,0.3), 0 0 80px rgba(124,58,237,0.1), inset 0 0 30px rgba(212,175,55,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 52,
          }}>
            🔮
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-3" style={{ lineHeight: 1.2 }}>
          <span className="text-gold-gradient">MysticOracle</span>
        </h1>
        <p className="text-xl mb-3" style={{ color: 'var(--purple-light)' }}>{tr.home.tagline}</p>
        <p className="text-base mb-10 leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: 480 }}>
          {tr.home.desc1}
          <br />{tr.home.desc2}
        </p>

        <Link
          href="/reading"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #b8952e 100%)',
            color: '#0a0a0a',
            boxShadow: '0 4px 24px rgba(212,175,55,0.35)',
          }}
        >
          {tr.home.cta}
        </Link>

        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          {tr.home.hint}
        </p>

        {/* 快捷入口（有档案时显示） */}
        <div className="w-full max-w-sm mt-6">
          <QuickEntry />
        </div>
      </main>

      {/* 功能模块网格 */}
      <section className="relative z-10 w-full max-w-4xl px-6 pb-16">
        <h2 className="text-center text-sm font-medium mb-6 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          {tr.home.systemsTitle}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tr.home.systems.map(s => (
            <Link
              key={s.title}
              href={`/systems/${s.slug}`}
              className="mystic-card p-4 text-center block hover:opacity-80 transition-opacity active:scale-95"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-semibold mb-1 text-sm" style={{ color: 'var(--gold)' }}>{s.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{s.desc}</div>
              <div className="mt-2 text-xs" style={{ color: 'var(--purple-light)', opacity: 0.7 }}>
                {tr.lang === 'zh' ? '了解更多 →' : 'Learn more →'}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 底部 */}
      <footer className="relative z-10 pb-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        {tr.home.footer}
      </footer>
    </div>
  )
}
