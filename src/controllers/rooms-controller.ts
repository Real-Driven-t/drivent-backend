import { AuthenticatedRequest } from "@/middlewares";
import roomService from "@/services/rooms-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getRooms(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;
  try {
    const rooms = await roomService.getRooms(Number(hotelId));

    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }
  res.send(hotelId);
}
