import { prisma } from "../../prisma/client";
import "jest";
import request from "supertest";

import app from "../app";

describe("POST /login", function () {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: 1,
        email: "me@mail.com",
        password:
          "$argon2i$v=19$m=4096,t=3,p=1$sfZb83hQPpnJv9KgwlZg/g$MYmPk4/0mJYasSJ95a/QrspDv5gXk+t5HAM6JBp//mc",
      },
    });
  });

  it("fails without credentials", function (done) {
    request(app).post("/login").send({}).expect(400).end(done);
  });

  it("fails without password", function (done) {
    request(app)
      .post("/login")
      .send({ email: "me@mail.com" })
      .expect(400)
      .end(done);
  });

  it("fails without email", function (done) {
    request(app)
      .post("/login")
      .send({ password: "secret" })
      .expect(400)
      .end(done);
  });

  it("fails with invalid password", function (done) {
    request(app)
      .post("/login")
      .send({ email: "me@mail.com", password: "other-secret" })
      .expect(401)
      .end(done);
  });

  it("fails with invalid email", function (done) {
    request(app)
      .post("/login")
      .send({ email: "other-me@mail.com", password: "secret" })
      .expect(401)
      .end(done);
  });

  it("succeeds with valid credentials", function (done) {
    request(app)
      .post("/login")
      .send({ email: "me@mail.com", password: "secret" })
      .set("Accept", "application/json")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        if (!("token" in res.body)) {
          throw new Error("missing token in response");
        }
      })
      .end(done);
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: 1 } });
  });
});

describe("POST /register", function () {
  it("fails without credentials", function (done) {
    request(app).post("/register").send({}).expect(400).end(done);
  });

  it("fails without password", function (done) {
    request(app)
      .post("/register")
      .send({ email: "me@mail.com" })
      .expect(400)
      .end(done);
  });

  it("fails without email", function (done) {
    request(app)
      .post("/register")
      .send({ password: "secret" })
      .expect(400)
      .end(done);
  });

  it("succeeds with valid credentials", function (done) {
    request(app)
      .post("/register")
      .send({ email: "me@mail.com", password: "secret" })
      .set("Accept", "application/json")
      .expect(201)
      .expect("Content-Type", /json/)
      .then(async (res) => {
        const user = await prisma.user.findUnique({
          where: { email: res.body.email },
        });

        if (user == null) {
          throw new Error(
            "failed to retrieve registered user from the database"
          );
        }
      })
      .finally(done);
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { email: "me@mail.com" } });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
