import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Leaf,
  Loader2,
  MapPin,
  Package,
  ShieldCheck,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { VendorApplicationFormData } from "../hooks/useQueries";
import { useSubmitVendorApplication } from "../hooks/useQueries";

/* ─── Animations ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Benefits ────────────────────────────────────────── */
const benefits = [
  {
    icon: Users,
    title: "Reach Thousands of Customers",
    desc: "Get your products in front of urban gardening enthusiasts actively looking to buy.",
  },
  {
    icon: Store,
    title: "No Upfront Cost",
    desc: "Join the platform at zero cost. We only grow when you grow.",
  },
  {
    icon: Package,
    title: "Easy Listing Management",
    desc: "Intuitive tools to add, update, and manage your product catalog effortlessly.",
  },
];

/* ─── Business types ──────────────────────────────────── */
const BUSINESS_TYPES = [
  "Retailer",
  "Wholesaler",
  "Nursery",
  "Manufacturer",
  "Distributor",
];

/* ─── Product categories ──────────────────────────────── */
const PRODUCT_CATEGORIES = [
  "Pots & Planters",
  "Indoor Plants",
  "Outdoor Plants",
  "Seeds",
  "Gardening Tools",
  "Decor & Accessories",
];

const INITIAL_FORM: VendorApplicationFormData = {
  businessName: "",
  businessType: "",
  yearsInBusiness: "",
  businessDescription: "",
  ownerName: "",
  email: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  productTypes: "",
  categories: "",
  approxProducts: "",
  gstNumber: "",
  offersShipping: false,
  offersLocalDelivery: false,
  serviceableAreas: "",
};

/* ─── Section header ─────────────────────────────────── */
function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[oklch(0.28_0.05_150)]">
      <div className="w-8 h-8 rounded-sm bg-[oklch(0.62_0.12_45/0.15)] border border-[oklch(0.62_0.12_45/0.3)] flex items-center justify-center">
        <Icon size={15} className="text-[oklch(0.70_0.10_45)]" />
      </div>
      <h3 className="font-display text-xl font-light text-white">{title}</h3>
    </div>
  );
}

