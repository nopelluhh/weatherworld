import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Root } from "./pages/root";

const el = document.querySelector("#app")!;

createRoot(el).render(createElement(Root));
