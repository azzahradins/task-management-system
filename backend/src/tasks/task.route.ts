import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { addTaskSchema, getTaskSchema, updateTaskDataSchema, updateTaskIdSchema, } from "./task.schema.js";
import { CreateTaskController, DeleteTaskController, GetTaskController, UpdateTaskController } from "./task.controller.js";

const router = Router();

router.post("/", authenticate, validate({ body: addTaskSchema }), CreateTaskController)
router.get("/", authenticate, validate({ query: getTaskSchema }), GetTaskController)
router.put("/:id", 
    authenticate, 
    validate({ params: updateTaskIdSchema, body: updateTaskDataSchema }),
    UpdateTaskController
)
router.delete("/:id",
    authenticate,
    validate({ params: updateTaskIdSchema }),
    DeleteTaskController
)


export const taskRoutes = router;