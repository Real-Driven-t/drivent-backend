import { prisma } from "@/config";

async function findActivitiesWithLocals(day: Date) {
  return prisma.place.findMany({
    include: {
      Activity: {
        where: {
          day,
        },
        include: {
          _count: {
            select: {
              ActivityBooking: true,
            }
          }
        }  
      },
    },
  });
}

async function findDaysWithActivities() {
  return prisma.activity.groupBy({
    by: ["day"],
    orderBy: {
      day: "asc",
    }
  });
}

const activityRepository = {
  findActivitiesWithLocals,
  findDaysWithActivities,
};

export default activityRepository;
