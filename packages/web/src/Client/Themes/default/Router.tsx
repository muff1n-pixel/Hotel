import { Outlet } from "react-router";
import Header from "./Components/Header/Header";
import IndexPage from "./Pages/IndexPage/IndexPage";
import LogoutPage from "./Pages/LogoutPage/LogoutPage";
import MePage from "./Pages/MePage/MePage";
import Footer from "./Components/Footer/Footer";
import './General.css';
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import SettingsPage from "./Pages/SettingsPage/SettingsPage";
import CommunityPage from "./Pages/CommunityPage/CommunityPage";
import ArticlePage from "./Pages/ArticlePage/ArticlePage";

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
    path: "/article/:articleId?/:articleName?",
    element: <Layout />,
    children: [
      { index: true, element: <ArticlePage /> }, 
    ]
  },
  {
    path: "/logout",
    element: <LogoutPage />
  },
];