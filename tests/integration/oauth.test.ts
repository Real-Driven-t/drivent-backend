import app, { init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEvent } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /oauth/github/login", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/oauth/github/login");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/oauth/github/login").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    it("should respond with status 400 when there is no event", async () => {
      const body = "objeto com code aqui";

      const response = await server.post("/oauth/github/login").send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when current event did not started yet", async () => {
      const event = await createEvent({ startsAt: dayjs().add(1, "day").toDate() });
      const body = "objeto com code aqui";

      const response = await server.post("/oauth/github/login").send(body).query({ eventId: event.id });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when event started", () => {
      beforeAll(async () => {
        await prisma.event.deleteMany({});
        await createEvent();
      });

      it("should not return user password on body", async () => {
        const body = {
          code: faker.lorem.word(),
        };

        const response = await server.post("/oauth/github/login").send(body);

        expect(response.body).not.toHaveProperty("password");
      });
    });
  });
});
