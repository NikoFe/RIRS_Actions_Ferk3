import { describe, test, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "./App";
import { loginUser } from "./testUtils";

vi.mock("axios");

describe.skip("price filter test", () => {
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
      ],
    });

    // Render the app
    render(<App />);

    // Wait for login to complete
    await loginUser();

    await waitFor(() =>
      expect(screen.getByTestId("filtered_input")).toBeInTheDocument()
    );

    // Enter a filter value
    await userEvent.type(screen.getByTestId("filtered_input"), "0");

    // Click the filter button
    await userEvent.click(screen.getByTestId("filter-button"));

    // Check if the filtered result is displayed
    const totalPriceElement = await screen.findByText("Total price: 15.00");
    expect(totalPriceElement).toBeInTheDocument();
  });

  ////////////////////////////////////////////////////////////////////////
  it("hides posts correctly after filtering", async () => {
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
          parts: "Part: a11 Price: 5,Part: a12 Price: 15,Part: a13 Price: 223,",
          user_username: "testUser",
          id: 33,
          price: "243.00",
        },
      ],
    });

    // Render the app
    render(<App />);

    // Wait for login to complete
    await loginUser();

    // Wait for the input field to appear
    await waitFor(() =>
      expect(screen.getByTestId("filtered_input")).toBeInTheDocument()
    );

    // Enter a filter value
    await userEvent.type(screen.getByTestId("filtered_input"), "200");

    // Click the filter button

    await userEvent.click(screen.getByTestId("filter-button"));
    // Check if the filtered result is displayed
    const totalPriceElement = await screen.queryByText("Total price: 15.00");
    expect(totalPriceElement).not.toBeInTheDocument();
    const totalPriceElement2 = await screen.queryByText("Total price: 243.00");
    expect(totalPriceElement2).toBeInTheDocument();
  });
  it("invalid price value", async () => {
    // Mock API responses
    const mockUser = { username: "a" };
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
      ],
    });

    // Render the app
    render(<App />);

    // Wait for login to complete
    await loginUser();

    await waitFor(() =>
      expect(screen.getByTestId("filtered_input")).toBeInTheDocument()
    );

    // Enter a filter value
    await userEvent.type(screen.getByTestId("filtered_input"), "lorem_ipsum");

    // Click the filter button
    await userEvent.click(screen.getByTestId("filter-button"));

    // Check if the filtered result is displayed
    const totalPriceElement = await screen.findByText("Total price: 15.00");
    expect(totalPriceElement).toBeInTheDocument();
  });
});

describe.skip("user filter test", () => {
  it("filters posts correctly after login", async () => {
    // Mock API responses
    const mockUser = { username: "b" };
    axios.post.mockResolvedValue({ data: { user: mockUser } });
    axios.get.mockResolvedValue({
      data: [
        {
          name: "A1",
          parts: "Part: a11 Price: 1,Part: a12 Price: 1,Part: a13 Price: 1,",
          user_username: "a",
          id: 32,
          price: "3.00",
        },
        {
          name: "B1",
          parts: "Part: a11 Price: 1,Part: a12 Price: 1,Part: a13 Price: 2,",
          user_username: "b",
          id: 33,
          price: "4.00",
        },
      ],
    });

    // Render the app
    render(<App />);

    // Wait for login to complete
    await loginUser();

    await waitFor(() =>
      expect(screen.getByTestId("filtered_user_input")).toBeInTheDocument()
    );

    // Enter a filter value
    await userEvent.type(screen.getByTestId("filtered_user_input"), "b");

    // Click the filter button
    await userEvent.click(screen.getByTestId("filter-user-button"));

    // Check if the filtered result is displayed
    const result1 = await screen.queryByText("Total price: 3.00");
    const result2 = await screen.queryByText("Total price: 4.00");
    expect(result1).not.toBeInTheDocument();
    expect(result2).toBeInTheDocument();
  });

  ////////////////////////////////////////////////////////////////////////
});

describe.skip("combined filter test", () => {
  it("filters posts correctly after login", async () => {
    // Mock API responses
    const mockUser = { username: "b" };
    axios.post.mockResolvedValue({ data: { user: mockUser } });
    axios.get.mockResolvedValue({
      data: [
        {
          name: "A1",
          parts: "Part: a11 Price: 1,Part: a12 Price: 1,Part: a13 Price: 1,",
          user_username: "a",
          id: 32,
          price: "3.00",
        },
        {
          name: "A2",
          parts: "Part: a11 Price: 1,Part: a12 Price: 1,Part: a13 Price: 8,",
          user_username: "a",
          id: 33,
          price: "10.00",
        },
        {
          name: "B1",
          parts: "Part: a11 Price: 1,Part: a12 Price: 1,Part: a13 Price: 2,",
          user_username: "b",
          id: 34,
          price: "4.00",
        },
        {
          name: "B2",
          parts: "Part: a11 Price: 1,Part: a12 Price: 1,Part: a13 Price: 8,",
          user_username: "b",
          id: 35,
          price: "15.00",
        },
      ],
    });

    // Render the app
    render(<App />);

    // Wait for login to complete
    await loginUser();

    await waitFor(() =>
      expect(screen.getByTestId("filtered_user_input")).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByTestId("filtered_input")).toBeInTheDocument()
    );

    // Enter a filter value

    // Enter a filter value
    await userEvent.type(screen.getByTestId("filtered_user_input"), "b");

    // Click the filter button
    await userEvent.click(screen.getByTestId("filter-user-button"));

    await userEvent.type(screen.getByTestId("filtered_input"), "8");

    await userEvent.click(screen.getByTestId("filter-button"));

    // Check if the filtered result is displayed
    const result1 = await screen.queryByText("Total price: 3.00");
    const result2 = await screen.queryByText("Total price: 10.00");
    const result3 = await screen.queryByText("Total price: 4.00");
    const result4 = await screen.queryByText("Total price: 15.00");

    expect(result1).not.toBeInTheDocument();
    expect(result2).not.toBeInTheDocument();
    expect(result3).not.toBeInTheDocument();
    expect(result4).toBeInTheDocument();
  });

  ////////////////////////////////////////////////////////////////////////
});
