const request = require("supertest");
const express = require("express");
const mysql = require("mysql2/promise");
const usersRouter = require("../routes/users");

jest.mock("mysql2/promise");

const app = express();
app.use(express.json()); // Ensure JSON body parsing
app.use("/users", usersRouter);

describe("USERS API", () => {
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
    it("should return all users", async () => {
      const mockPosts = [
        {
          username: "a",
          password: "ap",
        },
        {
          username: "b",
          password: "bp",
        },
        {
          username: "c",
          password: "cp",
        },
      ];

      mockConnection.execute.mockResolvedValue([mockPosts]);

      const response = await request(app).get("/users");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockPosts);
      expect(mockConnection.execute).toHaveBeenCalledWith("SELECT * FROM User");
    });
  });
});
