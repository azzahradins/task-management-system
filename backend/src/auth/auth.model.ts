import type { RowDataPacket } from "mysql2";
import { db } from "../config/db.js";
import { DatabaseError, NotFoundError } from "../helper/errors.js";

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password?: string;
}

export async function addUser(user_id: string, email: string, username: string, password: string) {
  try {
    const [result] = await db.execute(
      'INSERT INTO users (user_id, email, name, password) VALUES (?,?, ?, ?)',
      [user_id, email, username, password]
    );
    return result;
  } catch (error) {
    console.error("Error adding user:", error);
    throw new DatabaseError("Failed to reach database");
  }
}

export async function getUserByEmail(email: string): Promise<UserRow | undefined> {
  try {
    const [rows] = await db.execute<UserRow[]>(
      'SELECT user_id, email, password FROM users WHERE email = ?',
      [email]
    );
    
    if (!rows[0]) {
      return undefined;
    }

    return rows[0];
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.log(error)
    throw new DatabaseError("Failed to reach database");
  }
}