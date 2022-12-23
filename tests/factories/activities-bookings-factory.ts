import { prisma } from "@/config";

export async function createActivityBooking(userId: number, activityId: number) {
  return prisma.activityBooking.create({
    data: {
      userId,
      activityId,
    },
  });
}
