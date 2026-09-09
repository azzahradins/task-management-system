import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { isRegistered } from "../helper/jwt.js";

// helper, to be reusable by tasks token validation
function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : undefined;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    if(isRegistered(token)){
        const payload = jwt.verify(token, env.JWT_SECRET);
        if (typeof payload === "string" || typeof payload.id !== "string") {
          throw new Error("Authorization payload is invalid");
        }

        res.locals.token = token;
        res.locals.userId = payload.id;
        return next();
    }
    throw new Error("Authorization invalid");
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export { authenticate };
