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

async function createActivity(userId: number, activityId: number) {
  return prisma.activityBooking.create({
    data: {
      activityId,
      userId,
    },
  });
}

async function getActivityById(activityId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activityId,
    },
  });
}

async function getAllActivitiesFromUser(userId: number) {
  return prisma.activityBooking.findMany({
    where: {
      userId,
    },
    include: {
      Activity: true,
    },
  });
}

const activityRepository = {
  findActivitiesWithLocals,
  createActivity,
  getActivityById,
  getAllActivitiesFromUser,
};

export default activityRepository;
