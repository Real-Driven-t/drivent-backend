import { prisma } from "@/config";

async function findActivitiesWithLocals(day: Date) {
  console.log(typeof day);
  return prisma.place.findMany({
    include: {
      Activity: {
        where: {
          day,
        },
      },
    },
  });
}

const activityRepository = {
  findActivitiesWithLocals,
};

export default activityRepository;
