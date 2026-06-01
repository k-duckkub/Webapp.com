import { ArrowRight } from 'lucide-react'

export function SubmitButton() {
  return (
    <button
      type="submit"
      className="w-full mt-2 h-[54px] bg-text-head text-white rounded-input font-bold text-base
                 flex items-center justify-center gap-2.5 tracking-wide
                 hover:bg-[#2C1E08] active:scale-[.99] transition-all duration-150"
    >
      ลงทะเบียนและชำระเงิน
      <ArrowRight size={18} strokeWidth={2.5} />
    </button>
  )
}
