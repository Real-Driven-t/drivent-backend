import faker from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createActivities() {
  const placesName = ["Auditório Principal", "Auditório Lateral", "Sala de Workshop"];

  for (let i = 0; i < placesName.length; i++) {
    await prisma.place.create({
      data: {
        name: placesName[i],
      },
    });
  }

  const places = await prisma.place.findMany({});

  places.forEach(async (e) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    for (let i = 0; i <= 3; i++) {
      date.setDate(date.getDate() + i);
      await prisma.activity.createMany({
        data: [
          {
            name: faker.name.jobArea(),
            day: date,
            capacity: faker.datatype.number(2),
            start: "2022-12-22T12:00:00.000Z",
            duration: "2022-12-22T13:00:00.000Z",
            placeId: e.id,
          },
          {
            name: faker.name.jobArea(),
            day: date,
            capacity: faker.datatype.number(2),
            start: "2022-12-22T13:00:00.000Z",
            duration: "2022-12-22T15:00:00.000Z",
            placeId: e.id,
          },
          {
            name: faker.name.jobArea(),
            day: date,
            capacity: faker.datatype.number(2),
            start: "2022-12-22T15:00:00.000Z",
            duration: "2022-12-22T16:00:00.000Z",
            placeId: e.id,
          },
        ],
      });
    }
  });
}
