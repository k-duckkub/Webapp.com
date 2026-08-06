import { Hero } from '@/components/store/Hero'
import { Recommended } from '@/components/store/Recommended'
import { PinnedStory } from '@/components/store/PinnedStory'
import { FeatureSections } from '@/components/store/FeatureSections'
import { ItemGrid } from '@/components/store/ItemGrid'

export default function StorePage() {
  return (
    <main>
      <Hero />
      <Recommended />
      <PinnedStory />
      <FeatureSections />
      <ItemGrid />
    </main>
  )
}
