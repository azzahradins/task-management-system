import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'menu' | 'warning' | 'warning-outline' | 'danger' | 'danger-outline'
}

const variantStyles = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-hover',
  secondary:
    'border border-border bg-surface text-label hover:border-focus',
  menu:
    'bg-surface text-label hover:bg-background',
  warning:
    'bg-warning text-label',
  'warning-outline':
    'w-fit bg-transparent px-0 py-0 text-orange-500 hover:underline',
  danger:
    'bg-error text-on-primary hover:bg-primary-hover',
  'danger-outline':
    'w-fit bg-transparent px-0 py-0 text-error hover:underline',
} as const

export function Button({
  children,
  className = '',
  variant = 'primary',
  ...buttonProps
}: ButtonProps) {
  const focusStyles = variant.endsWith('outline')
    ? 'focus:outline-none focus:ring-0'
    : 'focus:outline-none focus:ring-4 focus:ring-focus-soft'

  return (
    <button
      className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition ${focusStyles} ${variantStyles[variant]} ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  )
}