import { createRoot } from "react-dom/client";
import App from "./App";
// @ts-ignore
import "./index.css";

// Ensure stored auth is cleared on full page load so users must re-login
localStorage.removeItem("clinicAuth");

createRoot(document.getElementById("root")!).render(<App />);