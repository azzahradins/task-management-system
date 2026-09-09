import type { KeyboardEvent, ReactNode } from 'react'

type CardProps = {
  'aria-label'?: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick, ...props }: CardProps) {
  const isClickable = Boolean(onClick)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!onClick || (event.key !== 'Enter' && event.key !== ' ')) {
      return
    }

    event.preventDefault()
    onClick()
  }

  return (
    <article
      {...props}
      className={`rounded-xl border border-border bg-surface p-5 shadow-sm shadow-shadow-soft/50 transition sm:p-6 ${
        isClickable
          ? 'cursor-pointer hover:shadow-md focus:outline-none focus:ring-4 focus:ring-focus-soft'
          : ''
      } ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {children}
    </article>
  )
}