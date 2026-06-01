import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'

export function RegistrationPage() {
  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-8 max-sm:p-4">
      <div className="w-full max-w-[1160px] shadow-card rounded-card overflow-hidden
                      grid grid-cols-2 max-lg:grid-cols-1">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  )
}
