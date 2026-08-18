function Svg({ children, className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      {children}
    </svg>
  )
}

export function PhoneIcon(props) {
  return (
    <Svg {...props}>
      <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-.53 1.482l-1.298 1.04a1 1 0 0 0-.293 1.184 10.05 10.05 0 0 0 5.65 5.65 1 1 0 0 0 1.184-.293l1.04-1.298a1.5 1.5 0 0 1 1.482-.53l3.223.716A1.5 1.5 0 0 1 18 15.35V16.5a1.5 1.5 0 0 1-1.5 1.5h-1c-8.284 0-15-6.716-15-15v-1Z" />
    </Svg>
  )
}

export function ChatIcon(props) {
  return (
    <Svg {...props}>
      <path
        fillRule="evenodd"
        d="M4 3.5A1.5 1.5 0 0 1 5.5 2h9A1.5 1.5 0 0 1 16 3.5v7A1.5 1.5 0 0 1 14.5 12H8l-3 3v-3H5.5A1.5 1.5 0 0 1 4 10.5v-7Z"
        clipRule="evenodd"
      />
    </Svg>
  )
}

export function MailIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 4a2 2 0 0 0-2 2v.35l9 5.4 9-5.4V6a2 2 0 0 0-2-2H3Z" />
      <path d="M19 8.55l-8.53 5.12a1 1 0 0 1-1.03 0L1 8.55V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.55Z" />
    </Svg>
  )
}

export function InstagramIcon(props) {
  return (
    <Svg {...props}>
      <rect x="2" y="2" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14.6" cy="5.4" r="0.9" />
    </Svg>
  )
}

export function FacebookIcon(props) {
  return (
    <Svg {...props}>
      <path d="M18 10a8 8 0 1 0-9.25 7.9v-5.59H6.6V10h2.15V8.14c0-2.12 1.26-3.29 3.2-3.29.92 0 1.89.17 1.89.17v2.08h-1.06c-1.05 0-1.38.65-1.38 1.32V10h2.34l-.37 2.31h-1.97v5.59A8 8 0 0 0 18 10Z" />
    </Svg>
  )
}

export function ImageIcon(props) {
  return (
    <Svg {...props}>
      <rect x="2" y="3" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="8" r="1.5" />
      <path
        d="M4 15l4-4 3 3 3-4 4 5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function ContactCardIcon(props) {
  return (
    <Svg {...props}>
      <rect x="2" y="4" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="10" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 14c.5-1.5 1.8-2 2.5-2s2 .5 2.5 2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M12 8h4M12 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </Svg>
  )
}

export function WhatsAppIcon(props) {
  return (
    <Svg {...props}>
      <path d="M10 2a8 8 0 0 0-6.9 12.02L2 18l4.11-1.08A8 8 0 1 0 10 2Zm0 1.6a6.4 6.4 0 0 1 5.42 9.8 6.4 6.4 0 0 1-9.42 2.03l-.3-.2-2.44.64.65-2.37-.2-.31A6.4 6.4 0 0 1 10 3.6Zm-2.53 3.1c-.16 0-.42.06-.64.31-.22.25-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.7 2.6 4.13 3.54 2.03.79 2.45.63 2.89.6.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.75-1.8-.19-.46-.39-.4-.54-.4Z" />
    </Svg>
  )
}
