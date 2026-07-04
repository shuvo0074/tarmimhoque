// Entry point: mounts the React app and loads global styles.
// Views: web and mobile.
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
