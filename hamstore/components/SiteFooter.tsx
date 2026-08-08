import Link from 'next/link'
import { COPY } from '@/lib/content'
import { Icon } from '@/components/Icon'

const COLUMNS = COPY.footer.columns

export function SiteFooter() {
  return (
    /* The footer is the last panel in the stack, not a band underneath it —
       on the cream ground a `bg-mist` footer simply dissolved into the page. */
    <footer className="stack text-[12px] leading-relaxed text-slate">
      <div className="panel">
        <div className="mb-8 flex items-center gap-4 border-b border-hairline pb-8">
          <span className="icon-chip h-14 w-14 shrink-0">
            <Icon name="hamster" className="h-7 w-7" strokeWidth={1.6} />
          </span>
          <p className="text-[15px] font-bold leading-snug text-graphite">
            {COPY.nav.wordmark}
            <span className="block text-[13px] font-normal text-slate">{COPY.footer.copyright}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-b border-hairline pb-10 sm:grid-cols-4">
          {COLUMNS.map(col => (
            <div key={col.title}>
              <h3 className="mb-3 text-[12px] font-semibold text-graphite">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <span className="cursor-default transition-colors hover:text-graphite">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>{COPY.footer.copyright}</p>
          <nav className="flex gap-5">
            <Link href="/" className="transition-colors hover:text-graphite">
              {COPY.nav.storeLabel}
            </Link>
            <Link href="/library" className="transition-colors hover:text-graphite">
              {COPY.nav.libraryLabel}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
