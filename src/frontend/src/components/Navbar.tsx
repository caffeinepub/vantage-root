import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import plantlyLogo from "../../public/assets/generated/plantly-logo-transparent.dim_800x200.png";
import { useCustomerAuth } from "../context/CustomerAuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { customer, logout, isLoading } = useCustomerAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Services", href: "/#services" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Plants", href: "/#plants" },
    { label: "Contact", href: "/#contact" },
  ];

  const handleAnchor = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (window.location.pathname !== "/") {
        navigate({ to: "/" }).then(() => {
          setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  async function handleLogout() {
    setMobileOpen(false);
    await logout();
    void navigate({ to: "/" });
  }

  const firstName = customer?.fullName?.split(" ")[0] ?? "";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[oklch(0.18_0.055_150/0.97)] backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={plantlyLogo} alt="Plantly" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                onClick={() => handleAnchor(link.href)}
                className="text-sm font-medium tracking-wide text-[oklch(0.88_0.04_140)] hover:text-[oklch(0.62_0.12_45)] transition-colors duration-200"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA + Auth */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoading && !customer ? (
            <>
              <Link
                to="/login"
                data-ocid="nav.login_link"
                className="text-sm font-medium text-[oklch(0.82_0.04_140)] hover:text-[oklch(0.62_0.12_45)] transition-colors duration-200 px-3 py-1.5"
              >
                Sign In
              </Link>
              <Button
                asChild
                data-ocid="nav.signup_link"
                variant="outline"
                size="sm"
                className="border-[oklch(0.62_0.12_45/0.6)] text-[oklch(0.82_0.04_140)] bg-transparent hover:bg-[oklch(0.62_0.12_45/0.15)] hover:text-white hover:border-[oklch(0.62_0.12_45)] rounded-sm font-medium text-sm transition-all duration-200"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
              <Button
                asChild
                data-ocid="nav.consult_button"
                className="bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold tracking-wide px-5 rounded-sm transition-all duration-200"
              >
                <Link to="/consult">Book Consultation</Link>
              </Button>
            </>
          ) : !isLoading && customer ? (
            <>
              <Button
                asChild
                data-ocid="nav.consult_button"
                className="bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold tracking-wide px-5 rounded-sm transition-all duration-200"
              >
                <Link to="/consult">Book Consultation</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    data-ocid="nav.user_dropdown"
                    className="flex items-center gap-2 text-sm font-medium text-[oklch(0.88_0.04_140)] hover:text-[oklch(0.62_0.12_45)] transition-colors duration-200 px-2 py-1.5 rounded-sm hover:bg-[oklch(0.25_0.05_150/0.5)]"
                  >
                    <div className="w-7 h-7 rounded-full bg-[oklch(0.62_0.12_45/0.2)] border border-[oklch(0.62_0.12_45/0.4)] flex items-center justify-center">
                      <span className="text-xs font-semibold text-[oklch(0.82_0.10_45)]">
                        {firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {firstName}
                    <ChevronDown size={12} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[oklch(0.20_0.055_150)] border-[oklch(0.30_0.05_150)] text-white min-w-[160px]"
                >
                  <DropdownMenuItem
                    asChild
                    className="hover:bg-[oklch(0.28_0.06_150)] focus:bg-[oklch(0.28_0.06_150)] cursor-pointer font-sans text-sm text-[oklch(0.82_0.025_140)]"
                  >
                    <Link to="/dashboard" data-ocid="nav.link">
                      <User size={13} className="mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[oklch(0.28_0.05_150)]" />
                  <DropdownMenuItem
                    data-ocid="nav.logout_button"
                    onClick={() => void handleLogout()}
                    className="hover:bg-[oklch(0.28_0.06_150)] focus:bg-[oklch(0.28_0.06_150)] cursor-pointer font-sans text-sm text-[oklch(0.68_0.14_25)] hover:text-[oklch(0.78_0.14_25)]"
                  >
                    <LogOut size={13} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden text-[oklch(0.88_0.04_140)] p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[oklch(0.18_0.055_150)] border-t border-[oklch(0.30_0.05_150)] px-6 py-4 space-y-4"
          >
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleAnchor(link.href)}
                className="block w-full text-left text-base font-medium text-[oklch(0.88_0.04_140)] hover:text-[oklch(0.62_0.12_45)] transition-colors"
              >
                {link.label}
              </button>
            ))}

            {/* Auth links (mobile) */}
            {!isLoading && !customer ? (
              <div className="space-y-2 pt-2 border-t border-[oklch(0.28_0.05_150)]">
                <Link
                  to="/login"
                  data-ocid="nav.login_link"
                  onClick={() => setMobileOpen(false)}
                  className="block text-base font-medium text-[oklch(0.88_0.04_140)] hover:text-[oklch(0.62_0.12_45)] transition-colors py-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  data-ocid="nav.signup_link"
                  onClick={() => setMobileOpen(false)}
                  className="block text-base font-medium text-[oklch(0.88_0.04_140)] hover:text-[oklch(0.62_0.12_45)] transition-colors py-1"
                >
                  Sign Up
                </Link>
              </div>
            ) : !isLoading && customer ? (
              <div className="space-y-2 pt-2 border-t border-[oklch(0.28_0.05_150)]">
                <Link
                  to="/dashboard"
                  data-ocid="nav.link"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-base font-medium text-[oklch(0.88_0.04_140)] hover:text-[oklch(0.62_0.12_45)] transition-colors py-1"
                >
                  <User size={14} />
                  My Dashboard
                </Link>
                <button
                  type="button"
                  data-ocid="nav.logout_button"
                  onClick={() => void handleLogout()}
                  className="flex items-center gap-2 text-base font-medium text-[oklch(0.68_0.14_25)] hover:text-[oklch(0.78_0.14_25)] transition-colors py-1"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : null}

            <Button
              asChild
              data-ocid="nav.consult_button"
              className="w-full bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm"
            >
              <Link to="/consult" onClick={() => setMobileOpen(false)}>
                Book Consultation
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
