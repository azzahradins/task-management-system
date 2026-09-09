import axios from 'axios'
import { useState, type ChangeEvent, type SubmitEventHandler } from 'react'
import { createTask } from '../services/taskService'
import { getFormErrors, type FormErrors } from '../validation/formErrors'
import { createTaskSchema, type CreateTaskValues } from '../validation/taskSchemas'

type UseTaskCrudOptions = {
  onSuccess?: () => void
}

const initialValues: CreateTaskValues = {
  title: '',
  description: '',
  status: 'pending',
  deadline: '',
}

export function useTaskCrud({ onSuccess }: UseTaskCrudOptions = {}) {
  const [values, setValues] = useState<CreateTaskValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors<keyof CreateTaskValues>>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target

    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }))
    setSubmitError('')
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const result = createTaskSchema.safeParse(values)
    const nextErrors = result.success
      ? {}
      : getFormErrors<keyof CreateTaskValues>(result.error.issues)

    setErrors(nextErrors)
    setSubmitError('')

    if (!result.success) {
      return
    }

    setIsSubmitting(true)

    try {
      await createTask(result.data)
      setValues(initialValues)
      onSuccess?.()
    } catch (error) {
      setSubmitError(
        axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message ?? 'Unable to create task.'
          : 'Unable to create task. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return { errors, handleChange, handleSubmit, isSubmitting, submitError, values }
}