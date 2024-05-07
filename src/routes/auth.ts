import { Router } from "express";
import AuthController from "../controllers/authController";

const router = Router();
const authController = new AuthController();

router.post('/register', authController.signUp);
router.post('/sign-in', authController.signIn);
router.post('/logout', authController.logout);

export default router;