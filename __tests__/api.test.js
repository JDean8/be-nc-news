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

describe("GET /api/articles/:article_id", () => {
  test("Returns article object on key of article and status 200", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: 11,
          })
        );
      });
  });
  test("Returns a 404 error and a helpful messsage when user tries to get article that doesn't exist", () => {
    return request(app)
      .get("/api/articles/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found with that ID");
      });
  });
  test("Returns a 400 error and a helpful messsage when user tries to use a non-integer as article_id", () => {
    return request(app)
      .get("/api/articles/SPACE")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid type");
      });
  });
});

describe("GET /api/articles", () => {
  test("Should return an array of article object", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article.body).toBe(undefined);
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Articles should default to be sorted by age in desc order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Articles should be sorted to asc when passed order query asc", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("Articles should be sorted to by column specified in query", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("comment_count", { descending: true });
      });
  });
  test("Should return only articles with a matching topic when supplied as a query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "cats",
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Should return a 200 and empty array on articles when user looks for a topic that has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(0);
      });
  });
  test("Should return a 404 and helpful message when a user attempts to filter by topic that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=SPACCCEEEE")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No such topic exists");
      });
  });
  test("Should return a 400 and helpful message when a user attempts to order by anything other than asc or desc", () => {
    return request(app)
      .get("/api/articles?order=spaceeee")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Order must be asc or desc");
      });
  });
  test("Should return a 400 and helpful message when a user attempts to sort_by by anything other than a column name", () => {
    return request(app)
      .get("/api/articles?sort_by=spaceeee")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Sort_by must be a vaild column name");
      });
  });
  test("Additional incorrect queries should not effect the return value", () => {
    return request(app)
      .get("/api/articles?topic=cats&tim_curyy=SPACCCCEEEEEE")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article.body).toBe(undefined);
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Returns an array of comments under the key of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("Should be sorted by created at desc", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Should return a 200 and an empty array when clients tries to get comments for article that has none", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("Should return a 404 and helpful message when clients tries to get comments for article that does not exist", () => {
    return request(app)
      .get("/api/articles/150000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found with that ID");
      });
  });
  test("Should return a 400 and helpful message when clients tries to get comments with an article_id of an incompatible type", () => {
    return request(app)
      .get("/api/articles/SPAAAAACCCCE/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid type");
      });
  });
});

describe("GET /api/users", () => {
  test("Should return an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("Should return a user object on key user", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user.username).toBe("butter_bridge");
        expect(user.name).toBe("jonny");
        expect(user.avatar_url).toBe(
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
      });
  });
  test("Should return a 404 and helpful message when user name does not exist", () => {
    return request(app)
      .get("/api/users/alter_bridge")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No such user found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Should return 200 and article with updated vote count when called with inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 101,
            article_img_url: expect.any(String),
          })
        );
      });
  });
  test("Should return 200 and article with updated vote count when called with inc_votes (negative number)", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -2 })
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.votes).toBe(98);
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });
  test("Should return 200 and article with updated vote count disregarding unecessary properties ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -2, amINeeded: false })
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.votes).toBe(98);
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });
  test("Should return a 404 and helpful message when clients tries to patch article that does not exist", () => {
    return request(app)
      .patch("/api/articles/150000/")
      .send({ inc_votes: 2 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found with that ID");
      });
  });
  test("Should return a 400 and helpful message when clients tries to patch article with invalid article_id", () => {
    return request(app)
      .patch("/api/articles/SPPPPAACCCE/")
      .send({ inc_votes: 2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid type");
      });
  });
  test("Should return a 400 and helpful message when client does not include inc_votes", () => {
    return request(app)
      .patch("/api/articles/1/")
      .send({ vote: 2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("request must include inc_votes");
      });
  });
  test("Should return a 400 and helpful message when clients tries to patch article with invalid figure for inc_votes", () => {
    return request(app)
      .patch("/api/articles/1/")
      .send({ inc_votes: "SPACE" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid type");
      });
  });
});

