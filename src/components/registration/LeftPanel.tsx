import { Badge } from './Badge'
import { Hero } from './Hero'
import { FeatureList } from './FeatureList'
import { Mascot } from './Mascot'
import { HeroShowcase } from './HeroShowcase'
import { TrustCard } from './TrustCard'

export function LeftPanel() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-l-card max-lg:rounded-b-none max-lg:rounded-tl-card max-lg:rounded-tr-card"
      style={{ background: 'linear-gradient(160deg, #F3EBDD 0%, #EAE0D0 100%)' }}
    >
      {/* Top text content */}
      <div className="flex-shrink-0 px-12 pt-12 pb-5">
        <Badge />
        <Hero />
        <FeatureList />
      </div>

      {/* Hero visual: mascot + showcase card */}
      <div className="relative flex-1 min-h-[300px] overflow-hidden">
        <Mascot />
        <HeroShowcase />
      </div>

      {/* Trust bar — full bleed white strip */}
      <TrustCard />
    </div>
  )
}
