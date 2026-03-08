import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import AdminPage from "./pages/AdminPage";
import ConsultPage from "./pages/ConsultPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SellWithUsPage from "./pages/SellWithUsPage";
import SessionsPage from "./pages/SessionsPage";
import ShopPage from "./pages/ShopPage";
import SignupPage from "./pages/SignupPage";

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const consultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/consult",
  component: ConsultPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const adminSessionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/sessions",
  component: SessionsPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: ShopPage,
});

const sellWithUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sell-with-us",
  component: SellWithUsPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  consultRoute,
  adminRoute,
  adminSessionsRoute,
  signupRoute,
  loginRoute,
  dashboardRoute,
  shopRoute,
  sellWithUsRoute,
]);

export { Outlet };
