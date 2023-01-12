import { prisma } from "@/config";
import { Enrollment } from "@prisma/client";
import { CreateAddressParams, UpdateAddressParams } from "../address-repository";

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function findById(enrollmentId: number) {
  return prisma.enrollment.findFirst({
    where: { id: enrollmentId },
  });
}

async function doEnrollTransaction(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
  createdAddress: CreateAddressParams,
  updatedAddress: UpdateAddressParams,
) {
  try {
    return await prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.upsert({
        where: {
          userId,
        },
        create: createdEnrollment,
        update: updatedEnrollment,
      });

      const enrollmentId = enrollment.id;

      await tx.address.upsert({
        where: {
          enrollmentId,
        },
        create: {
          ...createdAddress,
          Enrollment: { connect: { id: enrollmentId } },
        },
        update: updatedAddress,
      });
    });
  } catch (error) {
    throw new Error("Algo deu errado!");
  }
}

export type CreateEnrollmentParams = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, "userId">;

const enrollmentRepository = {
  findWithAddressByUserId,
  doEnrollTransaction,
  findById,
};

export default enrollmentRepository;
