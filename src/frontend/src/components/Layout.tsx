import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "@tanstack/react-router";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
