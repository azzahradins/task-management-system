import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'menu'
}

const variantStyles = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-hover',
  secondary:
    'border border-border bg-surface text-label hover:border-focus',
  menu:
    'bg-surface text-label hover:bg-background',
} as const

export function Button({
  children,
  className = '',
  variant = 'primary',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-focus-soft ${variantStyles[variant]} ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  )
}