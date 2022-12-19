import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getRooms } from "@/controllers";

const roomRouter = Router();
roomRouter.all("/*", authenticateToken).get("/:hotelId", getRooms);

export { roomRouter };
