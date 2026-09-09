import type { Request, Response } from "express";
import { AppError } from "../helper/errors.js";
import { CreateTask, GetTasks, UpdateTask } from "./task.service.js";
import { DeleteTask } from "./task.service.js";

function CreateTaskController(req: Request, res: Response) {
  const { title, description, status, deadline } = req.body;
  CreateTask({ title, description, status, deadline }, res.locals.userId)
    .then(task => {
      return res.status(201).json(task)
    }).catch(error => {
      const status = error instanceof AppError ? error.statusCode : 500;
      const message = error instanceof Error ? error.message : "Unexpected error";
      return res.status(status).send({ message });
    })
}

function GetTaskController(req: Request, res: Response) {
  const { page: pageParam, limit: limitParam, status, keywords } = req.query;
  const page = Number(pageParam) || 1;
  const limit = Math.min(Math.max(Number(limitParam) || 10, 1), 100);

  GetTasks(res.locals.userId, page, limit, status?.toString(), keywords?.toString())
    .then(({ tasks, total }) => {
      return res.status(200).json({
        data: tasks,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }).catch(error => {
      const status = error instanceof AppError ? error.statusCode : 500;
      const message = error instanceof Error ? error.message : "Unexpected error";
      return res.status(status).send({ message });
    });
}

function UpdateTaskController(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { title, description, status, deadline } = req.body;
  UpdateTask({ id, title, description, status, deadline }, res.locals.userId)
    .then(task => {
      return res.status(200).json(task)
    }).catch(error => {
      const status = error instanceof AppError ? error.statusCode : 500;
      const message = error instanceof Error ? error.message : "Unexpected error";
      return res.status(status).json({ message })
    })
}

function DeleteTaskController(req: Request, res: Response) {
  const id = Number(req.params.id);
  DeleteTask(id , res.locals.userId)
    .then(() => {
      return res.status(204).json({})
    }).catch(error => {
      const status = error instanceof AppError ? error.statusCode : 500;
      const message = error instanceof Error ? error.message : "Unexpected error";
      return res.status(status).json({ message })
    })
}

export { CreateTaskController, GetTaskController, UpdateTaskController, DeleteTaskController };