const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const apiDocs = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("Should return array of objects on key topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api", () => {
  test("Shoudld return object with key endpoints that has an object as a value", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toBeObject();
      });
  });
  test("Ensure that each endpoint has the minimum of atleast a description", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpoints = body.endpoints;
        for (const endpoint in endpoints) {
          expect(endpoints[endpoint]).toEqual(
            expect.objectContaining({
              description: expect.any(String),
            })
          );
        }
      });
  });
  test("Should return value equivilent to the current endpoints.json file", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(apiDocs);
      });
  });
});

describe("Unknow endpoint", () => {
  test("Returns 404 and informative message when request made to unhandled endpoint", () => {
    return request(app)
      .get("/api/geppetto")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No such endpoint found");
      });
  });
});
