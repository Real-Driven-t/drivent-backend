import faker from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createActivities() {
  const placesName = ["Auditório Principal", "Auditório Lateral", "Sala de Workshop"];
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  for (let i = 0; i < placesName.length; i++) {
    await prisma.place.create({
      data: {
        name: placesName[i],
      },
    });
  }

  const places = await prisma.place.findMany({});

  places.forEach(async (e) => {
    for (let i = 1; i <= 3; i++) {
      const start = new Date();
      start.setHours(0, 9, 0, 0);

      const duration = new Date();
      duration.setHours(0, 9 + i, 0, 0);

      await prisma.activity.create({
        data: {
          name: faker.name.jobArea(),
          day: date,
          capacity: faker.datatype.number(2),
          start: start,
          duration: duration,
          placeId: e.id,
        },
      });
    }
  });
}
