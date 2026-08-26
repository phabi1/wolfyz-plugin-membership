import ReactDOM from "react-dom";
import { RouterProvider } from "react-router";
import { router } from "./router";
import "./css/wp-hack.css";
import { ToastProvider } from "./contexts/toast";

const container = document.getElementById("app");
const root = ReactDOM.createRoot(container);
root.render(
  <ToastProvider>
    <RouterProvider router={router} />
  </ToastProvider>,
);
