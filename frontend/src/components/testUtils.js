import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * Simulates user login in tests.
 * @param {string} username - The username to type.
 * @param {string} password - The password to type.
 */
export const loginUser = async (
  username = "testUser",
  password = "testPass"
) => {
  await userEvent.type(screen.getByPlaceholderText("Username"), username);
  await userEvent.type(screen.getByPlaceholderText("Password"), password);
  await userEvent.click(screen.getByTestId("login_button"));
};
