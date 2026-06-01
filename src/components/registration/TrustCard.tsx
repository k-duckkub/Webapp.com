import { Lock } from 'lucide-react'
import { PaymentIcons } from './PaymentIcons'

export function TrustCard() {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-bg-page rounded-full flex items-center justify-center flex-shrink-0">
          <Lock size={15} className="text-text-body" />
        </div>
        <div>
          <p className="text-sm font-bold text-text-head leading-tight">ปลอดภัย 100%</p>
          <p className="text-xs text-text-muted mt-0.5">ข้อมูลของคุณจะถูกเข้ารหัสและปกป้อง</p>
        </div>
      </div>
      <PaymentIcons />
    </div>
  )
}
