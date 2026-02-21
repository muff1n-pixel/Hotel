import IndexPage from "./Pages/IndexPage/IndexPage";
import LogoutPage from "./Pages/LogoutPage/LogoutPage";

export const routes = [
  { path: "/", element: <IndexPage /> },
  { path: "/logout", element: <LogoutPage /> },
];