import { Router } from "express";
import RoomController from "../controllers/roomController";
import roomMiddleware from "../middlewares/roomMiddleware";

const rc = new RoomController();
const router = Router();

router.post("/create", rc.createRoom);
router.post("/:roomID/join", rc.joinRoom);
router.post("/:roomID/leave", roomMiddleware.isMember, rc.leaveRoom);
router.post("/:roomID/delete", roomMiddleware.isMember, roomMiddleware.isHost, rc.deleteRoom);
router.post("/:roomID/send", roomMiddleware.isMember, rc.sendMssg);

export default router;