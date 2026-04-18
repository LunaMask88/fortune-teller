'use client'

import { useParams, useRouter } from 'next/navigation'
import { useLang } from '@/contexts/LangContext'
import { getSystemContent } from '@/lib/systems-content'

export default function SystemDetailPage() {
  const params  = useParams()
  const router  = useRouter()
  const { lang } = useLang()
  const slug    = typeof params.slug === 'string' ? params.slug : ''
  const content = getSystemContent(slug, lang)

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-4xl mb-4">🔮</div>
        <p style={{ color: 'var(--text-muted)' }}>
          {lang === 'zh' ? '页面不存在' : 'Page not found'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 text-sm px-4 py-2 rounded-lg"
          style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)' }}
        >
          {lang === 'zh' ? '← 返回首页' : '← Back to Home'}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部渐变头部 */}
      <div
        className="relative px-6 pt-14 pb-10 text-center"
        style={{
          background: 'linear-gradient(180deg, rgba(124,58,237,0.25) 0%, transparent 100%)',
        }}
      >
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-5 text-sm px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}
        >
          {lang === 'zh' ? '← 返回' : '← Back'}
        </button>

        <div className="text-5xl mb-4">{content.icon}</div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--gold)' }}>
          {content.title}
        </h1>
        <p className="text-sm" style={{ color: 'var(--purple-light)' }}>
          {content.subtitle}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 space-y-8">
        {/* 简介 */}
        <section className="mystic-card p-5">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {content.intro}
          </p>
        </section>

        {/* 运作原理 */}
        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--gold)' }}>
            {lang === 'zh' ? '⚙️ 运作原理' : '⚙️ How It Works'}
          </h2>
          <div className="space-y-3">
            {content.howItWorks.map((s, i) => (
              <div key={i} className="mystic-card p-4">
                <div className="font-semibold text-sm mb-1.5" style={{ color: 'var(--purple-light)' }}>
                  {s.heading}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 如何解读 */}
        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--gold)' }}>
            {lang === 'zh' ? '🔍 如何解读' : '🔍 How to Read'}
          </h2>
          <div className="space-y-3">
            {content.howToRead.map((s, i) => (
              <div key={i} className="mystic-card p-4">
                <div className="font-semibold text-sm mb-1.5" style={{ color: 'var(--purple-light)' }}>
                  {s.heading}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 关键词 */}
        {content.keyTerms.length > 0 && (
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--gold)' }}>
              {lang === 'zh' ? '📖 关键词解释' : '📖 Key Terms'}
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {content.keyTerms.map((kt, i) => (
                <div
                  key={i}
                  className="flex gap-3 mystic-card px-4 py-3"
                >
                  <span
                    className="font-bold text-sm flex-shrink-0 w-16"
                    style={{ color: 'var(--gold)' }}
                  >
                    {kt.term}
                  </span>
                  <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {kt.explanation}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="text-center pt-2">
          <button
            onClick={() => router.push('/reading')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #b8952e 100%)',
              color: '#0a0a0a',
              boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
            }}
          >
            {lang === 'zh' ? '✨ 开始我的命理解读' : '✨ Start My Reading'}
          </button>
        </div>
      </div>
    </div>
  )
}
