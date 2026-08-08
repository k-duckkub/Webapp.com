import { Hero } from '@/components/store/Hero'
import { Recommended } from '@/components/store/Recommended'
import { PinnedStory } from '@/components/store/PinnedStory'
import { FeatureSections } from '@/components/store/FeatureSections'
import { ItemGrid } from '@/components/store/ItemGrid'

export default function StorePage() {
  return (
    <main>
      {/* The opening sits on the ground itself; everything after it is a panel
          floating on that ground, with the gap between them doing the work of
          the section breaks the old full-bleed bands used to imply. */}
      <Hero />
      <div className="stack">
        <Recommended />
        <PinnedStory />
        <FeatureSections />
        <ItemGrid />
      </div>
    </main>
  )
}
