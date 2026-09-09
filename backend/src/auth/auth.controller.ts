import type { Request, Response} from "express";
import { Login, Logout, Register } from "./auth.service.js";
import { BadRequestError, NotFoundError } from "../helper/errors.js";

function LoginController(req: Request, res: Response) {
  const { email, password } = req.body;
  Login(email, password).then((loginResult) => {
    res.status(200).json({ 
      message: "Login successful",
      data: loginResult
    });
  }).catch((error) => {
    if (error instanceof NotFoundError) {
      return res.status(401).json({ message: error.message });
    } else if (error instanceof BadRequestError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  })
}

function RegisterController(req: Request, res: Response) {
  const { username, email, password } = req.body;
  Register(username, email, password).then((registerResult) => {
    res.status(201).json({ message: "Registration successful", data: registerResult });
  }).catch((error) => {
    if (error instanceof BadRequestError) {
      res.status(400).json({ message: error.message });
      return
    }
    res.status(500).json({ message: error.message });
    return
  })
}

function LogoutController(req: Request, res: Response) {
  Logout(res.locals.token);
  return res.status(200).json({ message: "Logout Succeed" });
}

export { LoginController, RegisterController, LogoutController };