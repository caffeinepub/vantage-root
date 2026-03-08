import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  Leaf,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Package,
  Settings,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import plantlyLogo from "../../public/assets/generated/plantly-logo-transparent.dim_800x200.png";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { useActor } from "../hooks/useActor";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const inputClass =
  "bg-[oklch(0.22_0.055_150)] border-[oklch(0.32_0.05_150)] text-white placeholder:text-[oklch(0.45_0.03_140)] focus:border-[oklch(0.62_0.12_45)] rounded-sm font-sans text-sm h-10";

// ─── Profile Section ──────────────────────────────────────────────
function ProfileSection() {
  const { actor } = useActor();
  const { customer, token, refreshProfile } = useCustomerAuth();
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: customer?.fullName ?? "",
    phone: customer?.phone ?? "",
    addressLine: customer?.addressLine ?? "",
    city: customer?.city ?? "",
    state: customer?.state ?? "",
    country: customer?.country ?? "",
    pincode: customer?.pincode ?? "",
  });

  // Sync form when customer data loads
  useEffect(() => {
    if (customer) {
      setForm({
        fullName: customer.fullName,
        phone: customer.phone,
        addressLine: customer.addressLine,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        pincode: customer.pincode,
      });
    }
  }, [customer]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !token) return;
    setIsSaving(true);
    try {
      const ok = await actor.updateCustomerProfile(
        token,
        form.fullName.trim(),
        form.phone.trim(),
        form.addressLine.trim(),
        form.city.trim(),
        form.state.trim(),
        form.country.trim(),
        form.pincode.trim(),
      );
      if (ok) {
        await refreshProfile();
        setEditing(false);
        toast.success("Profile updated successfully.");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!customer) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="h-10 w-full bg-[oklch(0.23_0.06_150)] rounded-sm"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile header card */}
      <div className="flex items-center gap-4 p-5 bg-[oklch(0.22_0.06_150)] border border-[oklch(0.30_0.05_150)] rounded-sm">
        <div className="w-14 h-14 rounded-full bg-[oklch(0.62_0.12_45/0.2)] border border-[oklch(0.62_0.12_45/0.4)] flex items-center justify-center shrink-0">
          <span className="font-display text-xl font-light text-[oklch(0.82_0.10_45)]">
            {customer.fullName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-display text-xl font-light">
            {customer.fullName}
          </p>
          <p className="text-[oklch(0.60_0.03_140)] font-sans text-sm flex items-center gap-1.5 mt-0.5">
            <Mail size={12} />
            {customer.email}
          </p>
        </div>
        {!editing && (
          <Button
            type="button"
            data-ocid="dashboard.edit_button"
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
            className="border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] hover:bg-[oklch(0.28_0.06_150)] hover:text-white rounded-sm font-sans shrink-0"
          >
            <Settings size={13} className="mr-1.5" />
            Edit
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!editing ? (
          <motion.div
            key="view"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            variants={fadeUp}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Info fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: User, label: "Full Name", value: customer.fullName },
                { icon: Mail, label: "Email", value: customer.email },
                {
                  icon: User,
                  label: "Phone",
                  value: customer.phone || "Not set",
                },
                {
                  icon: MapPin,
                  label: "City",
                  value: customer.city || "Not set",
                },
                {
                  icon: MapPin,
                  label: "State",
                  value: customer.state || "Not set",
                },
                {
                  icon: MapPin,
                  label: "Country",
                  value: customer.country || "Not set",
                },
              ].map((field) => (
                <div
                  key={field.label}
                  className="p-4 bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm"
                >
                  <p className="text-[oklch(0.55_0.03_140)] font-sans text-xs uppercase tracking-wider mb-1">
                    {field.label}
                  </p>
                  <p className="text-white font-sans text-sm">{field.value}</p>
                </div>
              ))}
              <div className="sm:col-span-2 p-4 bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm">
                <p className="text-[oklch(0.55_0.03_140)] font-sans text-xs uppercase tracking-wider mb-1">
                  Delivery Address
                </p>
                <p className="text-white font-sans text-sm">
                  {[
                    customer.addressLine,
                    customer.city,
                    customer.state,
                    customer.pincode,
                    customer.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Not set"}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="edit"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            variants={fadeUp}
            transition={{ duration: 0.25 }}
            onSubmit={handleSave}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="prof-fullName"
                  className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                >
                  Full Name
                </Label>
                <Input
                  id="prof-fullName"
                  name="fullName"
                  data-ocid="dashboard.input"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="prof-phone"
                  className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                >
                  Phone
                </Label>
                <Input
                  id="prof-phone"
                  name="phone"
                  data-ocid="dashboard.input"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label
                  htmlFor="prof-addressLine"
                  className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                >
                  Street Address
                </Label>
                <Input
                  id="prof-addressLine"
                  name="addressLine"
                  data-ocid="dashboard.input"
                  value={form.addressLine}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="prof-city"
                  className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                >
                  City
                </Label>
                <Input
                  id="prof-city"
                  name="city"
                  data-ocid="dashboard.input"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="prof-state"
                  className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                >
                  State
                </Label>
                <Input
                  id="prof-state"
                  name="state"
                  data-ocid="dashboard.input"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="prof-country"
                  className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                >
                  Country
                </Label>
                <Input
                  id="prof-country"
                  name="country"
                  data-ocid="dashboard.input"
                  value={form.country}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="prof-pincode"
                  className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
                >
                  Pincode
                </Label>
                <Input
                  id="prof-pincode"
                  name="pincode"
                  data-ocid="dashboard.input"
                  value={form.pincode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                data-ocid="dashboard.save_button"
                disabled={isSaving}
                className="bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm h-10 text-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                data-ocid="dashboard.cancel_button"
                variant="outline"
                onClick={() => setEditing(false)}
                className="border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] hover:bg-[oklch(0.25_0.05_150)] hover:text-white rounded-sm h-10 text-sm"
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Change Password Section ──────────────────────────────────────
function PasswordSection() {
  const { actor } = useActor();
  const { token } = useCustomerAuth();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (!actor || !token) return;
    setIsSaving(true);
    try {
      const result = await actor.changeCustomerPassword(
        token,
        form.oldPassword,
        form.newPassword,
      );
      if (result.__kind__ === "ok") {
        setSuccess(true);
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        toast.success("Password changed successfully.");
      } else {
        setError(result.err);
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  const PwField = ({
    id,
    name,
    label,
    placeholder,
    value,
    show,
    onToggle,
  }: {
    id: string;
    name: string;
    label: string;
    placeholder: string;
    value: string;
    show: boolean;
    onToggle: () => void;
  }) => (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-[oklch(0.72_0.04_140)] font-sans text-xs font-medium"
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          data-ocid="dashboard.input"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required
          className={`${inputClass} pr-10`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.50_0.03_140)] hover:text-[oklch(0.72_0.04_140)] transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md">
      <h3 className="font-display text-xl font-light text-white mb-1">
        Change Password
      </h3>
      <p className="text-[oklch(0.58_0.03_140)] font-sans text-sm mb-6">
        Choose a strong password to keep your account secure.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PwField
          id="oldPassword"
          name="oldPassword"
          label="Current Password"
          placeholder="Your current password"
          value={form.oldPassword}
          show={showOld}
          onToggle={() => setShowOld((v) => !v)}
        />
        <PwField
          id="newPassword"
          name="newPassword"
          label="New Password"
          placeholder="Min. 6 characters"
          value={form.newPassword}
          show={showNew}
          onToggle={() => setShowNew((v) => !v)}
        />
        <PwField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm New Password"
          placeholder="Repeat new password"
          value={form.confirmPassword}
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
        />

        {error && (
          <p
            data-ocid="dashboard.error_state"
            className="text-[oklch(0.68_0.18_25)] text-sm font-sans bg-[oklch(0.45_0.15_25/0.15)] border border-[oklch(0.45_0.15_25/0.3)] rounded-sm px-4 py-2"
          >
            {error}
          </p>
        )}
        {success && (
          <p
            data-ocid="dashboard.success_state"
            className="text-[oklch(0.72_0.12_145)] text-sm font-sans bg-[oklch(0.35_0.10_145/0.15)] border border-[oklch(0.42_0.10_145/0.3)] rounded-sm px-4 py-2 flex items-center gap-2"
          >
            <CheckCircle2 size={14} />
            Password changed successfully.
          </p>
        )}

        <Button
          type="submit"
          data-ocid="dashboard.save_button"
          disabled={isSaving}
          className="bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm h-10 text-sm"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Saving…
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  );
}

// ─── Newsletter Section ───────────────────────────────────────────
function NewsletterSection() {
  const { actor } = useActor();
  const { customer } = useCustomerAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubscribe() {
    if (!actor || !customer) return;
    setIsLoading(true);
    try {
      const ok = await actor.subscribeNewsletter(customer.email);
      if (ok) {
        setIsSubscribed(true);
        toast.success("You're subscribed to the Plantly newsletter!");
      } else {
        toast.info("You're already subscribed.");
        setIsSubscribed(true);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnsubscribe() {
    if (!actor || !customer) return;
    setIsLoading(true);
    try {
      await actor.unsubscribeNewsletter(customer.email);
      setIsSubscribed(false);
      toast.success("You've been unsubscribed.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h3 className="font-display text-xl font-light text-white mb-1">
          Newsletter
        </h3>
        <p className="text-[oklch(0.58_0.03_140)] font-sans text-sm">
          Get plant care guides, seasonal tips, and Plantly updates delivered to
          your inbox.
        </p>
      </div>

      <div className="p-5 bg-[oklch(0.22_0.06_150)] border border-[oklch(0.30_0.05_150)] rounded-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[oklch(0.62_0.12_45/0.15)] flex items-center justify-center">
            <Mail size={16} className="text-[oklch(0.72_0.10_45)]" />
          </div>
          <div>
            <p className="text-white font-sans text-sm font-medium">
              {customer?.email}
            </p>
            <p className="text-[oklch(0.55_0.03_140)] font-sans text-xs">
              {isSubscribed ? "Subscribed" : "Not subscribed"}
            </p>
          </div>
          {isSubscribed && (
            <CheckCircle2
              size={16}
              className="text-[oklch(0.62_0.12_45)] ml-auto"
            />
          )}
        </div>

        {isSubscribed ? (
          <Button
            type="button"
            data-ocid="dashboard.toggle"
            variant="outline"
            onClick={handleUnsubscribe}
            disabled={isLoading}
            className="w-full border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] hover:bg-[oklch(0.25_0.05_150)] hover:text-white rounded-sm h-10 text-sm"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : null}
            Unsubscribe
          </Button>
        ) : (
          <Button
            type="button"
            data-ocid="dashboard.toggle"
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm h-10 text-sm"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : null}
            Subscribe to Newsletter
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Placeholder Card ─────────────────────────────────────────────
function PlaceholderCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div
      data-ocid="dashboard.empty_state"
      className="flex flex-col items-center justify-center py-16 px-6 text-center bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm"
    >
      <div className="w-14 h-14 rounded-full bg-[oklch(0.28_0.06_150)] flex items-center justify-center mb-4">
        <Icon size={24} className="text-[oklch(0.50_0.04_140)]" />
      </div>
      <h3 className="font-display text-xl font-light text-white mb-2">
        {title}
      </h3>
      <p className="text-[oklch(0.55_0.03_140)] font-sans text-sm max-w-xs">
        {description}
      </p>
    </div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────
export default function DashboardPage() {
  const { customer, isLoading, logout } = useCustomerAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !customer) {
      void navigate({ to: "/login" });
    }
  }, [isLoading, customer, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[oklch(0.14_0.04_150)] pt-24 px-6">
        <div
          data-ocid="dashboard.loading_state"
          className="max-w-4xl mx-auto space-y-4"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-14 w-full bg-[oklch(0.23_0.06_150)] rounded-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!customer) return null;

  const firstName = customer.fullName.split(" ")[0];

  return (
    <div className="min-h-screen bg-[oklch(0.14_0.04_150)] pt-16">
      {/* Header */}
      <div className="bg-[oklch(0.16_0.04_150)] border-b border-[oklch(0.25_0.05_150)] py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link to="/">
              <img
                src={plantlyLogo}
                alt="Plantly"
                className="h-7 w-auto mb-3 opacity-80"
              />
            </Link>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.35 }}
            >
              <h1 className="font-display text-2xl sm:text-3xl font-light text-white">
                Welcome back,{" "}
                <span className="text-[oklch(0.72_0.10_45)]">{firstName}</span>
              </h1>
              <p className="text-[oklch(0.55_0.03_140)] font-sans text-sm mt-1">
                Manage your account and preferences
              </p>
            </motion.div>
          </div>
          <Button
            type="button"
            data-ocid="dashboard.button"
            variant="outline"
            size="sm"
            onClick={() => void logout().then(() => navigate({ to: "/" }))}
            className="border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] hover:bg-[oklch(0.23_0.06_150)] hover:text-white rounded-sm font-sans flex items-center gap-2"
          >
            <LogOut size={13} />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList
            data-ocid="dashboard.tab"
            className="bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm p-1 flex flex-wrap gap-1 h-auto"
          >
            {[
              { value: "profile", label: "My Profile", icon: User },
              { value: "password", label: "Change Password", icon: Settings },
              { value: "orders", label: "Order History", icon: Package },
              { value: "wishlist", label: "Wishlist", icon: Heart },
              { value: "newsletter", label: "Newsletter", icon: Mail },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                data-ocid="dashboard.tab"
                className="flex items-center gap-1.5 text-xs font-sans font-medium rounded-sm data-[state=active]:bg-[oklch(0.62_0.12_45)] data-[state=active]:text-white text-[oklch(0.62_0.04_140)] hover:text-white transition-colors px-3 py-2 h-auto"
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile" className="mt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.3 }}
            >
              <ProfileSection />
            </motion.div>
          </TabsContent>

          <TabsContent value="password" className="mt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.3 }}
            >
              <PasswordSection />
            </motion.div>
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.3 }}
            >
              <PlaceholderCard
                icon={Package}
                title="No Orders Yet"
                description="Your orders will appear here once you make a purchase."
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.3 }}
            >
              <PlaceholderCard
                icon={Heart}
                title="Your Wishlist is Empty"
                description="Items you save will appear here."
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="newsletter" className="mt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.3 }}
            >
              <NewsletterSection />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer strip */}
      <div className="border-t border-[oklch(0.22_0.04_150)] py-6 px-6 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[oklch(0.42_0.02_140)] font-sans">
          <p className="flex items-center gap-1.5">
            <Leaf size={11} />
            Plantly — Urban Balcony Landscaping
          </p>
          <p>© {new Date().getFullYear()} Plantly. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
