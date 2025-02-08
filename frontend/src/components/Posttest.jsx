import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { vi } from "vitest";
import Post from "./Post";

vi.mock("axios");

describe("Post Component Tests", () => {
  beforeEach(async () => {
    axios.post.mockResolvedValue({ data: { token: "mock-token" } });
    axios.get.mockResolvedValue({
      data: [
        { id: 1, creator: "user1", content: "Post by user1" },
        { id: 2, creator: "user2", content: "Post by user2" },
        { id: 3, creator: "user1", content: "Another post by user1" },
      ],
    });

    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Post 1",
          parts: "Details 1",
          user_username: "a",
          price: 10.99,
        },
        {
          id: 2,
          name: "Post 2",
          parts: "Details 2",
          user_username: "a",
          price: 15.5,
        },
        {
          id: 3,
          name: "Post 3",
          parts: "Details 3",
          user_username: "a",
          price: 20.0,
        },
      ],
    });

    render(
      <Post key={post.name} post={post} user={"user"} fetchPosts={fetchPosts} />
    );

    // Fill in login form
    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByTestId("login_button"));

    // Wait for posts to load
    await waitFor(() => {
      const postDivs = screen.queryAllByTestId("Post-div");
      expect(postDivs.length).toBe(3); // Ensure 3 posts are rendered
    });
  });

  test("user a", async () => {
    const postDivs = screen.getAllByTestId("Post-div");

    // Filter posts where uploader contains 'user1'
    const user1Posts = postDivs.filter((div) => {
      const uploader = div.querySelector("[data-testid='uploader']");
      return uploader && uploader.textContent.includes("a");
    });

    // Check each post has the buttons
    expect(userPosts.length).toBe(3);

    user1Posts.forEach((post) => {
      expect(post).toHaveTextContent("Update");
      expect(post).toHaveTextContent("Delete");
    });
  });
});
