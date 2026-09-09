import { apiClient } from './apiClient'
import type { CreateTaskValues } from '../validation/taskSchemas'

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

function toUtcDeadline(deadline: string | undefined) {
  return deadline ? new Date(deadline).toISOString() : null
}

function toTaskPayload(task: CreateTaskValues) {
  return {
    ...task,
    description: task.description || null,
    deadline: toUtcDeadline(task.deadline),
  }
}

export async function createTask(task: CreateTaskValues) {
  const response = await apiClient.post<Task>('/tasks', toTaskPayload(task))

  return response.data
}

export async function updateTask(id: number, task: CreateTaskValues) {
  const response = await apiClient.put<Task>(`/tasks/${id}`, toTaskPayload(task))

  return response.data
}

export async function deleteTask(id: number) {
  await apiClient.delete(`/tasks/${id}`)
}