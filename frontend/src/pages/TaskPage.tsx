import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { TextField } from '../components/TextField'

type TaskStatus = 'pending' | 'in-progress' | 'done'

type Task = {
  id: number
  title: string
  description: string
  status: TaskStatus
  deadline?: Date
}

const tasks: Task[] = [
  {
    id: 1,
    title: 'Plan the sprint backlog',
    description: 'Review open work and prepare the next sprint priorities.',
    status: 'in-progress',
    deadline: new Date('2026-10-01T13:00:00.000Z')
  },
  {
    id: 2,
    title: 'Update project documentation',
    description: 'Add the latest setup steps and API notes to the project docs.',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Review completed tasks',
    description: 'Check the finished work and prepare a short progress summary.',
    status: 'done',
  },
]

const statusStyles: Record<TaskStatus, string> = {
  'pending': 'bg-warning text-label',
  'in-progress': 'bg-info text-label',
  'done': 'bg-success text-label',
}

export function TaskPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDate(new Date()), 1000)

    return () => window.clearInterval(timer)
  }, [])

  const visibleTasks = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim()

    return tasks.filter((task) => {
      const matchesSearch = `${task.title} ${task.description}`
        .toLowerCase()
        .includes(normalizedSearch)
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, selectedStatus])

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
        <time className="text-sm font-medium text-body" dateTime={currentDate.toISOString()}>
          {currentDate.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </time>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <TextField
            id="task-search"
            name="task-search"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search tasks"
            type="search"
            value={searchTerm}
          />
        </div>

        <div className="relative">
          <Button
            aria-expanded={isFilterOpen}
            className="sm:w-auto"
            onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
            type="button"
            variant="secondary"
          >
            Filter{selectedStatus !== 'all' ? `: ${selectedStatus}` : ''}
          </Button>

          {isFilterOpen && (
            <div className="absolute right-0 z-10 mt-1 w-full min-w-40 rounded-lg border border-border bg-surface p-2 shadow-lg shadow-shadow-soft/70 sm:w-48">
              {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
                <Button
                  className="rounded-md px-3 py-2 text-left text-sm"
                  key={status}
                  onClick={() => {
                    setSelectedStatus("done")
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
      </div>

      <div className="grid gap-4">
        {visibleTasks.map((task) => (
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
                <p className="mt-2 text-sm leading-6 text-body">{task.description}</p>
              </div>
              {/* {task.deadline &&
                <p className="shrink-0 text-sm font-medium text-label">Deadline: {task.deadline}</p>
              } */}
            </div>
          </Card>
        ))}

        {visibleTasks.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-body">
            No tasks match your search.
          </p>
        )}
      </div>
    </section>
  )
}
