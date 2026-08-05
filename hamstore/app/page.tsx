import { Hero } from '@/components/store/Hero'
import { Pathway } from '@/components/store/Pathway'
import { ItemGrid } from '@/components/store/ItemGrid'
import { Showcase } from '@/components/store/Showcase'

export default function StorePage() {
  return (
    <main>
      <Hero />
      <Pathway />
      <ItemGrid />
      <Showcase />
    </main>
  )
}
