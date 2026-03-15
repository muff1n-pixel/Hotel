import { useRoutes, type RouteObject } from "react-router";
import { ThemeProvider } from "./ThemeProvider";
import IndexPage from "./Pages/IndexPage/IndexPage";
import "./Theme.css";

const routes: RouteObject[] = [
  { path: "/", element: <IndexPage /> },
];

export default function Theme() {
  const element = useRoutes(routes);

  return (
    <ThemeProvider>
      {element}
    </ThemeProvider>
  );
}