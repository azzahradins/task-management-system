import { Router } from "express";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { addTaskSchema, getTaskSchema, updateTaskDataSchema, updateTaskIdSchema, } from "./task.schema";
import { CreateTaskController, DeleteTaskController, GetTaskController, UpdateTaskController } from "./task.controller";

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