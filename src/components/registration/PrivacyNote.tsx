import { Lock } from 'lucide-react'

export function PrivacyNote() {
  return (
    <p className="flex items-center justify-center gap-1.5 text-xs text-text-muted mt-3.5">
      <Lock size={12} />
      ข้อมูลของคุณจะถูกเก็บเป็นความลับ
    </p>
  )
}
