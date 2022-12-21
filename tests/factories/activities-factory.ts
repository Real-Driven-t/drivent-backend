import dayjs from "dayjs";
import faker from "@faker-js/faker";
import { prisma } from "@/config";

export function createActivity(placeId: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  return prisma.activity.create({
    data: {
      name: faker.name.findName(),
      day: date,
      capacity: faker.datatype.number(2),
      start: dayjs().toDate(),
      duration: dayjs().add(2, "hours").toDate(),
      placeId,
    },
  });
}

export function createPlace() {
  return prisma.place.create({
    data: {
      name: faker.company.companyName(),
    },
  });
}
