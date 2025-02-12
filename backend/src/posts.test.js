const request = require("supertest");
const express = require("express");
const postsRouter = require("../routes/posts");
const mysql = require("mysql2/promise");

jest.mock("mysql2/promise");

const app = express();
app.use(express.json()); // Ensure JSON body parsing
app.use("/posts", postsRouter);

describe("POSTS API", () => {
  let mockConnection;

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn(),
      end: jest.fn(),
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /posts", () => {
    it("should return all posts", async () => {
      const mockPosts = [
        {
          name: "A1",
          parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
          user_username: "a",
          id: 32,
          price: "15.00",
        },
        {
          name: "A2",
          parts:
            "Part: a21 Price: 4,Part: a22 Price: 3,Part: 1312435 Price: 4.5,",
          user_username: "a",
          id: 33,
          price: "11.50",
        },
        {
          name: "B1",
          parts:
            "Part: b1 Price: 67,Part: b2 Price: 44,Part: bbbbb Price: 132,",
          user_username: "b",
          id: 35,
          price: "243.00",
        },
      ];

      mockConnection.execute.mockResolvedValue([mockPosts]);

      const response = await request(app).get("/posts");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockPosts);
      expect(mockConnection.execute).toHaveBeenCalledWith("SELECT * FROM Post");
    });
  });
  //////////////////////////////////////////////////////////////////////////

  describe("POST /posts", () => {
    it("should create a new post", async () => {
      const newData = {
        name: "A5",
        parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
        user_username: "a",
        price: "100.00",
      };

      mockConnection.execute.mockResolvedValue([{ affectedRows: 1 }]);

      const response = await request(app).post("/posts").send(newData);

      expect(response.statusCode).toBe(201);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        "INSERT INTO Post (name, parts, user_username, price) VALUES (?, ?, ?, ?)",
        [newData.name, newData.parts, newData.user_username, newData.price]
      );
    });

    it("should return 400 if request body is invalid", async () => {
      const invalidPost = { name: "Invalid Post" }; // Missing required fields

      const response = await request(app).post("/posts").send(invalidPost);

      expect(response.statusCode).toBe(400);
    });
  });

  ////////////////////////////////////////////////////////////////////////////////

  describe("GET /posts?name", () => {
    it("should return the post with the specified name", async () => {
      const mockPosts = [
        {
          name: "A1",
          parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
          user_username: "a",
          id: 32,
          price: "15.00",
        },
      ];

      mockConnection.execute.mockResolvedValue([mockPosts]);

      const postName = "A1"; // Name of the post to delete

      const response = await request(app).get(`/posts/${postName}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockPosts);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        "SELECT * FROM Post WHERE name = ?",
        [postName]
      );
    });
  });

  ///////////////////////////////////////////7

  describe("POST /delete", () => {
    it("should delete a specific post", async () => {
      mockConnection.execute.mockResolvedValue([{ affectedRows: 1 }]);

      const postName = "SamplePost"; // Name of the post to delete

      const response = await request(app).delete(`/posts/${postName}`);

      expect(response.statusCode).toBe(200);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        "DELETE FROM Post WHERE name = ?",
        [postName] // Correctly passing the hardcoded name
      );
    });

    it("should return 404 if post is not found", async () => {
      mockConnection.execute.mockResolvedValue([{ affectedRows: 0 }]); // Simulate no rows deleted

      const postName = "NonExistentPost";

      const response = await request(app).delete(`/posts/${postName}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ error: "Post not found" });
    });
  });
  ////////////////////////////////////////////////////////////////////////////////

  describe("POST /updated", () => {
    it("should update a specific post", async () => {
      const newData = {
        parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
        price: "100.00",
      };

      mockConnection.execute.mockResolvedValue([{ affectedRows: 1 }]);

      const postName = "SamplePost"; // Name of the post to delete

      const response = await request(app)
        .put(`/posts/${postName}`)
        .send(newData);

      expect(response.statusCode).toBe(200);
      expect(mockConnection.execute).toHaveBeenCalledWith(
        "UPDATE Post SET parts = ?, price=? WHERE name = ?",
        [newData.parts, newData.price]
      );
    });

    it("should return 404", async () => {
      const newData = {
        parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
        price: "100.00",
      };

      mockConnection.execute.mockResolvedValue([{ affectedRows: 0 }]); // Simulate no rows deleted

      const postName = "NonExistentPost";

      const response = await request(app).put(`/posts/${postName}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ error: "Post not found" });
    });
  });
});
