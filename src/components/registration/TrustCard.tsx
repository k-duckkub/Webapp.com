import { Lock } from 'lucide-react'
import { PaymentIcons } from './PaymentIcons'

export function TrustCard() {
  return (
    <div className="flex items-center justify-between gap-4 bg-white px-10 py-4
                    border-t border-[#ECE7E0] flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-bg-page flex items-center justify-center flex-shrink-0">
          <Lock size={15} className="text-text-body" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-text-head leading-tight">ปลอดภัย 100%</p>
          <p className="text-[11px] text-text-muted mt-0.5">ข้อมูลของคุณจะถูกเข้ารหัสและปกป้อง</p>
        </div>
      </div>
      <PaymentIcons />
    </div>
  )
}
