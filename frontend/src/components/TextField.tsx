import type { InputHTMLAttributes } from 'react'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  error?: string
  id: string
  label: string
}

export function TextField({ error, label, id, ...inputProps }: TextFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-label" htmlFor={id} >
        {label}
      </label>
      <input
        className={`block w-full rounded-lg border px-4 py-3 text-base text-heading outline-none transition placeholder:text-body focus:ring-4 focus:ring-focus-soft ${error ? 'border-error focus:border-error' : 'border-border focus:border-focus'}`}
        id={id}
        {...inputProps}
      />
      {error && (
        <p className="mt-2 text-sm text-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}