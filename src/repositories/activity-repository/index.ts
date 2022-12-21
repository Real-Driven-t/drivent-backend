import { prisma } from "@/config";

async function findActivitiesWithLocals(day: Date) {
  return prisma.activity.findFirst({
    where: {
      day,
    },
    include: {
      Place: true,
    },
  });
}

const activityRepository = {
  findActivitiesWithLocals,
};

export default activityRepository;
