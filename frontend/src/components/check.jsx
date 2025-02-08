import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { vi } from "vitest";
import App from "../App";

vi.mock("axios");

describe("Post Component Tests", () => {
  beforeEach(async () => {
    axios.post.mockResolvedValue({ data: { token: "mock-token" } });

    // Mock API response to simulate 3 posts by user "a"
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

    render(<App />);

    // Fill in login form
    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "a" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText(/login/i));

    // Wait for posts to load
    await waitFor(() => {
      const postDivs = screen.queryAllByTestId("Post-div");
      expect(postDivs.length).toBe(3); // Ensure 3 posts are rendered
    });
  });

  test("User 'a' sees update and delete buttons on their posts", async () => {
    const postDivs = screen.queryAllByTestId("Post-div");

    // Filter posts where uploader contains 'a'
    const userPosts = postDivs.filter((div) => {
      const uploader = div.querySelector("[data-testid='uploader']");
      return uploader && uploader.textContent.includes("a");
    });

    // Ensure exactly 3 posts match user "a"
    expect(userPosts.length).toBe(3);

    // Check each post has the buttons
    userPosts.forEach((post) => {
      expect(post).toHaveTextContent("Update");
      expect(post).toHaveTextContent("Delete");
    });
  });
});
