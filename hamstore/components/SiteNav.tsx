'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const LINKS = [
  { href: '/',        label: 'ของที่ซื้อได้' },
  { href: '/library', label: 'คลัง Unity Asset' },
]

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-ink-700 bg-ink-850/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="select-none text-lg font-black tracking-tight text-white">
            🐹 HamsterHub
          </Link>

          {/* Desktop tabs — the mobile equivalent is the row below. */}
          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded px-4 py-1 text-sm font-medium transition-colors ${
                    active ? 'text-brand' : 'text-muted-bright hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline-md"
                      className="absolute inset-x-2 bottom-0 h-0.5 bg-brand"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Wallet only — HamCoin is earned by learning, never bought, so there
            is no top-up action here. */}
        <div className="flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-800 px-3 py-1.5">
          <span className="text-sm leading-none" aria-hidden>🪙</span>
          <span className="text-xs font-black tabular-nums text-coin">1,240</span>
          <span className="sr-only">HamCoin คงเหลือ 1,240 เหรียญ</span>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="grid grid-cols-2 border-t border-ink-700 md:hidden">
        {LINKS.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`relative py-2.5 text-center text-xs font-bold transition-colors ${
                active ? 'text-brand' : 'text-muted-bright'
              }`}
            >
              {link.label}
              {active && (
                <motion.span
                  layoutId="nav-underline-sm"
                  className="absolute inset-x-6 bottom-0 h-0.5 bg-brand"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
