import { describe, test, expect, it, vi } from "vitest"; // ✅ Use Vitest functions explicitly
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // <-- ADD THIS LINE
import userEvent from "@testing-library/user-event";
//import "testing-library/jest-dom/vitest";
import axios from "axios";
import App from "./App"; // ✅ Make sure the import path is correct
import Login from "./Login";
import Post from "./Post";
import { loginUser } from "./testUtils"; // Import the login function
import Creation from "./Creation";
import { within } from "@testing-library/react";

vi.mock("axios");

describe.skip("test1", async () => {
  // Mock user credentials
  it("displays the username in the welcome header after login");
  const mockUser = { username: "testUser" };
  // Mock axios response for login
  axios.post.mockResolvedValue({ data: { user: mockUser } });
  // Render the App component
  render(<App />);
  // Enter username and password
  fireEvent.change(screen.getByPlaceholderText("Username"), {
    target: { value: "a" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "ap" },
  });
  // Click login button
  fireEvent.click(screen.getByTestId("login_button"));
  // Wait for the welcome message to appear
  await waitFor(() => {
    expect(screen.getByTestId("welcome_header")).toHaveTextContent(
      `Welcome, ${mockUser.username}`
    );
  });
});

test("1. renders login button and calls login function", async () => {
  const mockHandleLogin = vi.fn();
  const mockSetLoginForm = vi.fn();
  const mockLoginForm = { username: "", password: "" };
  render(
    <Login
      loginForm={mockLoginForm}
      setLoginForm={mockSetLoginForm}
      handleLogin={mockHandleLogin}
    />
  );
  const loginButton = screen.getByTestId("login_button");
  expect(loginButton).toBeInTheDocument();
  await userEvent.click(loginButton);
  expect(mockHandleLogin).toHaveBeenCalled();
});
test("2. renders post with correct uploader", () => {
  const mockPost = {
    name: "Sample Post",
    parts: "Part1: 10, Part2: 20",
    price: 30,
    user_username: "testuser",
  };
  const mockUser = { username: "testuser" };
  render(<Post post={mockPost} user={mockUser} fetchPosts={vi.fn()} />);
  expect(screen.getByTestId("uploader")).toHaveTextContent(
    "Posted by: testuser"
  );
});
test("3. logging out removes welcome message", async () => {
  // Mock successful login response
  const mockUser = { username: "testUser" };
  axios.post.mockResolvedValue({ data: { user: mockUser } });
  render(<App />);
  await loginUser();
  // Ensure welcome message appears
  expect(await screen.findByTestId("welcome_header")).toHaveTextContent(
    "Welcome, testUser"
  );
  // Click the logout button
  await userEvent.click(screen.getByText("Logout"));
  // Ensure welcome message disappears
  expect(screen.queryByTestId("welcome_header")).not.toBeInTheDocument();
  // Ensure login screen is shown again
  expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
});
test("4. deleting a post removes it from the UI", async () => {
  const mockPost = {
    name: "Test_Post",
    parts: "Engine: 100",
    price: 100,
    user_username: "testUser",
  };
  const mockUser = { username: "testUser" };
  // Mock delete request
  axios.delete.mockResolvedValue({ status: 200 });
  render(<Post post={mockPost} user={mockUser} fetchPosts={vi.fn()} />);
  // Ensure post is displayed
  expect(screen.getByText("Test_Post")).toBeInTheDocument();
  // Click delete button
  await userEvent.click(screen.getByText("Delete"));
  // Expect axios.delete to be called with correct endpoint
  expect(axios.delete).toHaveBeenCalledWith(
    `http://localhost:5000/posts/Test_Post`
  );
});
test("5. logging out hides posts and shows login form", async () => {
  const mockUser = { username: "testUser" };
  axios.post.mockResolvedValue({ data: { user: mockUser } });
  axios.get.mockResolvedValue({
    data: [{ name: "Test Post", parts: "CPU, GPU", price: 100 }],
  });
  render(<App />);
  await loginUser();
  expect(await screen.findByTestId("welcome_header")).toHaveTextContent(
    "Welcome, testUser"
  );
  // Confirm that posts are displayed
  expect(await screen.findByText("Test Post")).toBeInTheDocument();
  // Click logout button
  await userEvent.click(screen.getByText("Logout"));
  // Ensure posts are hidden
  expect(screen.queryByText("Test Post")).not.toBeInTheDocument();
  // Ensure login form is shown again
  expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
});
test("6. total price updates when part prices are changed", async () => {
  const mockUser = { username: "testUser" };
  axios.post.mockResolvedValue({ data: { user: mockUser } });
  axios.get.mockResolvedValue({ data: [] });
  render(<App />);
  await loginUser();
  const priceInputs = screen.getAllByPlaceholderText("Price");
  // Change price values
  await userEvent.type(priceInputs[0], "50");
  await userEvent.type(priceInputs[1], "100");
  // Check that the total price updates correctly
  expect(await screen.findByText(/Total price: 150/i)).toBeInTheDocument();
});

