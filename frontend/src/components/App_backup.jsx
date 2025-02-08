import { describe, test, expect, it } from "vitest"; // ✅ Use Vitest functions explicitly
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // <-- ADD THIS LINE
import userEvent from "@testing-library/event";
import "testing-library/jest-dom/vitest";

import App from "./App"; // ✅ Make sure the import path is correct

describe("App Component", () => {
  /*
  test("renders the learn react link", async () => {
    render(<App name={"Pedro"} />);
    const linkElement = screen.getByText(/learn react/i);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(linkElement).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /increment/i });
    const counterValue = screen.getByTestId("counter-value"); // <p data-testid="counter-value">

    expect(counterValue, tetContnet).toEqual("0");

    await userEvent.click(button); //after the user clicks the button

    expect(counterValue, tetContnet).toEqual("1");
  });
*/
});

//APP

//update price after changing the value of components
//after successfully creating check that all the values are empty or 0
//Check if toast appears after succesfully creating
//Fields not changed when not successfuly creating
//Check that alert appears after not successfuly creating
//
