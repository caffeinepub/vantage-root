import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { BalconySize, StylePreference, SunlightExposure } from "../backend.d";
import { useSubmitConsultationRequest } from "../hooks/useQueries";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ConsultPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    balconySize: "" as BalconySize | "",
    sunlightExposure: "" as SunlightExposure | "",
    stylePreference: "" as StylePreference | "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending, isError, error } = useSubmitConsultationRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.email ||
      !form.balconySize ||
      !form.sunlightExposure ||
      !form.stylePreference
    )
      return;

    mutate(
      {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        balconySize: form.balconySize,
        sunlightExposure: form.sunlightExposure,
        stylePreference: form.stylePreference,
        message: form.message,
      },
      {
        onSuccess: (ok) => {
          if (ok) setSubmitted(true);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[oklch(0.18_0.055_150)] pt-16">
      {/* Header strip */}
      <div className="bg-[oklch(0.14_0.04_150)] border-b border-[oklch(0.25_0.05_150)] py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[oklch(0.72_0.04_140)] hover:text-[oklch(0.62_0.12_45)] text-sm font-sans transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-light text-white">
            Book a Free
            <em className="block italic text-[oklch(0.62_0.12_45)] mt-1">
              Consultation
            </em>
          </h1>
          <p className="font-sans text-[oklch(0.72_0.04_140)] mt-3 text-base">
            Tell us about your space and we'll get back to you within 24 hours.
          </p>
        </div>
      </div>

      {/* Content — two-column layout on large screens */}
      <div className="max-w-6xl mx-auto px-6 py-12 lg:grid lg:grid-cols-[1fr_340px] lg:gap-12 lg:items-start">
        {/* Success state */}
        {submitted ? (
          <motion.div
            data-ocid="consult.success_state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[oklch(0.23_0.06_150)] border border-[oklch(0.45_0.09_140/0.5)] rounded-sm p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[oklch(0.45_0.09_140/0.2)] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-[oklch(0.55_0.10_140)]" />
            </div>
            <h2 className="font-display text-3xl font-light text-white mb-4">
              Request Submitted
            </h2>
            <p className="font-sans text-[oklch(0.72_0.04_140)] text-base mb-8 max-w-md mx-auto">
              Thank you, {form.name}! We've received your consultation request
              and will be in touch within 24 hours.
            </p>
            <Button
              asChild
              className="bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white rounded-sm font-semibold"
            >
              <Link to="/">Return Home</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.form
            initial="hidden"
            animate="visible"
            variants={stagger}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Personal details */}
            <motion.section variants={fadeUp}>
              <h2 className="font-display text-xl font-light text-white mb-5 pb-3 border-b border-[oklch(0.28_0.05_150)]">
                Your Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-[oklch(0.82_0.025_140)] font-sans text-sm font-medium"
                  >
                    Full Name{" "}
                    <span className="text-[oklch(0.62_0.12_45)]">*</span>
                  </Label>
                  <Input
                    id="name"
                    data-ocid="consult.name_input"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                    placeholder="Emma Castillo"
                    className="bg-[oklch(0.23_0.06_150)] border-[oklch(0.30_0.05_150)] text-white placeholder:text-[oklch(0.50_0.03_140)] focus:border-[oklch(0.62_0.12_45)] focus:ring-[oklch(0.62_0.12_45/0.3)] rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[oklch(0.82_0.025_140)] font-sans text-sm font-medium"
                  >
                    Email Address{" "}
                    <span className="text-[oklch(0.62_0.12_45)]">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    data-ocid="consult.email_input"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                    placeholder="emma@example.com"
                    className="bg-[oklch(0.23_0.06_150)] border-[oklch(0.30_0.05_150)] text-white placeholder:text-[oklch(0.50_0.03_140)] focus:border-[oklch(0.62_0.12_45)] focus:ring-[oklch(0.62_0.12_45/0.3)] rounded-sm"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label
                    htmlFor="phone"
                    className="text-[oklch(0.82_0.025_140)] font-sans text-sm font-medium"
                  >
                    Phone Number{" "}
                    <span className="text-[oklch(0.55_0.03_140)] font-normal text-xs">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    data-ocid="consult.phone_input"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+1 (555) 000-0000"
                    className="bg-[oklch(0.23_0.06_150)] border-[oklch(0.30_0.05_150)] text-white placeholder:text-[oklch(0.50_0.03_140)] focus:border-[oklch(0.62_0.12_45)] focus:ring-[oklch(0.62_0.12_45/0.3)] rounded-sm"
                  />
                </div>
              </div>
            </motion.section>

            {/* Balcony details */}
            <motion.section variants={fadeUp}>
              <h2 className="font-display text-xl font-light text-white mb-5 pb-3 border-b border-[oklch(0.28_0.05_150)]">
                Your Balcony
              </h2>
              <div className="grid sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label className="text-[oklch(0.82_0.025_140)] font-sans text-sm font-medium">
                    Balcony Size{" "}
                    <span className="text-[oklch(0.62_0.12_45)]">*</span>
                  </Label>
                  <Select
                    value={form.balconySize}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, balconySize: v as BalconySize }))
                    }
                    required
                  >
                    <SelectTrigger
                      data-ocid="consult.balcony_select"
                      className="bg-[oklch(0.23_0.06_150)] border-[oklch(0.30_0.05_150)] text-white focus:border-[oklch(0.62_0.12_45)] rounded-sm"
                    >
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent className="bg-[oklch(0.23_0.06_150)] border-[oklch(0.30_0.05_150)]">
                      <SelectItem
                        value={BalconySize.small}
                        className="text-white focus:bg-[oklch(0.30_0.05_150)]"
                      >
                        Small
                      </SelectItem>
                      <SelectItem
                        value={BalconySize.medium}
                        className="text-white focus:bg-[oklch(0.30_0.05_150)]"
                      >
                        Medium
                      </SelectItem>
                      <SelectItem
                        value={BalconySize.large}
                        className="text-white focus:bg-[oklch(0.30_0.05_150)]"
                      >
                        Large
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[oklch(0.82_0.025_140)] font-sans text-sm font-medium">
                    Sunlight Exposure{" "}
                    <span className="text-[oklch(0.62_0.12_45)]">*</span>
                  </Label>
                  <Select
                    value={form.sunlightExposure}
                    onValueChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        sunlightExposure: v as SunlightExposure,
                      }))
                    }
                    required
                  >
                    <SelectTrigger
                      data-ocid="consult.sunlight_select"
                      className="bg-[oklch(0.23_0.06_150)] border-[oklch(0.30_0.05_150)] text-white focus:border-[oklch(0.62_0.12_45)] rounded-sm"
                    >
                      <SelectValue placeholder="Select exposure" />
                    </SelectTrigger>
                    <SelectContent className="bg-[oklch(0.23_0.06_150)] border-[oklch(0.30_0.05_150)]">
                      <SelectItem
                        value={SunlightExposure.fullSun}
                        className="text-white focus:bg-[oklch(0.30_0.05_150)]"
                      >
                        Full Sun
                      </SelectItem>
                      <SelectItem
                        value={SunlightExposure.partialShade}
                        className="text-white focus:bg-[oklch(0.30_0.05_150)]"
                      >
                        Partial Shade
                      </SelectItem>
                      <SelectItem
                        value={SunlightExposure.fullShade}
                        className="text-white focus:bg-[oklch(0.30_0.05_150)]"
                      >
                        Full Shade
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[oklch(0.82_0.025_140)] font-sans text-sm font-medium">
                    Style Preference{" "}
                    <span className="text-[oklch(0.62_0.12_45)]">*</span>
                  </Label>
                  <Select
                    value={form.stylePreference}
                    onValueChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        stylePreference: v as StylePreference,
                      }))
                    }
                    required
                  >
                    <SelectTrigger
                      data-ocid="consult.style_select"
                      className="bg-[oklch(0.23_0.06_150)] border-[oklch(0.30_0.05_150)] text-white focus:border-[oklch(0.62_0.12_45)] rounded-sm"
                    >
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent className="bg-[oklch(0.23_0.06_150)] border-[oklch(0.30_0.05_150)]">
                      <SelectItem
                        value={StylePreference.modern}
                        className="text-white focus:bg-[oklch(0.30_0.05_150)]"
                      >
                        Modern
                      </SelectItem>
                      <SelectItem
                        value={StylePreference.natural}
                        className="text-white focus:bg-[oklch(0.30_0.05_150)]"
                      >
                        Natural
                      </SelectItem>
                      <SelectItem
                        value={StylePreference.tropical}
                        className="text-white focus:bg-[oklch(0.30_0.05_150)]"
                      >
                        Tropical
                      </SelectItem>
                      <SelectItem
                        value={StylePreference.minimalist}
                        className="text-white focus:bg-[oklch(0.30_0.05_150)]"
                      >
                        Minimalist
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.section>

            {/* Message */}
            <motion.section variants={fadeUp}>
              <h2 className="font-display text-xl font-light text-white mb-5 pb-3 border-b border-[oklch(0.28_0.05_150)]">
                Additional Details
              </h2>
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-[oklch(0.82_0.025_140)] font-sans text-sm font-medium"
                >
                  Message{" "}
                  <span className="text-[oklch(0.55_0.03_140)] font-normal text-xs">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="message"
                  data-ocid="consult.message_textarea"
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  rows={5}
                  placeholder="Tell us anything else about your space, style preferences, or what you're hoping to achieve..."
                  className="bg-[oklch(0.23_0.06_150)] border-[oklch(0.30_0.05_150)] text-white placeholder:text-[oklch(0.50_0.03_140)] focus:border-[oklch(0.62_0.12_45)] focus:ring-[oklch(0.62_0.12_45/0.3)] rounded-sm resize-none"
                />
              </div>
            </motion.section>

            {/* Error */}
            {isError && (
              <motion.div
                data-ocid="consult.error_state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-sm p-4"
              >
                <AlertCircle
                  size={18}
                  className="text-destructive shrink-0 mt-0.5"
                />
                <p className="text-destructive text-sm font-sans">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."}
                </p>
              </motion.div>
            )}

            {/* Submit */}
            <motion.div variants={fadeUp} className="pt-2">
              <Button
                type="submit"
                data-ocid="consult.submit_button"
                disabled={
                  isPending ||
                  !form.name ||
                  !form.email ||
                  !form.balconySize ||
                  !form.sunlightExposure ||
                  !form.stylePreference
                }
                className="w-full bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold py-6 text-base rounded-sm tracking-wide transition-all duration-300 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    <span data-ocid="consult.loading_state">Submitting...</span>
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
              <p className="text-center text-xs text-[oklch(0.55_0.03_140)] mt-3 font-sans">
                Free consultation · No commitment required
              </p>
            </motion.div>
          </motion.form>
        )}

        {/* ── Trust sidebar (desktop only) ─────────────────────── */}
        <aside className="hidden lg:block space-y-5 sticky top-24">
          {/* Why consult block */}
          <div className="bg-[oklch(0.23_0.06_150)] border border-[oklch(0.30_0.05_150)] rounded-sm p-6">
            <h3 className="font-display text-xl font-light text-white mb-4">
              What to expect
            </h3>
            <ul className="space-y-4">
              {[
                {
                  icon: "🌿",
                  title: "Free Assessment",
                  desc: "No charges for your initial consultation.",
                },
                {
                  icon: "📐",
                  title: "Custom Design",
                  desc: "A layout plan tailored to your balcony.",
                },
                {
                  icon: "🪴",
                  title: "Expert Curation",
                  desc: "Plants matched to your light and style.",
                },
                {
                  icon: "🚚",
                  title: "Full Installation",
                  desc: "Delivered and set up by our team.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-[oklch(0.88_0.025_140)] font-sans text-sm font-semibold leading-snug">
                      {item.title}
                    </p>
                    <p className="text-[oklch(0.62_0.03_140)] font-sans text-xs leading-snug mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quote */}
          <div className="bg-[oklch(0.62_0.12_45/0.1)] border border-[oklch(0.62_0.12_45/0.3)] rounded-sm p-6">
            <p className="font-display text-lg italic font-light text-[oklch(0.88_0.025_140)] leading-snug mb-3">
              "Every great balcony starts with one conversation."
            </p>
            <p className="text-xs text-[oklch(0.60_0.04_45)] font-sans tracking-wider uppercase">
              — Vantage Root
            </p>
          </div>

          {/* Contact */}
          <div className="border border-[oklch(0.28_0.05_150)] rounded-sm p-5">
            <p className="text-xs text-[oklch(0.60_0.03_140)] font-sans uppercase tracking-widest mb-2">
              Prefer email?
            </p>
            <a
              href="mailto:hello@vantageroot.co"
              className="text-[oklch(0.62_0.12_45)] font-sans text-sm hover:underline"
            >
              hello@vantageroot.co
            </a>
          </div>
        </aside>
      </div>

      {/* Footer strip */}
      <div className="border-t border-[oklch(0.25_0.05_150)] py-6 px-6 mt-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[oklch(0.48_0.025_140)]">
          <p>© {new Date().getFullYear()} Vantage Root. All rights reserved.</p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[oklch(0.62_0.12_45)] transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
