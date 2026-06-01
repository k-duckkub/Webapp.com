import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'

export function RegistrationPage() {
  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-8">
      <div
        className="w-full max-w-[1160px] grid grid-cols-2 lg:grid-cols-2 shadow-card rounded-card overflow-hidden
                   max-lg:grid-cols-1"
      >
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  )
}
