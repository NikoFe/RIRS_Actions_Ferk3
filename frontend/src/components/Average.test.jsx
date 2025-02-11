import { describe, test, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "./App";
import { loginUser } from "./testUtils";

vi.mock("axios");

describe("price filter test", () => {
  it("filters posts correctly after login", async () => {
    // Mock API responses
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
          price: "20.50",
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
      expect(screen.getByTestId("user-average")).toHaveTextContent("35");
    });
  });

  ////////////////////////////////////////////////////////////////////////
});
