import { Router } from "express";
import { LoginController, LogoutController, RegisterController } from "./auth.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { loginSchema, registerSchema } from "./auth.schema";

const router = Router();

router.post('/register', validate({body: registerSchema}), RegisterController);
router.post('/login', validate({body: loginSchema}), LoginController);
router.post('/logout', authenticate, LogoutController);


export const authRoutes = router;