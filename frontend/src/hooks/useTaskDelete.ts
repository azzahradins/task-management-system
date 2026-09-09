import axios from 'axios'
import { useState } from 'react'
import { deleteTask } from '../services/taskService'

type UseTaskDeleteOptions = {
  onSuccess?: () => void
}

export function useTaskDelete({ onSuccess }: UseTaskDeleteOptions = {}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handleDelete(taskId: number) {
    setIsDeleting(true)
    setDeleteError('')

    try {
      await deleteTask(taskId)
      onSuccess?.()
    } catch (error) {
      setDeleteError(
        axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message ?? 'Unable to delete task.'
          : 'Unable to delete task. Please try again.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteError, handleDelete, isDeleting }
}