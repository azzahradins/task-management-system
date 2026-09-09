import { env } from "../config/env.js";
import { BadRequestError, NotFoundError } from "../helper/errors.js";
import { registerToken, revokeToken } from "../helper/jwt.js";
import { addUser, getUserByEmail } from "./auth.model.js";
import bcrypt from "bcrypt";

import jwt from 'jsonwebtoken';

// Login function that takes email and password as parameters
// Retrives email first, then compare pasword with hashed bycrypt password
// Store whitelisted token on Set
export async function Login(email: string, password: string) {
  try {
    const user = await getUserByEmail(email);
    if(user && user.password) {
      if(await bcrypt.compare(password, user.password)) {
        const tokenDuration = env.JWT_DURATION
        const token = jwt.sign({id: user.user_id}, env.JWT_SECRET, {
          expiresIn: tokenDuration 
        });
        registerToken(token)
        return { token, duration: tokenDuration };
      } else {
        throw new BadRequestError("Password invalid");
      }
    } else {
      throw new NotFoundError("Credentials invalid");
    }
  } catch (error) {
    throw error;
  }
}

export async function Register(username: string, email: string, password: string) {
  try {
    const user = await getUserByEmail(email);
    if(user) {
      throw new BadRequestError("User already exists");
    }
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        throw new BadRequestError("Failed to hash password");
      }
      const uuid = crypto.randomUUID();
      await addUser(uuid, email, username, hashedPassword);
    });
  } catch (error) {
    throw error;
  }
}

export async function Logout(token: string){
  try {
    revokeToken(token);
  } catch (error) {
    throw error;
  }
}

