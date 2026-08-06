import { Hero } from '@/components/store/Hero'
import { CategoryBands } from '@/components/store/CategoryBands'
import { Pathway } from '@/components/store/Pathway'
import { ItemGrid } from '@/components/store/ItemGrid'

export default function StorePage() {
  return (
    <main>
      <Hero />
      <CategoryBands />
      <Pathway />
      <ItemGrid />
    </main>
  )
}
