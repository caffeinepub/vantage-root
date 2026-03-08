import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import plantlyLogo from "../../public/assets/generated/plantly-logo-transparent.dim_800x200.png";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { useActor } from "../hooks/useActor";

export default function LoginPage() {
  const { actor } = useActor();
  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!actor) {
      setError("Connecting to network… please try again in a moment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await actor.loginCustomer(
        email.trim().toLowerCase(),
        password,
      );

      if (result.__kind__ === "err") {
        setError(result.err);
        return;
      }

      await login(result.ok);
      void navigate({ to: "/dashboard" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[oklch(0.14_0.04_150)] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <img
              src={plantlyLogo}
              alt="Plantly"
              className="h-9 w-auto mb-6 opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>
          <h1 className="font-display text-3xl font-light text-white mb-2 text-center">
            Welcome back
          </h1>
          <p className="text-[oklch(0.62_0.04_140)] font-sans text-sm text-center">
            Sign in to your Plantly account.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[oklch(0.18_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
              >
                Email Address
              </Label>
              <Input
                id="email"
                data-ocid="login.input"
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                className="bg-[oklch(0.22_0.055_150)] border-[oklch(0.32_0.05_150)] text-white placeholder:text-[oklch(0.45_0.03_140)] focus:border-[oklch(0.62_0.12_45)] rounded-sm font-sans text-sm h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  data-ocid="login.input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  className="bg-[oklch(0.22_0.055_150)] border-[oklch(0.32_0.05_150)] text-white placeholder:text-[oklch(0.45_0.03_140)] focus:border-[oklch(0.62_0.12_45)] rounded-sm font-sans text-sm h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.50_0.03_140)] hover:text-[oklch(0.72_0.04_140)] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                data-ocid="login.error_state"
                className="text-[oklch(0.68_0.18_25)] text-sm font-sans bg-[oklch(0.45_0.15_25/0.15)] border border-[oklch(0.45_0.15_25/0.3)] rounded-sm px-4 py-2"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              data-ocid="login.submit_button"
              disabled={isSubmitting}
              className="w-full bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm h-11 text-sm tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[oklch(0.55_0.03_140)] font-sans mt-5">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            data-ocid="login.link"
            className="text-[oklch(0.62_0.12_45)] hover:text-[oklch(0.72_0.12_45)] underline underline-offset-2 transition-colors"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
