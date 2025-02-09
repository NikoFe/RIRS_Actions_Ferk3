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
