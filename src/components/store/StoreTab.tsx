import { MinecraftHero } from './MinecraftHero'
import { DiscoverGrid } from './DiscoverGrid'
import { BraveSection } from './BraveSection'
import { DontMissSection } from './DontMissSection'
import { MarketplaceCarousel } from './MarketplaceCarousel'
import { NewsSection } from './NewsSection'

export function StoreTab() {
  return (
    <div style={{ backgroundColor: '#0f0e0d' }}>
      <MinecraftHero />
      <DiscoverGrid />
      <BraveSection />
      <DontMissSection />
      <MarketplaceCarousel />
      <NewsSection />
    </div>
  )
}
