'use client'

import Link from 'next/link'
import FortuneForm from '@/components/FortuneForm'
import { useLang } from '@/contexts/LangContext'

export default function ReadingPage() {
  const { tr } = useLang()

  return (
    <div className="min-h-screen relative z-10">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* 导航 */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
          {tr.nav.back}
        </Link>

        {/* 标题 */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gold-gradient">{tr.form.title}</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {tr.form.subtitle}
          </p>
        </div>

        {/* 表单 */}
        <FortuneForm />
      </div>
    </div>
  )
}
