import { Router } from "express";
import { LoginController, LogoutController, RegisterController } from "./auth.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const router = Router();

router.post('/register', validate({body: registerSchema}), RegisterController);
router.post('/login', validate({body: loginSchema}), LoginController);
router.post('/logout', authenticate, LogoutController);


export const authRoutes = router;