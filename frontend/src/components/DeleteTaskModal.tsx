import { Button } from './Button'
import type { Task } from '../services/taskService'
import { useTaskDelete } from '../hooks/useTaskDelete'

type DeleteTaskModalProps = {
  task: Task
  onClose: () => void
  onSuccess?: () => void
}

export function DeleteTaskModal({ onClose, onSuccess, task }: DeleteTaskModalProps) {
  const { deleteError, handleDelete, isDeleting } = useTaskDelete({
    onSuccess: () => {
      onSuccess?.()
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation">
      <div aria-labelledby="delete-task-title" aria-modal="true" className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl sm:p-8" role="dialog">
        <h2 className="text-2xl font-bold text-heading" id="delete-task-title">Delete task?</h2>
        <p className="mt-3 text-sm leading-6 text-body">
          Are you sure you want to delete <strong className="text-heading">{task.title}</strong>? This action cannot be undone.
        </p>

        {deleteError && <p className="mt-4 text-sm text-error" role="alert">{deleteError}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <Button className="w-auto" disabled={isDeleting} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button className="w-auto" disabled={isDeleting} onClick={() => void handleDelete(task.id)} type="button" variant="danger">
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}