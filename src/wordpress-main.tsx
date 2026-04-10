import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const mountNode = document.getElementById("matrix-whisperer-root");

if (mountNode) {
  createRoot(mountNode).render(<App />);
}
