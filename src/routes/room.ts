import { Router } from "express";
import RoomController from "../controllers/roomController";
import roomMiddleware from "../middlewares/roomMiddleware";

const rc = new RoomController();
const router = Router();

router.get("/", rc.queryRoomsOrGetAll);
router.post("/create", rc.createRoom);
router.post("/:roomID/join", rc.joinRoom);
router.post("/:roomID/leave", roomMiddleware.isMember, rc.leaveRoom);
router.delete("/:roomID/delete", roomMiddleware.isMember, roomMiddleware.isHost, rc.deleteRoom);
router.post("/:roomID/send", roomMiddleware.isMember, rc.sendMssg);
router.delete("/:roomID/chat/:messageID/", roomMiddleware.isMember, roomMiddleware.isHostOrSender, rc.deleteMssg);
router.get("/:roomID/messages", roomMiddleware.isMember, rc.getRoomMessages);
router.get("/:roomID/info", roomMiddleware.isMember, rc.getRoomInfo);

export default router;
