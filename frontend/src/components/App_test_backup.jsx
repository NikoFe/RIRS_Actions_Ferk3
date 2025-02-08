import { describe, test, expect, it, vi } from "vitest"; // ✅ Use Vitest functions explicitly
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // <-- ADD THIS LINE
import userEvent from "@testing-library/user-event";
//import "testing-library/jest-dom/vitest";
import axios from "axios";
import App from "./App"; // ✅ Make sure the import path is correct

// Mock axios to prevent actual network requests
vi.mock("axios");

describe("test1", async () => {
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

  const posts = screen.getAllByTestId("Post-div"); // Assuming test ID
  const filteredPosts = posts.filter(
    (post) => post.getAttribute("data-username") === mockUser
  );

  //*********************filter the buttons:

  // Step 1: Get all divs with data-testid="Post-div"
  const postDivs = screen.getAllByTestId("Post-div");

  // Step 2: Filter divs containing a strong element with data-testid="uploader"
  const postDivsWithUploader = postDivs.filter((div) =>
    div.querySelector('[data-testid="uploader"]')
  );

  //*********************
  // Step 3: Further filter divs where uploader text contains "user1"
  const user1Posts = postDivsWithUploader.filter((div) => {
    const uploader = div.querySelector('[data-testid="uploader"]');
    return uploader && uploader.textContent.includes(mockUser);
  });

  user1Posts.forEach((div) => {
    const updateButton = screen.getByText("Update", { container: div });
    const deleteButton = screen.getByText("Delete", { container: div });

    expect(updateButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  // Wait for the welcome message to appear
  await waitFor(() => {
    expect(screen.getByTestId("welcome_header")).toHaveTextContent(
      `Welcome, ${mockUser.username}`
    );
  });

  await waitFor(() => {});
});

/*
  describe("test2", async () => {
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
  });*/

//APP

//Check if logout and create buttons exist

//update price after changing the value of components
//after successfully creating check that all the values are empty or 0
//Check if toast appears after succesfully creating
//Fields not changed when not successfuly creating
//Check that alert appears after not successfuly creating
//Check if an alert with all the existing values in updating
//Check if all the post elements which don't have options aren't from user

//Check if logout and create buttons exist
//Check if submit field exists with all the inputs

//login funckionalnost za drugi del:
//Check if the login component only appears after logout
//if fields in login are empty login does not pass

//Welcome on top should show user name
