import { FormHeader } from './FormHeader'
import { RegistrationForm } from './RegistrationForm'
import { SubmitButton } from './SubmitButton'
import { PrivacyNote } from './PrivacyNote'

export function RightPanel() {
  return (
    <div className="bg-white flex flex-col justify-center px-12 py-12 rounded-r-card">
      <FormHeader />
      <RegistrationForm />
      <SubmitButton />
      <PrivacyNote />
    </div>
  )
}
