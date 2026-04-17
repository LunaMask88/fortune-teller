'use client'

import { useLang } from '@/contexts/LangContext'
import { useTheme } from '@/contexts/ThemeContext'

export default function LangToggle() {
  const { lang, setLang, tr } = useLang()
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {/* 主题切换 */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all hover:opacity-80"
        style={{
          background: 'rgba(212,175,55,0.12)',
          border: '1px solid rgba(212,175,55,0.35)',
          backdropFilter: 'blur(8px)',
        }}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* 语言切换 */}
      <button
        onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-80"
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
    </div>
  )
}
