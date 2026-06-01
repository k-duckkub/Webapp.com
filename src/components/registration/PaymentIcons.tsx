function VisaLogo() {
  return (
    <div className="h-7 px-2.5 border border-border-input rounded-lg bg-white flex items-center justify-center">
      <svg width="38" height="12" viewBox="0 0 38 12" aria-label="Visa">
        <text x="0" y="11" fontSize="13" fontWeight="900" fontStyle="italic"
          fill="#1A1F71" fontFamily="Arial,sans-serif" letterSpacing="-0.5">VISA</text>
      </svg>
    </div>
  )
}

function MastercardLogo() {
  return (
    <div className="h-7 px-2 border border-border-input rounded-lg bg-white flex items-center justify-center gap-0">
      <svg width="34" height="22" viewBox="0 0 34 22" aria-label="Mastercard">
        <circle cx="12" cy="11" r="10" fill="#EB001B" />
        <circle cx="22" cy="11" r="10" fill="#F79E1B" />
        <path d="M17 3.8 A10 10 0 0 1 17 18.2 A10 10 0 0 1 17 3.8Z" fill="#FF5F00" />
      </svg>
    </div>
  )
}

function ApplePayLogo() {
  return (
    <div className="h-7 px-2.5 border border-border-input rounded-lg bg-white flex items-center justify-center gap-1">
      <svg width="13" height="15" viewBox="0 0 14 17" fill="#1A1A1A" aria-hidden>
        <path d="M13.4 12.8c-.3.6-.6 1.2-1.1 1.8-.6.8-1.1 1.3-1.6 1.5-.6.2-1.3.1-2-.3-.6-.3-1.2-.5-1.7-.5-.5 0-1.1.2-1.7.5-.7.4-1.3.5-1.9.3-.6-.2-1.2-.8-1.8-1.6C.8 13.5.2 12.4.1 11.2c-.1-1.3.2-2.5 1-3.5.6-.8 1.4-1.2 2.4-1.3.5 0 1.2.2 2.1.5.5.2.9.3 1 .3.1 0 .5-.1 1-.3 1-.4 1.8-.5 2.4-.4 1.6.1 2.8.8 3.5 2.1-.4.3-.8.6-1 1-.3.6-.5 1.3-.5 1.9 0 .8.3 1.5.8 2.1.3.3.6.6.9.7-.1.3-.2.5-.3.5zM9.8 1c0 .6-.2 1.2-.5 1.7-.4.6-.9 1.1-1.5 1.4-.5.2-.9.3-1 .3V4c0-.5.2-1.1.6-1.7.4-.6 1-.9 1.8-1 .1 0 .3 0 .5-.1l.1.8z" />
      </svg>
      <span className="text-xs font-bold text-text-head">Pay</span>
    </div>
  )
}

export function PaymentIcons() {
  return (
    <div className="flex items-center gap-2">
      <VisaLogo />
      <MastercardLogo />
      <ApplePayLogo />
    </div>
  )
}