describe("POST /api/articles", () => {
  test("Returns 201 and new article details", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        topic: "cats",
        body: "not as good as dogs but fine",
        title: "What are they?",
      })
      .expect(201)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            topic: "cats",
            body: "not as good as dogs but fine",
            title: "What are they?",
            article_img_url:
              "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
            votes: 0,
            comment_count: 0,
            created_at: expect.any(String),
            article_id: expect.any(Number),
          })
        );
      });
  });
  test("Returns 201 and new article details (allows URL to be set manually)", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        topic: "cats",
        body: "not as good as dogs but fine",
        title: "What are they?",
        article_img_url:
          "https://images.unsplash.com/photo-1537123547273-e59f4f437f1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      })
      .expect(201)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            topic: "cats",
            body: "not as good as dogs but fine",
            title: "What are they?",
            article_img_url:
              "https://images.unsplash.com/photo-1537123547273-e59f4f437f1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
            votes: 0,
            comment_count: 0,
            created_at: expect.any(String),
            article_id: expect.any(Number),
          })
        );
      });
  });
  test("Returns 404 and helpful message when provided with topic that does not exist", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "C+C",
        topic: "SPPPACCCCEEE",
        body: "Tim Curry nailed this role",
        title: "Chewing scenery",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No such topic exists");
      });
  });
  test("Returns 404 and helpful message when provided with author that does not exist", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "tim_curry",
        topic: "cats",
        body: "not as good as dogs but fine",
        title: "What are they?",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No author listed with that username");
      });
  });
  test("Returns 400 and helpful message when provided when missing fields", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        topic: "cats",
        title: "What are they?",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required field");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Returns 201 and the comment when a comment is successfully added", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
        body: "Usually don't comment",
      })
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment.author).toBe("lurker");
        expect(comment.body).toBe("Usually don't comment");
        expect(comment.votes).toBe(0);
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            article_id: expect.any(Number),
          })
        );
      });
  });
  test("Returns 201 and the comment when a comment is successfully added (ignoring redundant properties", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
        body: "Usually don't comment",
        isRedundantProperty: true,
      })
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment.isRedundantProperty).toBe(undefined);
        expect(comment.author).toBe("lurker");
        expect(comment.body).toBe("Usually don't comment");
        expect(comment.votes).toBe(0);
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            article_id: expect.any(Number),
          })
        );
      });
  });
  test("Should return a 404 and helpful message when clients tries to post comment for article that does not exist", () => {
    return request(app)
      .post("/api/articles/15000/comments")
      .send({
        username: "lurker",
        body: "Usually don't comment",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found with that ID");
      });
  });
  test("Should return a 400 and helpful message when clients tries to post comment for invalid article_id", () => {
    return request(app)
      .post("/api/articles/SPACE/comments")
      .send({
        username: "lurker",
        body: "Usually don't comment",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid type");
      });
  });
  test("Should return a 404 and helpful message when clients tries to post comment for article with username that hasn't been created", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "not_a_username",
        body: "Valid comment",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not recognised");
      });
  });
  test("Should return a 400 and helpful message when clients tries to post comment for article with missing fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required field");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("User is sent 204 with no content when successful", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("Returns 404 and helpful message when user tried to delete a comment that does not exist", () => {
    return request(app)
      .delete("/api/comments/15000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment found with that ID");
      });
  });
  test("Returns 400 and helpful message when user tried to delete a comment with an invalid ID", () => {
    return request(app)
      .delete("/api/comments/SPACE")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid type");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("User is sent 204 with no content when successful", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            votes: 17,
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          })
        );
      });
  });
  test("Returns 404 and helpful message when user tried to update a comment that does not exist", () => {
    return request(app)
      .patch("/api/comments/15000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment found with that ID");
      });
  });
  test("Returns 400 and helpful message when user does not provide inc_votes", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ vote: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("request must include inc_votes");
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
