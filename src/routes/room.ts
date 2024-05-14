import { Router } from "express";
import RoomController from "../controllers/roomController";

const rc = new RoomController();
const router = Router();

router.post("/create", rc.createRoom as any);
router.post("/:_id/delete", rc.deleteRoom);

export default router;