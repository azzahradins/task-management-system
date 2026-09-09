import { Button } from './Button'
import { TextField } from './TextField'
import { useTaskCrud } from '../hooks/useTaskCrud'
import type { Task } from '../services/taskService'

type TaskModalProps = {
  task?: Task
  onClose: () => void
  onSuccess?: () => void
}

export function TaskModal({ onClose, onSuccess, task }: TaskModalProps) {
  const isEditing = Boolean(task)
  const { errors, handleChange, handleSubmit, isSubmitting, submitError, values } = useTaskCrud({
    onSuccess: () => {
      onSuccess?.()
      onClose()
    },
    task,
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation">
      <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl sm:p-8" role="dialog">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-heading" id="task-modal-title">{isEditing ? 'Edit task' : 'New task'}</h2>
            <p className="mt-2 text-sm text-body">{isEditing ? 'Update this task.' : 'Add a task to your workspace.'}</p>
          </div>
          <Button
            className="w-auto px-3 py-2"
            onClick={onClose}
            type="button"
            variant="secondary">
            Close
          </Button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            id="title"
            label="Title"
            name="title"
            onChange={handleChange}
            error={errors.title}
            placeholder="Task title"
            type="text"
            value={values.title} />
          <TextField
            id="description"
            label="Description"
            name="description"
            onChange={handleChange}
            error={errors.description}
            placeholder="Optional description"
            type="text"
            value={values.description} />
          <div>
            <label className="mb-2 block text-sm font-medium text-label" htmlFor="new-task-status">Status</label>
            <select
              className="block w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-heading outline-none focus:border-focus focus:ring-4 focus:ring-focus-soft"
              id="status"
              name="status"
              onChange={handleChange}
              value={values.status}>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <TextField
            id="deadline"
            label="Deadline"
            name="deadline"
            onChange={handleChange}
            error={errors.deadline}
            type="datetime-local"
            value={values.deadline}
          />
          {submitError && <p className="text-sm text-error" role="alert">{submitError}</p>}
          <Button
            disabled={isSubmitting}
            type="submit">
            {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Save changes' : 'Create task')}
          </Button>
        </form>
      </div>
    </div>
  )
}