/* ─── Field wrapper ──────────────────────────────────── */
function FieldGroup({
  label,
  htmlFor,
  required = true,
  optional = false,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-[oklch(0.78_0.04_140)] font-sans text-sm"
      >
        {label}
        {required && !optional && (
          <span className="text-[oklch(0.62_0.12_45)] ml-0.5">*</span>
        )}
        {optional && (
          <span className="text-[oklch(0.50_0.03_140)] ml-1 text-xs font-normal">
            (optional)
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}

const INPUT_CLS =
  "bg-[oklch(0.22_0.055_150)] border-[oklch(0.32_0.05_150)] text-white placeholder:text-[oklch(0.42_0.03_140)] focus:border-[oklch(0.62_0.12_45)] rounded-sm font-sans text-sm";

export default function SellWithUsPage() {
  const [form, setForm] = useState<VendorApplicationFormData>(INITIAL_FORM);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useSubmitVendorApplication();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  }

  function handleCategoryToggle(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.businessName.trim()) {
      setFormError("Business name is required.");
      return;
    }
    if (!form.businessType) {
      setFormError("Please select a business type.");
      return;
    }
    if (!form.ownerName.trim()) {
      setFormError("Owner name is required.");
      return;
    }
    if (!form.email.trim()) {
      setFormError("Email address is required.");
      return;
    }
    if (!form.phone.trim()) {
      setFormError("Phone number is required.");
      return;
    }
    if (!form.addressLine.trim() || !form.city.trim() || !form.country.trim()) {
      setFormError("Address, city and country are required.");
      return;
    }
    if (!agreed) {
      setFormError("You must agree to the vendor terms to proceed.");
      return;
    }

    const payload: VendorApplicationFormData = {
      ...form,
      categories: selectedCategories.join(", "),
    };

    const result = await submitMutation.mutateAsync(payload).catch((err) => {
      setFormError(
        err instanceof Error ? err.message : "Submission failed. Try again.",
      );
      return null;
    });

    if (!result) return;

    if (result.__kind__ === "err") {
      setFormError(result.err);
    } else {
      setSubmitted(true);
    }
  }

  return (
    <div className="min-h-screen bg-[oklch(0.18_0.055_150)] pt-16">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden bg-[oklch(0.14_0.04_150)]">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[oklch(0.62_0.12_45/0.06)] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[oklch(0.35_0.09_140/0.08)] blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[oklch(0.60_0.03_140)] hover:text-[oklch(0.62_0.12_45)] text-sm font-sans transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-[oklch(0.62_0.12_45)] font-sans text-sm font-semibold tracking-[0.2em] uppercase mb-5"
            >
              Become a Verified Partner
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-white leading-[1.08] tracking-tight mb-6"
            >
              Partner With
              <span className="block italic text-[oklch(0.78_0.06_140)]">
                Plantly
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-sans text-[oklch(0.72_0.04_140)] text-lg leading-relaxed mb-12 max-w-2xl"
            >
              Join our growing marketplace as a verified vendor. Whether you're
              a nursery, retailer, wholesaler, or artisan planter maker —
              Plantly connects your products with thousands of urban plant
              lovers.
            </motion.p>

            {/* Benefits */}
            <motion.div
              variants={stagger}
              className="grid sm:grid-cols-3 gap-5"
            >
              {benefits.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="flex flex-col gap-3 p-5 bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm hover:border-[oklch(0.42_0.08_150)] transition-colors duration-300"
                >
                  <div className="w-9 h-9 rounded-sm bg-[oklch(0.62_0.12_45/0.12)] border border-[oklch(0.62_0.12_45/0.2)] flex items-center justify-center">
                    <Icon size={16} className="text-[oklch(0.70_0.10_45)]" />
                  </div>
                  <div>
                    <p className="text-white font-sans text-sm font-semibold mb-1">
                      {title}
                    </p>
                    <p className="text-[oklch(0.58_0.03_140)] font-sans text-xs leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Form / Success ───────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {submitted ? (
            /* Success state */
            <motion.div
              data-ocid="vendor.success_state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-16 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[oklch(0.42_0.12_145/0.2)] border border-[oklch(0.50_0.12_145/0.4)] flex items-center justify-center mb-6">
                <CheckCircle2
                  size={36}
                  className="text-[oklch(0.70_0.10_145)]"
                />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-white mb-3">
                Application Submitted!
              </h2>
              <p className="text-[oklch(0.68_0.04_140)] font-sans text-base leading-relaxed max-w-md mb-8">
                Thank you for applying to become a Plantly vendor. We'll review
                your application and contact you within{" "}
                <strong className="text-white">3–5 business days</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm"
                >
                  <Link to="/">Back to Home</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm(INITIAL_FORM);
                    setSelectedCategories([]);
                    setAgreed(false);
                    setSubmitted(false);
                    setFormError("");
                  }}
                  className="border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] bg-transparent hover:bg-[oklch(0.23_0.06_150)] hover:text-white rounded-sm font-sans"
                >
                  Submit Another Application
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Form */
            <motion.form
              data-ocid="vendor.form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              <div className="mb-2">
                <h2 className="font-display text-3xl font-light text-white mb-1">
                  Vendor Registration
                </h2>
                <p className="text-[oklch(0.58_0.03_140)] font-sans text-sm">
                  All fields marked with{" "}
                  <span className="text-[oklch(0.62_0.12_45)]">*</span> are
                  required.
                </p>
              </div>

              {/* ── Section 1: Business Information ────────── */}
              <div className="bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm p-6 md:p-8 space-y-5">
                <SectionHeader icon={Building2} title="Business Information" />

                <FieldGroup label="Business Name" htmlFor="businessName">
                  <Input
                    id="businessName"
                    name="businessName"
                    data-ocid="vendor.businessName.input"
                    placeholder="e.g. Green Leaf Nursery"
                    value={form.businessName}
                    onChange={handleChange}
                    required
                    className={INPUT_CLS}
                  />
                </FieldGroup>

                <FieldGroup label="Business Type" htmlFor="businessType">
                  <Select
                    value={form.businessType}
                    onValueChange={(val) => {
                      setForm((prev) => ({ ...prev, businessType: val }));
                      setFormError("");
                    }}
                  >
                    <SelectTrigger
                      id="businessType"
                      data-ocid="vendor.businessType.select"
                      className={`${INPUT_CLS} w-full`}
                    >
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[oklch(0.22_0.055_150)] border-[oklch(0.32_0.05_150)] text-white">
                      {BUSINESS_TYPES.map((bt) => (
                        <SelectItem
                          key={bt}
                          value={bt}
                          className="focus:bg-[oklch(0.30_0.07_150)] focus:text-white font-sans text-sm"
                        >
                          {bt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>

                <div className="grid sm:grid-cols-2 gap-5">
                  <FieldGroup
                    label="Years in Business"
                    htmlFor="yearsInBusiness"
                  >
                    <Input
                      id="yearsInBusiness"
                      name="yearsInBusiness"
                      placeholder="e.g. 5"
                      value={form.yearsInBusiness}
                      onChange={handleChange}
                      required
                      className={INPUT_CLS}
                    />
                  </FieldGroup>
                </div>

                <FieldGroup
                  label="Business Description"
                  htmlFor="businessDescription"
                >
                  <Textarea
                    id="businessDescription"
                    name="businessDescription"
                    placeholder="Describe your business, what you sell, your specialties..."
                    value={form.businessDescription}
                    onChange={handleChange}
                    required
                    rows={4}
                    className={`${INPUT_CLS} resize-none`}
                  />
                </FieldGroup>
              </div>

              {/* ── Section 2: Contact Details ──────────────── */}
              <div className="bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm p-6 md:p-8 space-y-5">
                <SectionHeader icon={Users} title="Contact Details" />

                <FieldGroup label="Owner Name" htmlFor="ownerName">
                  <Input
                    id="ownerName"
                    name="ownerName"
                    data-ocid="vendor.ownerName.input"
                    placeholder="Full name of business owner"
                    value={form.ownerName}
                    onChange={handleChange}
                    required
                    className={INPUT_CLS}
                  />
                </FieldGroup>

                <div className="grid sm:grid-cols-2 gap-5">
                  <FieldGroup label="Email Address" htmlFor="vendorEmail">
                    <Input
                      id="vendorEmail"
                      name="email"
                      data-ocid="vendor.email.input"
                      type="email"
                      placeholder="owner@yourbusiness.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className={INPUT_CLS}
                    />
                  </FieldGroup>

                  <FieldGroup label="Phone Number" htmlFor="vendorPhone">
                    <Input
                      id="vendorPhone"
                      name="phone"
                      data-ocid="vendor.phone.input"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className={INPUT_CLS}
                    />
                  </FieldGroup>
                </div>
              </div>

              {/* ── Section 3: Location ─────────────────────── */}
              <div className="bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm p-6 md:p-8 space-y-5">
                <SectionHeader icon={MapPin} title="Location" />

                <FieldGroup label="Full Business Address" htmlFor="addressLine">
                  <Input
                    id="addressLine"
                    name="addressLine"
                    placeholder="Street address, area, landmark..."
                    value={form.addressLine}
                    onChange={handleChange}
                    required
                    className={INPUT_CLS}
                  />
                </FieldGroup>

                <div className="grid sm:grid-cols-2 gap-5">
                  <FieldGroup label="City" htmlFor="vendorCity">
                    <Input
                      id="vendorCity"
                      name="city"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className={INPUT_CLS}
                    />
                  </FieldGroup>

                  <FieldGroup label="State" htmlFor="vendorState">
                    <Input
                      id="vendorState"
                      name="state"
                      placeholder="Maharashtra"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className={INPUT_CLS}
                    />
                  </FieldGroup>

                  <FieldGroup label="Country" htmlFor="vendorCountry">
                    <Input
                      id="vendorCountry"
                      name="country"
                      placeholder="India"
                      value={form.country}
                      onChange={handleChange}
                      required
                      className={INPUT_CLS}
                    />
                  </FieldGroup>

                  <FieldGroup label="Pincode" htmlFor="vendorPincode">
                    <Input
                      id="vendorPincode"
                      name="pincode"
                      placeholder="400001"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      className={INPUT_CLS}
                    />
                  </FieldGroup>
                </div>
              </div>

              {/* ── Section 4: Products ─────────────────────── */}
              <div className="bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm p-6 md:p-8 space-y-5">
                <SectionHeader icon={Package} title="Product Information" />

                <FieldGroup
                  label="Types of Products Sold"
                  htmlFor="productTypes"
                >
                  <Textarea
                    id="productTypes"
                    name="productTypes"
                    placeholder="Describe the products you sell (e.g. indoor tropical plants, handmade terracotta pots, organic seeds...)"
                    value={form.productTypes}
                    onChange={handleChange}
                    required
                    rows={3}
                    className={`${INPUT_CLS} resize-none`}
                  />
                </FieldGroup>

                <div className="space-y-2">
                  <Label className="text-[oklch(0.78_0.04_140)] font-sans text-sm">
                    Product Categories{" "}
                    <span className="text-[oklch(0.62_0.12_45)]">*</span>
                  </Label>
                  <p className="text-[oklch(0.50_0.03_140)] text-xs font-sans">
                    Select all categories that apply to your products.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {PRODUCT_CATEGORIES.map((cat) => {
                      const catId = `cat-${cat.replace(/\W+/g, "-").toLowerCase()}`;
                      return (
                        <label
                          key={cat}
                          htmlFor={catId}
                          className="flex items-center gap-3 p-3 rounded-sm bg-[oklch(0.18_0.055_150)] border border-[oklch(0.28_0.05_150)] hover:border-[oklch(0.40_0.08_150)] cursor-pointer transition-colors group"
                        >
                          <Checkbox
                            id={catId}
                            checked={selectedCategories.includes(cat)}
                            onCheckedChange={() => handleCategoryToggle(cat)}
                            className="border-[oklch(0.40_0.05_150)] data-[state=checked]:bg-[oklch(0.62_0.12_45)] data-[state=checked]:border-[oklch(0.62_0.12_45)]"
                          />
                          <span className="text-[oklch(0.75_0.04_140)] group-hover:text-white text-xs font-sans transition-colors">
                            {cat}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <FieldGroup
                  label="Approximate Number of Products"
                  htmlFor="approxProducts"
                >
                  <Input
                    id="approxProducts"
                    name="approxProducts"
                    placeholder="e.g. 50–100 SKUs"
                    value={form.approxProducts}
                    onChange={handleChange}
                    required
                    className={INPUT_CLS}
                  />
                </FieldGroup>
              </div>

              {/* ── Section 5: Business Verification ─────────── */}
              <div className="bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm p-6 md:p-8 space-y-5">
                <SectionHeader
                  icon={ShieldCheck}
                  title="Business Verification"
                />

                <FieldGroup label="GST Number" htmlFor="gstNumber" optional>
                  <Input
                    id="gstNumber"
                    name="gstNumber"
                    placeholder="e.g. 27AABCU9603R1ZX"
                    value={form.gstNumber}
                    onChange={handleChange}
                    className={INPUT_CLS}
                  />
                </FieldGroup>
              </div>

              {/* ── Section 6: Logistics ────────────────────── */}
              <div className="bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm p-6 md:p-8 space-y-5">
                <SectionHeader icon={Truck} title="Logistics" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[oklch(0.18_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm">
                    <div>
                      <p className="text-white font-sans text-sm font-medium">
                        Offer Shipping
                      </p>
                      <p className="text-[oklch(0.52_0.03_140)] font-sans text-xs mt-0.5">
                        Can you ship products to customers nationwide?
                      </p>
                    </div>
                    <Switch
                      checked={form.offersShipping}
                      onCheckedChange={(val) =>
                        setForm((prev) => ({ ...prev, offersShipping: val }))
                      }
                      className="data-[state=checked]:bg-[oklch(0.62_0.12_45)]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[oklch(0.18_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm">
                    <div>
                      <p className="text-white font-sans text-sm font-medium">
                        Offer Local Delivery
                      </p>
                      <p className="text-[oklch(0.52_0.03_140)] font-sans text-xs mt-0.5">
                        Can you deliver within your city or region?
                      </p>
                    </div>
                    <Switch
                      checked={form.offersLocalDelivery}
                      onCheckedChange={(val) =>
                        setForm((prev) => ({
                          ...prev,
                          offersLocalDelivery: val,
                        }))
                      }
                      className="data-[state=checked]:bg-[oklch(0.62_0.12_45)]"
                    />
                  </div>
                </div>

                <FieldGroup
                  label="Serviceable Areas"
                  htmlFor="serviceableAreas"
                >
                  <Textarea
                    id="serviceableAreas"
                    name="serviceableAreas"
                    placeholder="List cities, states, or regions you can serve..."
                    value={form.serviceableAreas}
                    onChange={handleChange}
                    required
                    rows={3}
                    className={`${INPUT_CLS} resize-none`}
                  />
                </FieldGroup>
              </div>

              {/* ── Section 7: Agreement ─────────────────────── */}
              <div className="bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm p-6 md:p-8">
                <SectionHeader icon={BadgeCheck} title="Agreement" />

                <label
                  htmlFor="vendor-agreement"
                  className="flex items-start gap-4 cursor-pointer group"
                >
                  <Checkbox
                    id="vendor-agreement"
                    checked={agreed}
                    onCheckedChange={(val) => {
                      setAgreed(!!val);
                      setFormError("");
                    }}
                    className="mt-0.5 border-[oklch(0.40_0.05_150)] data-[state=checked]:bg-[oklch(0.62_0.12_45)] data-[state=checked]:border-[oklch(0.62_0.12_45)]"
                  />
                  <span className="text-[oklch(0.72_0.04_140)] font-sans text-sm leading-relaxed group-hover:text-[oklch(0.85_0.04_140)] transition-colors">
                    I agree to Plantly's{" "}
                    <span className="text-[oklch(0.62_0.12_45)] underline underline-offset-2">
                      vendor terms
                    </span>{" "}
                    and{" "}
                    <span className="text-[oklch(0.62_0.12_45)] underline underline-offset-2">
                      partnership policies
                    </span>
                    . I confirm that all the information provided is accurate
                    and up to date.
                  </span>
                </label>
              </div>

              {/* ── Error ────────────────────────────────────── */}
              {formError && (
                <p
                  data-ocid="vendor.error_state"
                  className="flex items-center gap-2 text-[oklch(0.68_0.15_25)] font-sans text-sm px-4 py-3 bg-[oklch(0.25_0.08_25/0.2)] border border-[oklch(0.45_0.15_25/0.35)] rounded-sm"
                >
                  {formError}
                </p>
              )}

              {/* ── Submit ───────────────────────────────────── */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] bg-transparent hover:bg-[oklch(0.23_0.06_150)] hover:text-white rounded-sm font-sans"
                >
                  <Link to="/">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  data-ocid="vendor.submit_button"
                  disabled={submitMutation.isPending}
                  className="bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm px-8 min-w-[180px]"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Leaf size={15} className="mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
}
