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

describe.skip("App Tests", () => {
  it("displays the username in the welcome header after login", async () => {
    const mockUser = { username: "testUser" };
    axios.post.mockResolvedValue({ data: { user: mockUser } });

    render(<App />);

    const mockHandleLogin = vi.fn();
    const mockSetLoginForm = vi.fn();
    const mockLoginForm = { username: "", password: "" };

    fireEvent.change(screen.getByTestId("login_username2"), {
      target: { value: "a" },
    });
    fireEvent.change(screen.getByTestId("login_password2"), {
      target: { value: "ap" },
    });

    fireEvent.click(screen.getByTestId("login_button"));
    //screen.debug();

    await waitFor(() => {
      expect(screen.getByTestId("welcome_header")).toHaveTextContent(
        `Welcome, ${mockUser.username}`
      );
    });
  });

  it("renders login button and calls login function", async () => {
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

  it("renders post with correct uploader", () => {
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

  it("logs out and removes welcome message", async () => {
    const mockUser = { username: "testUser" };
    axios.post.mockResolvedValue({ data: { user: mockUser } });

    render(<App />);
    await loginUser();

    expect(await screen.findByTestId("welcome_header")).toHaveTextContent(
      "Welcome, testUser"
    );

    await userEvent.click(screen.getByText("Logout"));

    expect(screen.queryByTestId("welcome_header")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("deleting a post removes it from the UI", async () => {
    const mockPost = {
      name: "Test_Post",
      parts: "Engine: 100",
      price: 100,
      user_username: "testUser",
    };
    const mockUser = { username: "testUser" };

    axios.delete.mockResolvedValue({ status: 200 });

    render(<Post post={mockPost} user={mockUser} fetchPosts={vi.fn()} />);

    expect(screen.getByText("Test_Post")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Delete"));

    expect(axios.delete).toHaveBeenCalledWith(
      `http://localhost:5000/posts/Test_Post`
    );
  });

  it("logs out and hides posts, showing login form", async () => {
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

    expect(await screen.findByText("Test Post")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Logout"));

    expect(screen.queryByText("Test Post")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("updates total price when part prices change", async () => {
    const mockUser = { username: "testUser" };
    axios.post.mockResolvedValue({ data: { user: mockUser } });
    axios.get.mockResolvedValue({ data: [] });

    render(<App />);
    await loginUser();

    const priceInputs = screen.getAllByPlaceholderText("Price");

    await userEvent.type(priceInputs[0], "50");
    await userEvent.type(priceInputs[1], "100");

    expect(await screen.findByText(/Total price: 150/i)).toBeInTheDocument();
  });

  it("shows an alert when creating a post with empty fields", async () => {
    const mockUser = { username: "testUser" };

    axios.post.mockResolvedValue({ data: { user: mockUser } });
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<App />);
    await loginUser();

    expect(await screen.findByTestId("welcome_header")).toHaveTextContent(
      "Welcome, testUser"
    );

    window.alert = vi.fn();

    await userEvent.click(screen.getByTestId("creation_button"));

    expect(window.alert).toHaveBeenCalledWith(
      "Please fill out all fields before submitting."
    );
  });

  it("removes deleted posts from UI", async () => {
    render(<App />);
    const mockUser = { username: "testUser" };

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
      .mockResolvedValueOnce({ data: [] });

    axios.delete.mockResolvedValue({ status: 200 });

    await loginUser();

    await userEvent.type(screen.getByPlaceholderText("Post Name"), "Old_Post");
    await userEvent.click(screen.getByTestId("creation_button"));

    expect(await screen.findByText("Old_Post")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("delete_button"));

    await waitFor(() =>
      expect(screen.queryByText("Old_Post")).not.toBeInTheDocument()
    );
  });

  it("updates the total price when a post is updated", async () => {
    render(<App />);
    const mockUser = { username: "testUser" };

    axios.post.mockResolvedValue({ data: { user: mockUser } });

    // Mock first GET request (initial data)
    axios.get.mockResolvedValueOnce({
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

    // Mock PUT request for updating data
    axios.put.mockResolvedValue({
      data: {
        name: "A1",
        parts: "Part: a11 Price: 50,Part: a12 Price: 70,Part: a13 Price: 30",
        user_username: "testUser",
        id: 32,
        price: "150.00",
      },
    });

    // Mock second GET request (fetching updated data)
    axios.get.mockResolvedValueOnce({
      data: [
        {
          name: "A1",
          parts: "Part: a11 Price: 50,Part: a12 Price: 70,Part: a13 Price: 30",
          user_username: "testUser",
          id: 32,
          price: "150.00",
        },
      ],
    });

    await loginUser();

    // Mock prompt BEFORE clicking the update button
    window.prompt = vi
      .fn()
      .mockReturnValue(
        "Part: a11 Price: 50,Part: a12 Price: 70,Part: a13 Price: 30"
      );

    // Click the update button (which triggers the prompt)
    await userEvent.click(screen.getByTestId("update_button"));

    // Manually trigger the function that handles the prompt result
    await waitFor(() => {
      expect(window.prompt).toHaveBeenCalled();
    });

    // Wait for the UI to update after the change
    await waitFor(() => {
      expect(screen.getByTestId("total_price_post")).toHaveTextContent(
        "Total price: 150.00"
      );
    });
  });
});
