import faker from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createHotels() {
  for (let i = 0; i < 2; i++) {
    await prisma.hotel.create({
      data: {
        name: faker.company.companyName(),
        image: faker.image.city(),
      },
    });
  }

  const hotels = await prisma.hotel.findMany({});

  hotels.forEach(async (e) => {
    for (let i = 0; i < 9; i++) {
      await prisma.room.create({
        data: {
          hotelId: e.id,
          name: faker.random.numeric(3),
          capacity: faker.datatype.number({ min: 1, max: 3 }),
        },
      });
    }
  });
}
