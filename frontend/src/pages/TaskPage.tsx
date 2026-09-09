import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { DeleteTaskModal } from '../components/DeleteTaskModal'
import { TaskModal } from '../components/TaskModal'
import { TextField } from '../components/TextField'
import type { Task } from '../services/taskService'
import { logout } from '../services/authService'
import { useAuth } from '../hooks/useAuth'

import { useTaskHooks } from '../hooks/useTaskHooks'

const statusStyles = {
  'pending': 'bg-warning text-label',
  'in-progress': 'bg-info text-label',
  'done': 'bg-success text-label',
} as const

export function TaskPage() {
  const navigate = useNavigate()
  const { clearToken } = useAuth()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  function closeTaskModal() {
    setIsTaskModalOpen(false)
    setEditingTask(undefined)
  }

  async function handleLogout() {
    try {
      await logout()
    } finally {
      clearToken()
      navigate('/login', { replace: true })
    }
  }
  const [deletingTask, setDeletingTask] = useState<Task | undefined>()
  const {
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
  } = useTaskHooks()
  return (
    <section className="mx-auto w-full max-w-5xl">
      <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-body">
            Task workspace
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            Your tasks
          </h1>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex w-fit">
            <Button
              className="p-0"
              onClick={() => void handleLogout()}
              type="button"
              variant="danger-outline"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <TextField
            id="task-search"
            name="task-search"
            onChange={(event) => changeSearchTerm(event.target.value)}
            placeholder="Search tasks"
            type="search"
            value={searchTerm}
          />
        </div>

        <div className="relative">
          <Button
            className="sm:w-auto"
            onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
            type="button"
            variant="secondary"
          >
            Filter{selectedStatus !== 'all' ? `: ${selectedStatus}` : ''}
          </Button>

          {isFilterOpen && (
            <div className="absolute right-0 z-10 mt-1 w-full min-w-40 rounded-lg border border-border bg-surface p-2 shadow-lg shadow-shadow-soft/70 sm:w-48">
              {(['all', 'pending', 'in-progress', 'done'] as const).map((status) => (
                <Button
                  className="rounded-md px-3 py-2 text-left text-sm"
                  key={status}
                  onClick={() => {
                    changeStatus(status)
                    setIsFilterOpen(false)
                  }}
                  type="button"
                  variant="menu"
                >
                  {status}
                </Button>
              ))}
            </div>
          )}
        </div>

        <Button
            className="sm:w-auto bg-zinc-600"
            onClick={() => {
              setEditingTask(undefined)
              setIsTaskModalOpen(true)
            }}
            type="button"
          >
            Add New Task
          </Button>
      </div>

      {isLoading && (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-body">
          Loading tasks...
        </p>
      )}

      {error && !isLoading && (
        <p className="rounded-xl border border-error bg-surface p-8 text-center text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4">
        {!isLoading && !error && tasks.map((task) => (
          <Card
            key={task.id}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
                    {task.status}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-heading">{task.title}</h2>
                <p className="mt-2 text-sm leading-6 text-body">{task.description ?? 'No description provided.'}</p>
              </div>
              {task.deadline && (
                <p className="shrink-0 text-sm text-orange-600 font-medium">
                  Deadline: {new Date(task.deadline).toLocaleString()}
                </p>
              )}
            </div>
            <footer className="mt-5 w-full flex justify-end gap-3 border-t pt-3 divide-gray-300">
              <Button
                className="w-auto "
                onClick={() => {
                  setEditingTask(task)
                  setIsTaskModalOpen(true)
                }}
                type="button"
                variant="warning-outline"
              >
                Update
              </Button>
              <span className="border-r-2 rounded-none"></span>
              <Button
                onClick={() => setDeletingTask(task)}
                type="button"
                variant="danger-outline"
              >
                Delete
              </Button>
            </footer>
          </Card>
        ))}

        {!isLoading && !error && tasks.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-body">
            No tasks match your search.
          </p>
        )}
      </div>

      {!isLoading && !error && totalPages > 1 ? (
        <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <Button
            className="w-auto"
            disabled={page === 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            type="button"
            variant="secondary"
          >
            Previous
          </Button>
          <span className="text-sm text-body">Page {page} of {totalPages}</span>
          <Button
            className="w-auto"
            disabled={page === totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            type="button"
            variant="secondary"
          >
            Next
          </Button>
        </div>
      ) : null}

      {isTaskModalOpen ? (
        <TaskModal
          task={editingTask}
          onClose={closeTaskModal}
          onSuccess={() => {
            refreshTasks()
          }}
        />
      ) : null}

      {deletingTask ? (
        <DeleteTaskModal
          task={deletingTask}
          onClose={() => setDeletingTask(undefined)}
          onSuccess={() => {
            refreshTasks()
            setDeletingTask(undefined)
          }}
        />
      ) : null}
    </section>
  )
}
