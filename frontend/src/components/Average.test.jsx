import { describe, test, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "./App";
import { loginUser } from "./testUtils";

vi.mock("axios");

describe("price filter test", () => {
  it("calculate average after multiple posts", async () => {
    const mockUser = { username: "testUser" };
    axios.post.mockResolvedValue({ data: { user: mockUser } });
    axios.get.mockResolvedValue({
      data: [
        {
          name: "A1",
          parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
          user_username: "testUser",
          id: 32,
          price: "15.00",
        },
        {
          name: "A2",
          parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 8,",
          user_username: "testUser",
          id: 33,
          price: "20.00",
        },
      ],
    });

    render(<App />);

    await loginUser();

    await userEvent.type(screen.getByTestId("selectedUser"), "testUser");

    await waitFor(() => {
      expect(screen.getByTestId("user-average")).toHaveTextContent("17.5");
    });
  });

  ////////////////////////////////////////////////////////////////////////
  it("filters posts correctly after login", async () => {
    const mockUser = { username: "testUser" };
    axios.post.mockResolvedValue({ data: { user: mockUser } });
    axios.get.mockResolvedValue({
      data: [
        {
          name: "A1",
          parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
          user_username: "testUser",
          id: 32,
          price: "15.00",
        },
        {
          name: "A2",
          parts: "Part: a11 Price: 2,Part: a12 Price: 2,Part: a13 Price: 1,",
          user_username: "testUser",
          id: 33,
          price: "5.00",
        },
        {
          name: "B1",
          parts: "Part: a11 Price: 2,Part: a12 Price: 2,Part: a13 Price: 1,",
          user_username: "b",
          id: 34,
          price: "5.00",
        },
        {
          name: "B2",
          parts: "Part: a11 Price: 3,Part: a12 Price: 3,Part: a13 Price: 1,",
          user_username: "b",
          id: 35,
          price: "7.00",
        },
      ],
    });

    // Render the app
    render(<App />);

    // Wait for login to complete
    await loginUser();

    // Enter a filter value
    await userEvent.type(screen.getByTestId("selectedUser"), "testUser");
    // Click the filter button

    await waitFor(() => {
      expect(screen.getByTestId("user-average")).toHaveTextContent("10");
    });
  });

  /////////////////////////////////////////////////////////////////////////////////////
  /*
  it("deletes a post and checks if it was removed from the app", async () => {
    render(<App />);
    const mockUser = { username: "testUser" };

    axios.post.mockResolvedValue({ data: { user: mockUser } });

    // Mock initial GET request (fetching existing posts)
    axios.get.mockResolvedValueOnce({
      data: [
        {
          name: "A1",
          parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
          user_username: "testUser",
          id: 32,
          price: "15.00",
        },
        {
          name: "A2",
          parts: "Part: a11 Price: 2,Part: a12 Price: 2,Part: a13 Price: 1,",
          user_username: "testUser",
          id: 33,
          price: "5.00",
        },
        {
          name: "A3",
          parts: "Part: a11 Price: 8,Part: a12 Price: 15,Part: a13 Price: 5,",
          user_username: "testUser",
          id: 3,
          price: "28.00",
        },
      ],
    });

    // Mock DELETE request
    axios.delete.mockResolvedValue({ status: 200 });

    // Mock second GET request (fetching posts after deletion)

    await loginUser();

    // Ensure post appears first
    await waitFor(() => {
      expect(screen.getByText("A1")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByTestId("selectedUser"), "testUser");
    // Click the filter button

    await waitFor(() => {
      expect(screen.getByTestId("user-average")).toHaveTextContent("16");
    });

    await userEvent.click(screen.getAllByTestId("delete_button")[2]);

    //screen.debug();

    // Wait for post to disappear
    await waitFor(() => {
      expect(screen.queryByText("A1")).toBeInTheDocument();
      expect(screen.queryByText("A2")).toBeInTheDocument();
      expect(screen.queryByText("A3")).not.toBeInTheDocument();
    });

    // await userEvent.type(screen.getByTestId("selectedUser"), "testUser");

    // Mock GET request after deletion
    axios.get.mockResolvedValueOnce({
      data: [
        {
          name: "A1",
          parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
          user_username: "testUser",
          id: 32,
          price: "15.00",
        },
        {
          name: "A2",
          parts: "Part: a11 Price: 2,Part: a12 Price: 2,Part: a13 Price: 1,",
          user_username: "testUser",
          id: 33,
          price: "5.00",
        },
      ],
    });

    await waitFor(() => {
      expect(screen.getByTestId("user-average")).toHaveTextContent("10");
    });
  });*/
});

describe("price filter test", () => {
  it("average for invalid input", async () => {
    const mockUser = { username: "testUser" };
    axios.post.mockResolvedValue({ data: { user: mockUser } });
    axios.get.mockResolvedValue({
      data: [
        {
          name: "A1",
          parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
          user_username: "testUser",
          id: 32,
          price: "15.00",
        },
        {
          name: "A2",
          parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 8,",
          user_username: "testUser",
          id: 33,
          price: "20.00",
        },
      ],
    });

    render(<App />);

    await loginUser();

    await userEvent.type(screen.getByTestId("selectedUser"), "x");

    await waitFor(() => {
      expect(screen.getByTestId("user-average")).toHaveTextContent("0");
      expect(screen.getByText("Error user not found")).toBeInTheDocument();
    });
  });
});
