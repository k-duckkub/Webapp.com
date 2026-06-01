import { FormHeader } from './FormHeader'
import { RegistrationForm } from './RegistrationForm'
import { SubmitButton } from './SubmitButton'
import { PrivacyNote } from './PrivacyNote'

export function RightPanel() {
  return (
    <div className="bg-white flex flex-col justify-center px-12 py-12
                    rounded-r-card max-lg:rounded-t-none max-lg:rounded-b-card
                    max-sm:px-7 max-sm:py-8">
      <FormHeader />
      <RegistrationForm />
      <SubmitButton />
      <PrivacyNote />
    </div>
  )
}
