import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
//import App from "./App.jsx";
import App from "./components/App";
import "./App.css";

/*
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
*/
createRoot(document.getElementById("root")).render(<App />);
