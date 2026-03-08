import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import plantlyLogo from "../../public/assets/generated/plantly-logo-transparent.dim_800x200.png";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { useActor } from "../hooks/useActor";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SignupPage() {
  const { actor } = useActor();
  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!actor) {
      setError("Connecting to network… please try again in a moment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const signupResult = await actor.signupCustomer(
        form.fullName.trim(),
        form.email.trim().toLowerCase(),
        form.password,
        form.phone.trim(),
        form.addressLine.trim(),
        form.city.trim(),
        form.state.trim(),
        form.country.trim(),
        form.pincode.trim(),
      );

      if (signupResult.__kind__ === "err") {
        setError(signupResult.err);
        return;
      }

      // Auto-login after signup
      const loginResult = await actor.loginCustomer(
        form.email.trim().toLowerCase(),
        form.password,
      );

      if (loginResult.__kind__ === "err") {
        setError("Account created! Please log in.");
        void navigate({ to: "/login" });
        return;
      }

      await login(loginResult.ok);
      void navigate({ to: "/dashboard" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "bg-[oklch(0.22_0.055_150)] border-[oklch(0.32_0.05_150)] text-white placeholder:text-[oklch(0.45_0.03_140)] focus:border-[oklch(0.62_0.12_45)] rounded-sm font-sans text-sm h-10";

  return (
    <div className="min-h-screen bg-[oklch(0.14_0.04_150)] flex flex-col">
      {/* Top brand strip */}
      <div className="pt-20 pb-8 px-6 flex flex-col items-center">
        <Link to="/">
          <img
            src={plantlyLogo}
            alt="Plantly"
            className="h-9 w-auto mb-6 opacity-90 hover:opacity-100 transition-opacity"
          />
        </Link>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-light text-white mb-2">
            Create your account
          </h1>
          <p className="text-[oklch(0.62_0.04_140)] font-sans text-sm">
            Join Plantly and bring your balcony to life.
          </p>
        </motion.div>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="flex-1 flex items-start justify-center px-4 pb-16"
      >
        <div className="w-full max-w-2xl bg-[oklch(0.18_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm p-6 sm:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf size={14} className="text-[oklch(0.62_0.12_45)]" />
                <span className="text-[oklch(0.62_0.12_45)] text-xs font-semibold tracking-widest uppercase font-sans">
                  Personal Information
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="fullName"
                    className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    data-ocid="signup.input"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    data-ocid="signup.input"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label
                    htmlFor="email"
                    className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    data-ocid="signup.input"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf size={14} className="text-[oklch(0.62_0.12_45)]" />
                <span className="text-[oklch(0.62_0.12_45)] text-xs font-semibold tracking-widest uppercase font-sans">
                  Password
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                  >
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      data-ocid="signup.input"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className={`${inputClass} pr-10`}
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
                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                  >
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      data-ocid="signup.input"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.50_0.03_140)] hover:text-[oklch(0.72_0.04_140)] transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf size={14} className="text-[oklch(0.62_0.12_45)]" />
                <span className="text-[oklch(0.62_0.12_45)] text-xs font-semibold tracking-widest uppercase font-sans">
                  Delivery Address
                </span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="addressLine"
                    className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                  >
                    Street Address *
                  </Label>
                  <Input
                    id="addressLine"
                    name="addressLine"
                    data-ocid="signup.input"
                    type="text"
                    autoComplete="street-address"
                    placeholder="123 Green Lane, Apartment 4B"
                    value={form.addressLine}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="city"
                      className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                    >
                      City *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      data-ocid="signup.input"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="state"
                      className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                    >
                      State *
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      data-ocid="signup.input"
                      type="text"
                      autoComplete="address-level1"
                      placeholder="Maharashtra"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="country"
                      className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                    >
                      Country *
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      data-ocid="signup.input"
                      type="text"
                      autoComplete="country-name"
                      placeholder="India"
                      value={form.country}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="pincode"
                      className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                    >
                      Pincode
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      data-ocid="signup.input"
                      type="text"
                      autoComplete="postal-code"
                      placeholder="400001"
                      value={form.pincode}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                data-ocid="signup.error_state"
                className="text-[oklch(0.68_0.18_25)] text-sm font-sans bg-[oklch(0.45_0.15_25/0.15)] border border-[oklch(0.45_0.15_25/0.3)] rounded-sm px-4 py-2"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              data-ocid="signup.submit_button"
              disabled={isSubmitting}
              className="w-full bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm h-11 text-sm tracking-wide transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-[oklch(0.55_0.03_140)] font-sans">
              Already have an account?{" "}
              <Link
                to="/login"
                data-ocid="signup.link"
                className="text-[oklch(0.62_0.12_45)] hover:text-[oklch(0.72_0.12_45)] underline underline-offset-2 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
