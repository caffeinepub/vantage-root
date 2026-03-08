import { RouterProvider, createRouter } from "@tanstack/react-router";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import { routeTree } from "./routeTree";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <CustomerAuthProvider>
      <RouterProvider router={router} />
    </CustomerAuthProvider>
  );
}
