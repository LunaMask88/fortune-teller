'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations, type Lang, type Translations } from '@/lib/i18n'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  tr: Translations
}

const LangContext = createContext<LangCtx>({
  lang: 'zh',
  setLang: () => {},
  tr: translations.zh,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh')

  useEffect(() => {
    const saved = localStorage.getItem('mystic_lang') as Lang | null
    if (saved === 'zh' || saved === 'en') setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('mystic_lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, tr: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
