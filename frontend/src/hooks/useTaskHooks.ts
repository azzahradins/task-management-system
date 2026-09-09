import axios from 'axios'
import { useEffect, useState } from 'react'
import { getTasks, type Task, type TaskStatus } from '../services/taskService'

type TaskFilter = TaskStatus | 'all'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 400

export function useTaskHooks() {
  // state for list tasks
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<TaskFilter>('all')
  
  // metadata task states
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [searchTerm])

  // Fetch only after debounce finished
  // Refetch after a task mutation succeeds.
  useEffect(() => {
    let isCurrentRequest = true

    async function loadTasks() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getTasks({
          keywords: debouncedSearchTerm.trim() || undefined,
          limit: PAGE_SIZE,
          page,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
        })

        if (isCurrentRequest) {
          setTasks(response.data)
          setTotalPages(response.meta.totalPages)
        }
      } catch (requestError) {
        if (!isCurrentRequest) {
          return
        }

        if (axios.isAxiosError<{ message?: string }>(requestError)) {
          setError(requestError.response?.data?.message ?? 'Unable to load tasks.')
        } else {
          setError('Unable to load tasks. Please try again.')
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      }
    }

    void loadTasks()

    return () => {
      isCurrentRequest = false
    }
  }, [debouncedSearchTerm, page, selectedStatus, refreshKey])

  function changeSearchTerm(value: string) {
    setPage(1)
    setSearchTerm(value)
  }

  function changeStatus(status: TaskFilter) {
    setPage(1)
    setSelectedStatus(status)
  }

  function refreshTasks() {
    setRefreshKey((currentKey) => currentKey + 1)
  }

  return {
    changeSearchTerm,
    changeStatus,
    error,
    isLoading,
    page,
    searchTerm,
    selectedStatus,
    setPage,
    tasks,
    totalPages,
    refreshTasks,
  }
}
