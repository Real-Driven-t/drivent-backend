import { prisma } from "@/config";

async function findActivitiesWithLocals(day: Date) {
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
