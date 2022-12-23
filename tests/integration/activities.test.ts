import { prisma } from "@/config";
import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createPayment,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createPlace,
  createActivity,
  createTicketType,
  createActivityBooking,
  createActivityWithDayAndStartFixed,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /activities", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 for invalid day in params", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      await createTicketType();

      const response = await server.get("/activities/111").set("Authorization", `Bearer ${token}`).send({});

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when user doesnt have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      const response = await server.get(`/activities/${date}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      const response = await server.get(`/activities/${date}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      await createTicketTypeRemote();

      const response = await server.get(`/activities/${date}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and a list of activities with local", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      const place = await createPlace();
      const activity = await createActivity(place.id);

      const response = await server.get(`/activities/${date}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: place.id,
          name: place.name,
          updatedAt: place.updatedAt.toISOString(),
          createdAt: place.createdAt.toISOString(),
          Activity: [
            {
              id: activity.id,
              name: activity.name,
              day: activity.day.toISOString(),
              capacity: activity.capacity,
              start: activity.start.toISOString(),
              duration: activity.duration.toISOString(),
              placeId: activity.placeId,
              createdAt: activity.createdAt.toISOString(),
              updatedAt: activity.updatedAt.toISOString(),
            },
          ],
        },
      ]);
    });

    it("should respond with status 200 and place data an empty activities array", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      const place = await createPlace();

      const response = await server.get(`/activities/${date}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: place.id,
          name: place.name,
          updatedAt: place.updatedAt.toISOString(),
          createdAt: place.createdAt.toISOString(),
          Activity: [],
        },
      ]);
    });
  });
});

describe("POST /activities", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/activities");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/activities").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/activities").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 201 and id of booking activity", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const place = await createPlace();
      const activity = await createActivity(place.id);

      const response = await server
        .post("/activities")
        .set("Authorization", `Bearer ${token}`)
        .send({ activityId: activity.id });

      const activityBooking = await prisma.activityBooking.findFirst({});

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        activityBookingId: activityBooking.id,
      });
    });

    it("should respond with status 404 when activity do not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const place = await createPlace();
      const activity = await createActivity(place.id);

      const response = await server
        .post("/activities")
        .set("Authorization", `Bearer ${token}`)
        .send({ activityId: activity.id + 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user do not have enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeWithHotel();
      const place = await createPlace();
      const activity = await createActivity(place.id);

      const response = await server
        .post("/activities")
        .set("Authorization", `Bearer ${token}`)
        .send({ activityId: activity.id });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 400 when user have a ticketas 'RESERVED'", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const place = await createPlace();
      const activity = await createActivity(place.id);

      const response = await server
        .post("/activities")
        .set("Authorization", `Bearer ${token}`)
        .send({ activityId: activity.id });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 409 when user tries to register to activities with the same horary and day", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const place = await createPlace();
      const activityOne = await createActivityWithDayAndStartFixed(place.id);
      const activitytwo = await createActivityWithDayAndStartFixed(place.id);
      await createActivityBooking(user.id, activityOne.id);

      const response = await server
        .post("/activities")
        .set("Authorization", `Bearer ${token}`)
        .send({ activityId: activitytwo.id });

      expect(response.status).toBe(httpStatus.CONFLICT);
    });
  });
});
