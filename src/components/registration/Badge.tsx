import { GraduationCap } from 'lucide-react'

export function Badge() {
  return (
    <div className="inline-flex items-center gap-2 bg-white border border-accent/30 rounded-pill px-4 py-2 w-fit">
      <GraduationCap size={15} className="text-accent" />
      <span className="text-sm font-bold text-accent">คอร์สออนไลน์</span>
    </div>
  )
}
