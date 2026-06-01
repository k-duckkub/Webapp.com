import { type LucideIcon } from 'lucide-react'

interface FeatureItemProps {
  icon: LucideIcon
  title: string
  sub: string
}

export function FeatureItem({ icon: Icon, title, sub }: FeatureItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-10 h-10 bg-accent-soft rounded-xl flex items-center justify-center">
        <Icon size={18} className="text-accent" />
      </div>
      <p className="text-sm font-bold text-text-head leading-tight">{title}</p>
      <p className="text-xs text-text-muted -mt-1">{sub}</p>
    </div>
  )
}
