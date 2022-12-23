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

async function findDaysWithActivities() {
  return prisma.activity.groupBy({
    by: ["day"],
  });
}

const activityRepository = {
  findActivitiesWithLocals,
  findDaysWithActivities,
};

export default activityRepository;
