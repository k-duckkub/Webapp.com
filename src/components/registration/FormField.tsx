import { type LucideIcon } from 'lucide-react'

interface FormFieldProps {
  no: string
  label: string
  icon: LucideIcon
  placeholder: string
  suffix?: string
  type?: string
  optional?: boolean
}

export function FormField({
  no,
  label,
  icon: Icon,
  placeholder,
  suffix,
  type = 'text',
  optional = false,
}: FormFieldProps) {
  const id = `field-${no.replace('.', '')}-${label}`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-text-head">
        {no} {label}
      </label>
      <div
        className="flex items-center gap-3 bg-white border border-border-input rounded-input
                   h-[52px] px-4 transition-all duration-150
                   focus-within:border-accent focus-within:shadow-input"
      >
        <Icon size={17} className="text-text-muted flex-shrink-0" />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          required={!optional}
          className="flex-1 bg-transparent outline-none text-sm text-text-head
                     placeholder:text-text-muted min-w-0"
        />
        {suffix && (
          <span className="text-sm text-text-muted flex-shrink-0">{suffix}</span>
        )}
      </div>
    </div>
  )
}
