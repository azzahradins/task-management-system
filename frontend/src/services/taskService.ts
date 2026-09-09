import { apiClient } from './apiClient'

export type TaskStatus = 'pending' | 'in-progress' | 'done'

export type Task = {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  deadline: string | null
}

export type TaskListResponse = {
  data: Task[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type GetTasksParams = {
  page?: number
  limit?: number
  status?: TaskStatus
  keywords?: string
}

export async function getTasks(params: GetTasksParams = {}) {
  const response = await apiClient.get<TaskListResponse>('/tasks', { params })

  return response.data
}