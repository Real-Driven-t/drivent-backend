import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();
import { TicketType } from "@prisma/client";
async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  console.log({ event });

  const types = await prisma.ticketType.findFirst({});

  if (!types) {
    await prisma.ticketType.createMany({
      data: [
        {
          name: "online",
          price: 100,
          isRemote: true,
          includesHotel: false,
        },
        {
          name: "presencial",
          price: 250,
          isRemote: false,
          includesHotel: false,
        },
        {
          name: "com hotel",
          price: 600,
          isRemote: false,
          includesHotel: true,
        },
      ],
    });

    const alltypes = await prisma.ticketType.findMany({});
    console.log({ alltypes });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
