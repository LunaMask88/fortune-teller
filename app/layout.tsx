import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/contexts/LangContext'
import LangToggle from '@/components/LangToggle'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MysticOracle — Eastern & Western Divination',
  description: 'BaZi, Zi Wei, Western Astrology, Tarot, Numerology — AI-powered fortune reading',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geist.variable} h-full`}>
      <body className="min-h-full star-bg">
        <LangProvider>
          <LangToggle />
          {children}
        </LangProvider>
      </body>
    </html>
  )
}