test("7. creating a post with empty fields shows an alert", async () => {
  const mockUser = { username: "testUser" };
  // Mock login
  axios.post.mockResolvedValue({ data: { user: mockUser } });
  axios.get.mockResolvedValueOnce({ data: [] });
  render(<App />);
  await loginUser();
  // Simulate login
  expect(await screen.findByTestId("welcome_header")).toHaveTextContent(
    "Welcome, testUser"
  );
  // Try to submit an empty post
  window.alert = vi.fn(); // Mock alert
  await userEvent.click(screen.getByTestId("creation_button"));
  // Expect alert to be triggered
  expect(window.alert).toHaveBeenCalledWith(
    "Please fill out all fields before submitting."
  );
});

test("8. deleting a post removes it from the UI", async () => {
  render(<App />);
  const mockUser = { username: "testUser" };
  // Mock login and initial post
  axios.post.mockResolvedValue({ data: { user: mockUser } });
  axios.get
    .mockResolvedValueOnce({
      data: [
        {
          name: "Old_Post",
          parts: "CPU",
          price: 100,
          user_username: "testUser",
        },
      ],
    })
    .mockResolvedValueOnce({ data: [] }); // After deletion
  axios.delete.mockResolvedValue({ status: 200 });
  await loginUser();
  //create post
  const priceInputs = screen.getAllByPlaceholderText("Price");
  // Change price values
  await userEvent.type(priceInputs[0], "50");
  await userEvent.type(priceInputs[1], "100");
  const partsInputs = screen.getAllByPlaceholderText("Computer Part");
  await userEvent.type(partsInputs[0], "op1");
  await userEvent.type(partsInputs[1], "op2");
  await userEvent.type(screen.getByPlaceholderText("Post Name"), "Old_Post");
  await userEvent.click(screen.getByTestId("creation_button"));
  // Wait for post to load
  expect(await screen.findByText("Old_Post")).toBeInTheDocument();
  // Click delete button
  await userEvent.click(screen.getByTestId("delete_button"));
  // Wait for post to disappear
  await waitFor(() =>
    expect(screen.queryByText("Old_Post")).not.toBeInTheDocument()
  );
});

test("9. Creating a post shows the correct total price", async () => {
  render(<App />);
  const mockUser = { username: "testUser" };
  // Mock login and initial post
  axios.post.mockResolvedValue({ data: { user: mockUser } });
  axios.get
    .mockResolvedValueOnce({
      data: [
        {
          name: "A1",
          parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
          user_username: "testUser",
          id: 32,
          price: "15.00",
        },
      ],
    })
    .mockResolvedValueOnce({ data: [] }); // After deletion
  axios.delete.mockResolvedValue({ status: 200 });
  await loginUser();
  // Simulate login
  await waitFor(() => {
    expect(screen.getAllByTestId("total_price_post")[0]).toHaveTextContent(
      `Total price: 15.00`
    );
  });
});

test("10.Updating post updates the total price", async () => {
  render(<App />);

  const mockUser = { username: "testUser" };
  axios.post.mockResolvedValue({ data: { user: mockUser } });
  axios.get
    .mockResolvedValueOnce({
      data: [
        {
          name: "A1",
          parts: "Part: a11 Price: 5,Part: a12 Price: 7,Part: a13 Price: 3,",
          user_username: "testUser",
          id: 32,
          price: "15.00",
        },
      ],
    }) // Initial post
    .mockResolvedValueOnce({
      data: [
        {
          name: "A1",
          parts: "Part: a11 Price: 50,Part: a12 Price: 70,Part: a13 Price: 30",
          user_username: "testUser",
          id: 32,
          price: "150.00", // ✅ Updated price
        },
      ],
    }); // After update
  axios.put.mockResolvedValueOnce({
    data: [
      {
        name: "A1",
        parts: "Part: a11 Price: 50,Part: a12 Price: 70,Part: a13 Price: 30",
        user_username: "testUser",
        id: 32,
        price: "150.00", // ✅ Updated price
      },
    ],
  }); // Initial post
  await loginUser();
  //await userEvent.type(screen.getByPlaceholderText("Username"), "testUser");
  //await userEvent.type(screen.getByPlaceholderText("Password"), "testPass");
  //await userEvent.click(screen.getByTestId("login_button"));
  await userEvent.click(screen.getByTestId("update_button"));
  window.prompt = vi
    .fn()
    .mockReturnValue(
      "Part: a11 Price: 50,Part: a12 Price: 70,Part: a13 Price: 30"
    );
  await userEvent.click(screen.getByTestId("update_button")); // ✅ Click again to trigger update
  await waitFor(() => {
    screen.debug(); // ✅ Print UI after update
    expect(screen.getByTestId("total_price_post")).toHaveTextContent(
      "Total price: 150.00"
    );
  });
});
