'use client'

import { useLang } from '@/contexts/LangContext'

export default function LangToggle() {
  const { lang, setLang, tr } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-80"
      style={{
        background: 'rgba(212,175,55,0.12)',
        border: '1px solid rgba(212,175,55,0.35)',
        color: 'var(--gold)',
        backdropFilter: 'blur(8px)',
      }}
      title={lang === 'zh' ? 'Switch to English' : '切换为中文'}
    >
      {tr.toggle}
    </button>
  )
}
