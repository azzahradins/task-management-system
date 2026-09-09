import { addTask, deleteTask, getTasks, updateTask, type NewTask, type TaskRow } from "./task.model";

export async function CreateTask(task: NewTask, userId: string) {
  return await addTask(task, userId)
}

export async function GetTasks(
  userId: string,
  page: number,
  limit: number,
  status?: string,
  keywords?: string,
) {
  return await getTasks(userId, page, limit, status, keywords);
}

export async function UpdateTask(task: TaskRow, userId: string) {
  return await updateTask(task, userId)
}

export async function DeleteTask(id: number, userId: string) {
  return await deleteTask(id, userId)
}