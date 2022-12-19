import roomRepository from "@/repositories/room-repository";

async function getRooms(hotelId: number) {
  const rooms = await roomRepository.findAllByHotelId(hotelId);
  return rooms;
}

const roomService = {
  getRooms,
};

export default roomService;
