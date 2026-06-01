import { Badge } from './Badge'
import { Hero } from './Hero'
import { FeatureList } from './FeatureList'
import { Mascot } from './Mascot'
import { TrustCard } from './TrustCard'

export function LeftPanel() {
  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-l-card"
      style={{ background: 'linear-gradient(160deg, #F3EBDD 0%, #EAE0D0 100%)' }}
    >
      {/* Content */}
      <div className="flex flex-col px-12 pt-12 pb-6 flex-1">
        <Badge />
        <Hero />
        <FeatureList />
      </div>

      {/* Visual: mascot + trust card */}
      <div className="relative flex-1 min-h-[300px] px-12 pb-8 flex flex-col justify-end gap-5">
        <Mascot />
        <TrustCard />
      </div>
    </div>
  )
}
