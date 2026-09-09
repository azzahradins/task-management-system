import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db.js";
import { DatabaseError, NotFoundError } from "../helper/errors.js";

interface TaskDatabaseRow extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  status: string;
  deadline: Date | string | null;
}

export interface TaskRow {
  id: number;
  title: string;
  description: string | null;
  status: string;
  deadline: Date | string | null;
}

export interface NewTask {
  title: string;
  description?: string | null;
  status: string;
  deadline: string | Date | null;
}

export async function addTask(task: NewTask, userId: string): Promise<TaskRow> {
  try {
    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO tasks (title, description, status, deadline, user_id) VALUES (?,?, ?, ?, ?)',
      [task.title, task.description ?? null, task.status, task.deadline ?? null, userId]
    );

    return {
      id: result.insertId,
      title: task.title,
      description: task.description ?? null,
      status: task.status,
      deadline: task.deadline ?? null,
    };
  } catch (error) {
    console.error("Error adding user:", error);
    throw new DatabaseError("Failed to reach database");
  }
}

export async function getTasks(
  userId: string,
  page: number,
  limit: number,
  status?: string,
  keywords?: string,
): Promise<{ tasks: TaskRow[]; total: number }> {
  try {
    const filters = ["user_id = ?"];
    const values: (string | number)[] = [userId];

    if (status) {
      filters.push("status = ?");
      values.push(status);
    }

    if (keywords) {
      filters.push("(title LIKE ? OR description LIKE ?)");
      const keyword = `%${keywords}%`;
      values.push(keyword, keyword);
    }

    const whereClause = filters.join(" AND ");
    const offset = (page - 1) * limit;

    // Implement dynamic query to safely add conditions and value order (?, ?, ?, etc.)
    const [tasks] = await db.execute<TaskDatabaseRow[]>(
      `SELECT id, title, description, status, deadline
       FROM tasks
       WHERE ${whereClause}
       ORDER BY deadline IS NULL ASC, deadline ASC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset],
    );
    const [countRows] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM tasks WHERE ${whereClause}`,
      values,
    );

    return { tasks, total: Number(countRows[0]?.total ?? 0) };
  } catch (error) {
    console.error("Error getting tasks:", error);
    throw new DatabaseError("Failed to reach database");
  }
}

async function findTaskById(id: number, userId: string): Promise<TaskRow> {
  try {
    const [rows] = await db.execute<TaskDatabaseRow[]>(
      `SELECT id, title, description, status, deadline
       FROM tasks
       WHERE id = ? AND user_id = ?`,
      [id, userId],
    );

    const task = rows[0];
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    return task;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    throw new DatabaseError("Failed to reach database");
  }
}

export async function updateTask(task: TaskRow, userId: string): Promise<TaskRow> {
  try {
    await findTaskById(task.id, userId);

    await db.execute<ResultSetHeader>(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, deadline = ?
       WHERE id = ? AND user_id = ?`,
      [
        task.title,
        task.description ?? null,
        task.status,
        task.deadline ?? null,
        task.id,
        userId,
      ],
    );

    return {
      id: task.id,
      title: task.title,
      description: task.description ?? null,
      status: task.status,
      deadline: task.deadline ?? null,
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    console.error("Error updating task:", error);
    throw new DatabaseError("Failed to reach database");
  }
}

export async function deleteTask(id: number, userId: string): Promise<null> {
  try {
    const task = await findTaskById(id, userId);

    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM tasks WHERE id = ? AND user_id = ?`,
      [id, userId],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundError("Deletion failed");
    }

    return null;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    console.error("Error deleting task:", error);
    throw new DatabaseError("Failed to reach database");
  }
}