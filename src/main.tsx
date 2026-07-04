import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { BranchProvider, CartProvider } from "./context";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <BranchProvider>
          <App />
        </BranchProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
