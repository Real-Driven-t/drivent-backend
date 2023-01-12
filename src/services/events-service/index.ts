import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import redisRepository from "@/repositories/redis-database-repository";
import dayjs from "dayjs";

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const eventCache = await redisRepository.getEvent();
  if (!eventCache) {
    const event = await eventRepository.findFirst();

    if (!event) throw notFoundError();
    await redisRepository.insertEvent(event);
    return exclude(event, "createdAt", "updatedAt");
  }
  const event: Event = JSON.parse(eventCache);
  return exclude(event, "createdAt", "updatedAt");
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
