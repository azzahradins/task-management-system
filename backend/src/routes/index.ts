import { Router } from "express";
import { authRoutes } from "../auth/auth.route";
import { taskRoutes } from "../tasks/task.route";

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Mount feature sub-routers with base paths
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;