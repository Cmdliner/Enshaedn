import { Router } from "express";
import UserController from "../controllers/userController";

const router = Router();
const userController = new UserController();

router.get('/', userController.getUser);
router.put('/edit', userController.editProfile)