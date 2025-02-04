import { describe, test, expect } from "vitest"; // ✅ Use Vitest functions explicitly
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // <-- ADD THIS LINE

import App from "./App"; // ✅ Make sure the import path is correct

describe("App Component", () => {
  test("renders the learn react link", () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
});
