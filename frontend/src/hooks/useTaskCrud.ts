import axios from 'axios'
import { useState, type ChangeEvent, type SubmitEventHandler } from 'react'
import { createTask, updateTask, type Task } from '../services/taskService'
import { getFormErrors, type FormErrors } from '../validation/formErrors'
import { createTaskSchema, type CreateTaskValues } from '../validation/taskSchemas'

type UseTaskCrudOptions = {
  task?: Task
  onSuccess?: () => void
}

const initialValues: CreateTaskValues = {
  title: '',
  description: '',
  status: 'pending',
  deadline: '',
}

function taskToFormValues(task?: Task): CreateTaskValues {
  return task
    ? {
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        deadline: task.deadline ? toDateTimeLocal(task.deadline) : '',
      }
    : initialValues
}

function toDateTimeLocal(value: string) {
  const date = new Date(value)
  const offset = date.getTimezoneOffset() * 60000

  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function useTaskCrud({ onSuccess, task }: UseTaskCrudOptions = {}) {
  const [values, setValues] = useState<CreateTaskValues>(() => taskToFormValues(task))
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
      if (task) {
        await updateTask(task.id, result.data)
      } else {
        await createTask(result.data)
        setValues(initialValues)
      }
      onSuccess?.()
    } catch (error) {
      setSubmitError(
        axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message ?? `Unable to ${task ? 'update' : 'create'} task.`
          : `Unable to ${task ? 'update' : 'create'} task. Please try again.`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return { errors, handleChange, handleSubmit, isSubmitting, submitError, values }
}