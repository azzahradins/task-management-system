import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

export const registerSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters.'),
  email: z.email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>

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