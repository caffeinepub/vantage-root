import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import AdminPage from "./pages/AdminPage";
import ConsultPage from "./pages/ConsultPage";
import HomePage from "./pages/HomePage";
import SessionsPage from "./pages/SessionsPage";

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

export const routeTree = rootRoute.addChildren([
  indexRoute,
  consultRoute,
  adminRoute,
  adminSessionsRoute,
]);

export { Outlet };
