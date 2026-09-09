import type { z } from 'zod'

export type FormErrors<T extends string> = Partial<Record<T, string>>

export function getFormErrors<T extends string>(issues: z.core.$ZodIssue[]) {
  return issues.reduce<FormErrors<T>>((fieldErrors, issue) => {
    const field = issue.path[0]

    if (typeof field === 'string') {
      fieldErrors[field as T] ??= issue.message
    }

    return fieldErrors
  }, {})
}