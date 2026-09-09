import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function Button({ children, className = '', ...buttonProps }: ButtonProps) {
  return (
    <button
      className={`w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-focus-soft ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  )
}