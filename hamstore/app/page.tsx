import { Hero } from '@/components/store/Hero'
import { Pathway } from '@/components/store/Pathway'
import { ItemGrid } from '@/components/store/ItemGrid'
import { Showcase } from '@/components/store/Showcase'
import { CoinPacks } from '@/components/store/CoinPacks'

export default function StorePage() {
  return (
    <main>
      <Hero />
      <Pathway />
      <ItemGrid />
      <Showcase />
      <CoinPacks />
    </main>
  )
}
