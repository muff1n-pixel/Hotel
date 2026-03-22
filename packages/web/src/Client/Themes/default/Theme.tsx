import { useRoutes, type RouteObject } from "react-router";
import { ThemeProvider } from "./ThemeProvider";
import { Outlet } from "react-router";
import Header from "./Components/Header/Header";
import IndexPage from "./Pages/IndexPage/IndexPage";
import LogoutPage from "./Pages/LogoutPage/LogoutPage";
import MePage from "./Pages/MePage/MePage";
import Footer from "./Components/Footer/Footer";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import SettingsPage from "./Pages/SettingsPage/SettingsPage";
import CommunityPage from "./Pages/CommunityPage/CommunityPage";
import ArticlePage from "./Pages/ArticlePage/ArticlePage";
import SafetyPage from "./Pages/SafetyPage/SafetyPage";
import './Theme.css';
import './Fonts.css';
import StaffPage from "./Pages/StaffPage/StaffPage";
import MaintenancePage from "./Pages/MaintenancePage/MaintenancePage";

const FooterLayout = () => (
  <>
    <Outlet />
    <Footer />
  </>
);

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const ErrorElement = () => (
  <>
    <Header />
    <ErrorPage />
    <Footer />
  </>
);

export const routes = [
  {
    path: "*",
    element: <ErrorElement />
  },
  {
    path: "/",
    element: <IndexPage />
  },
  {
    path: "/me",
    element: <Layout />,
    children: [
      { index: true, element: <MePage /> },
    ]
  },
  {
    path: "/settings/:section?",
    element: <Layout />,
    children: [
      { index: true, element: <SettingsPage /> },
    ]
  },
  {
    path: "community",
    element: <Layout />,
    children: [
      { index: true, element: <CommunityPage /> },
    ]
  },
  {
    path: "/article/:articleDate?/:articleTitle?",
    element: <Layout />,
    children: [
      { index: true, element: <ArticlePage /> },
    ]
  },
  {
    path: "staff",
    element: <Layout />,
    children: [
      { index: true, element: <StaffPage /> },
    ]
  },
  {
    path: "/safety/:section?",
    element: <Layout />,
    children: [
      { index: true, element: <SafetyPage /> },
    ]
  },
  {
    path: "/logout",
    element: <LogoutPage />
  },
  {
    path: "/maintenance",
    element: <MaintenancePage />
  },
];

export default function Theme() {
  const element = useRoutes(routes);

  return (
    <ThemeProvider>
      {element}
    </ThemeProvider>
  );
}