import type { Metadata } from 'next'
import { LibraryHero } from '@/components/library/LibraryHero'
import { LibraryBrowser } from '@/components/library/LibraryBrowser'
import { LibraryProvider } from '@/components/library/LibraryProvider'

export const metadata: Metadata = {
  title: 'คลัง Unity Asset — HamStore',
  description: 'Unity asset ทั้งหมดที่คุณแลกด้วย HamCoin ไปแล้ว ดาวน์โหลดซ้ำได้ไม่จำกัด',
}

export default function LibraryPage() {
  return (
    <main className="min-h-screen pt-16">
      <LibraryProvider>
        <div className="stack">
          <LibraryHero />
          <LibraryBrowser />
        </div>
      </LibraryProvider>
    </main>
  )
}
