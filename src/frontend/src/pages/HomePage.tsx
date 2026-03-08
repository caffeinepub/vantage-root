import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  Building2,
  CheckCircle2,
  Flower2,
  Leaf,
  Palette,
  Sprout,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

import balconyTransform from "../../public/assets/generated/balcony-transform.dim_800x600.jpg";
import florilicLogo from "../../public/assets/generated/florilic-logo-white-transparent.dim_800x200.png";
import heroBg from "../../public/assets/generated/hero-balcony.dim_1600x900.jpg";
import plantersCollection from "../../public/assets/generated/planters-collection.dim_800x600.jpg";
import plantsShowcase from "../../public/assets/generated/plants-showcase.dim_800x600.jpg";

/* ─── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Pain points ────────────────────────────────────────── */
const painPoints = [
  { icon: "🌫️", text: "Wrong plants for your light conditions" },
  { icon: "🪣", text: "Mismatched pots that clash visually" },
  { icon: "🌿", text: "Overcrowded, cluttered arrangements" },
  { icon: "🔆", text: "Poor placement and sunlight management" },
  { icon: "🎨", text: "No cohesive design vision" },
];

/* ─── Services ───────────────────────────────────────────── */
const services = [
  {
    icon: Sprout,
    title: "Balcony Landscaping",
    desc: "End-to-end design and installation. We assess your space, plan the layout, source the plants, and transform your balcony from empty to extraordinary.",
    tag: "Full Service",
  },
  {
    icon: Flower2,
    title: "Designer Planter Systems",
    desc: "Matte ceramic, terracotta, minimalist cement, and artist-finished pots — each selected to create a unified visual language across your balcony.",
    tag: "Premium Planters",
  },
  {
    icon: Leaf,
    title: "Curated Plant Selection",
    desc: "Every plant is matched to your balcony's sunlight, size, and aesthetic. Low maintenance, high visual impact — chosen by experts.",
    tag: "Expert Curation",
  },
];

/* ─── Steps ──────────────────────────────────────────────── */
const steps = [
  {
    num: "01",
    title: "Space Assessment",
    desc: "We evaluate your balcony's dimensions, sunlight levels, railing structure, and available floor space to determine the ideal design approach.",
  },
  {
    num: "02",
    title: "Layout Planning",
    desc: "A layered greenery plan is designed — corner clusters, railing plants, floor planters — creating visual balance and depth without clutter.",
  },
  {
    num: "03",
    title: "Plant & Planter Selection",
    desc: "Plants and containers are chosen to match your space's light conditions and your preferred visual theme — modern, natural, tropical, or minimalist.",
  },
  {
    num: "04",
    title: "Installation",
    desc: "Our team delivers, fills, and places every planter according to the layout plan. You walk out to a transformed balcony, ready to enjoy.",
  },
];

/* ─── Plants ─────────────────────────────────────────────── */
const plants = [
  "Snake Plant",
  "Jade Plant",
  "Ferns",
  "Money Plant",
  "Areca Palm",
  "Succulents",
];

/* ─── Planter styles ─────────────────────────────────────── */
const planterStyles = [
  {
    name: "Matte Ceramic",
    desc: "Refined, modern, weightless finish",
  },
  {
    name: "Terracotta",
    desc: "Warm, earthy, timeless character",
  },
  {
    name: "Minimalist Cement",
    desc: "Raw, architectural, sculptural form",
  },
  {
    name: "Artist-Finished",
    desc: "Handcrafted, expressive, one-of-a-kind",
  },
];

/* ─── Who we serve ───────────────────────────────────────── */
const customers = [
  {
    Icon: Users,
    title: "Apartment Residents",
    desc: "Urban dwellers who want a beautiful, curated balcony without the guesswork. We handle everything — from design to installation.",
  },
  {
    Icon: Palette,
    title: "Interior Designers",
    desc: "Design professionals seeking bespoke plant styling, curated pots, and balcony greenery setups to complete residential and commercial projects.",
  },
  {
    Icon: Building2,
    title: "Real Estate Developers",
    desc: "Builders and developers who want to market their properties as green, eco-conscious spaces by installing plant systems before handover.",
  },
];

export default function HomePage() {
  const servicesRef = useRef<HTMLElement>(null);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-background">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.12_0.04_150/0.75)] via-[oklch(0.12_0.04_150/0.6)] to-[oklch(0.12_0.04_150/0.85)]" />

        {/* Decorative botanical SVG watermark — bottom-left */}
        <svg
          className="absolute bottom-0 left-0 w-80 h-80 opacity-10 pointer-events-none"
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M40 280 C40 280 60 200 120 160 C180 120 200 60 160 20"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M120 160 C80 140 40 160 20 200"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M120 160 C140 120 180 100 200 120"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <ellipse
            cx="160"
            cy="20"
            rx="20"
            ry="30"
            fill="white"
            opacity="0.6"
            transform="rotate(-20 160 20)"
          />
          <ellipse
            cx="20"
            cy="200"
            rx="15"
            ry="22"
            fill="white"
            opacity="0.4"
            transform="rotate(30 20 200)"
          />
          <ellipse
            cx="200"
            cy="120"
            rx="18"
            ry="26"
            fill="white"
            opacity="0.4"
            transform="rotate(-40 200 120)"
          />
          <circle cx="40" cy="280" r="8" fill="white" opacity="0.5" />
        </svg>

        {/* Decorative botanical SVG — top-right */}
        <svg
          className="absolute top-16 right-0 w-64 h-64 opacity-10 pointer-events-none"
          viewBox="0 0 256 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M256 40 C200 60 160 100 140 160 C120 220 140 256 160 256"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M140 160 C180 150 210 120 220 80"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M140 160 C100 170 70 200 80 240"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <ellipse
            cx="220"
            cy="80"
            rx="22"
            ry="32"
            fill="white"
            opacity="0.5"
            transform="rotate(20 220 80)"
          />
          <ellipse
            cx="80"
            cy="240"
            rx="14"
            ry="20"
            fill="white"
            opacity="0.4"
            transform="rotate(-15 80 240)"
          />
        </svg>

        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block text-[oklch(0.62_0.12_45)] font-sans text-sm font-semibold tracking-[0.2em] uppercase mb-6"
          >
            Urban Balcony Landscaping
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] tracking-tight mb-6"
          >
            Transform Your Balcony
            <span className="block italic text-[oklch(0.88_0.04_140)] mt-1">
              Into a Living Green Space
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-sans text-lg md:text-xl text-[oklch(0.82_0.025_140)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Bespoke balcony landscaping designed for modern city living. Curated
            plants, designer planters, professional installation.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              data-ocid="hero.primary_button"
              size="lg"
              className="bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold px-8 py-6 text-base rounded-sm tracking-wide shadow-xl transition-all duration-300"
            >
              <Link to="/consult">Book a Free Consultation</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              data-ocid="hero.secondary_button"
              onClick={scrollToServices}
              className="border-white/40 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-6 text-base rounded-sm tracking-wide backdrop-blur-sm transition-all duration-300"
            >
              See Our Work
              <ArrowDown size={16} className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          <ArrowDown size={20} className="text-white/50" />
        </motion.div>
      </section>

      {/* ── Problem / Value Prop ───────────────────────────────── */}
      <section className="bg-[oklch(0.18_0.055_150)] py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            {/* Left: pain points */}
            <div>
              <motion.span
                variants={fadeUp}
                className="inline-block text-[oklch(0.62_0.12_45)] text-sm font-semibold tracking-[0.2em] uppercase mb-4"
              >
                The Problem
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="font-display text-4xl md:text-5xl font-light text-white leading-tight mb-8"
              >
                Most balconies remain
                <em className="block italic text-[oklch(0.70_0.06_140)]">
                  unused potential
                </em>
              </motion.h2>
              <motion.ul variants={stagger} className="space-y-4">
                {painPoints.map((p) => (
                  <motion.li
                    key={p.text}
                    variants={fadeUp}
                    className="flex items-start gap-4 p-4 rounded-sm bg-[oklch(0.23_0.06_150)] border border-[oklch(0.30_0.05_150)]"
                  >
                    <span className="text-2xl mt-0.5">{p.icon}</span>
                    <span className="text-[oklch(0.82_0.025_140)] font-sans text-base leading-snug">
                      {p.text}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Right: solution */}
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-[oklch(0.62_0.12_45/0.12)] blur-2xl" />
              <div className="relative bg-gradient-to-br from-[oklch(0.28_0.07_150)] to-[oklch(0.22_0.06_150)] border border-[oklch(0.35_0.06_150)] rounded-sm p-6 md:p-10">
                <span className="block text-[oklch(0.62_0.12_45)] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                  The Florilic Solution
                </span>
                <p className="font-display text-3xl font-light text-white leading-tight mb-6">
                  One call. One design.
                  <em className="block italic text-[oklch(0.88_0.04_140)] mt-1">
                    One stunning balcony.
                  </em>
                </p>
                <p className="font-sans text-[oklch(0.72_0.04_140)] leading-relaxed mb-6">
                  We handle every detail — from assessing your light conditions
                  to selecting plants and planters that work together
                  beautifully. You receive a professionally designed, fully
                  installed green space tailored to your home.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "Sunlight-matched plant selection",
                    "Cohesive designer planter system",
                    "Professionally planned layout",
                    "Full delivery and installation",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2
                        size={16}
                        className="text-[oklch(0.62_0.12_45)] shrink-0"
                      />
                      <span className="text-[oklch(0.82_0.025_140)] text-sm font-sans">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────── */}
      <section
        id="services"
        ref={servicesRef}
        className="py-20 md:py-28 px-6 bg-background"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-14"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-[oklch(0.62_0.12_45)] text-sm font-semibold tracking-[0.2em] uppercase mb-4"
            >
              What We Do
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-5xl md:text-6xl font-light text-foreground leading-tight"
            >
              Services built around
              <em className="block italic text-[oklch(0.45_0.09_140)]">
                your space
              </em>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {services.map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                className="group relative bg-card border border-border rounded-sm p-8 hover:border-[oklch(0.45_0.09_140)] transition-colors duration-300 overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[oklch(0.62_0.12_45)] to-[oklch(0.45_0.09_140)] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="w-12 h-12 rounded-sm bg-[oklch(0.88_0.04_140)] flex items-center justify-center mb-6">
                  <s.icon size={22} className="text-[oklch(0.25_0.075_155)]" />
                </div>
                <span className="inline-block text-[oklch(0.62_0.12_45)] text-xs font-semibold tracking-widest uppercase mb-3">
                  {s.tag}
                </span>
                <h3 className="font-display text-2xl font-light text-foreground mb-3">
                  {s.title}
                </h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-20 md:py-28 px-6 bg-[oklch(0.18_0.055_150)]"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-[oklch(0.62_0.12_45)] text-sm font-semibold tracking-[0.2em] uppercase mb-4"
            >
              The Process
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-5xl md:text-6xl font-light text-white leading-tight"
            >
              Four steps to a
              <em className="block italic text-[oklch(0.88_0.04_140)]">
                transformed balcony
              </em>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="relative w-full max-w-2xl"
          >
            {/* Vertical timeline spine */}
            <div className="absolute left-[2.35rem] top-10 bottom-10 w-px bg-gradient-to-b from-[oklch(0.62_0.12_45/0.6)] via-[oklch(0.45_0.09_140/0.4)] to-transparent hidden md:block" />

            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="group relative flex gap-4 md:gap-8 mb-10 last:mb-0"
              >
                {/* Number bubble */}
                <div className="relative z-10 shrink-0 w-[4.7rem] h-[4.7rem] rounded-full bg-[oklch(0.22_0.06_150)] border border-[oklch(0.62_0.12_45/0.4)] flex items-center justify-center group-hover:border-[oklch(0.62_0.12_45)] transition-colors duration-300">
                  <span className="font-display text-2xl font-light text-[oklch(0.62_0.12_45)] select-none">
                    {step.num}
                  </span>
                </div>

                {/* Content card */}
                <div
                  className={`flex-1 bg-[oklch(0.23_0.06_150)] border border-[oklch(0.30_0.05_150)] rounded-sm p-6 hover:border-[oklch(0.45_0.09_140/0.6)] transition-colors duration-300 ${idx === 0 ? "mt-2" : ""}`}
                >
                  <h3 className="font-display text-2xl font-light text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[oklch(0.72_0.04_140)] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Plants Showcase ────────────────────────────────────── */}
      <section id="plants" className="py-20 md:py-28 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
          >
            {/* Image */}
            <motion.div
              variants={fadeUp}
              className="relative order-2 md:order-1"
            >
              <div className="absolute -inset-4 bg-[oklch(0.88_0.04_140/0.3)] rounded-sm blur-xl" />
              <img
                src={plantsShowcase}
                alt="Curated plant selection"
                className="relative w-full h-80 md:h-96 object-cover rounded-sm shadow-2xl"
                loading="lazy"
              />
            </motion.div>

            {/* Text */}
            <motion.div variants={stagger} className="order-1 md:order-2">
              <motion.span
                variants={fadeUp}
                className="inline-block text-[oklch(0.62_0.12_45)] text-sm font-semibold tracking-[0.2em] uppercase mb-4"
              >
                Plant Curation
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight mb-6"
              >
                Plants chosen for
                <em className="block italic text-[oklch(0.45_0.09_140)]">
                  where they'll thrive
                </em>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="font-sans text-muted-foreground leading-relaxed mb-8"
              >
                Every plant in our selection is resilient in balcony
                environments, visually striking, and manageable without a green
                thumb. We match plants to your sunlight, maintenance
                preferences, and aesthetic.
              </motion.p>
              <motion.div
                variants={stagger}
                className="flex flex-wrap gap-3 mb-6"
              >
                {plants.map((plant) => (
                  <motion.span
                    key={plant}
                    variants={fadeUp}
                    className="px-4 py-2 bg-[oklch(0.88_0.04_140)] text-[oklch(0.25_0.075_155)] text-sm font-semibold rounded-full font-sans border border-[oklch(0.80_0.05_140)] hover:bg-[oklch(0.62_0.12_45)] hover:text-white hover:border-[oklch(0.62_0.12_45)] transition-colors duration-200 cursor-default"
                  >
                    {plant}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <CheckCircle2
                  size={16}
                  className="text-[oklch(0.45_0.09_140)] shrink-0"
                />
                <span>
                  Selected for sunlight, size, and low maintenance requirements
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Planter Styles ────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-[oklch(0.95_0.010_85)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
          >
            {/* Text */}
            <motion.div variants={stagger}>
              <motion.span
                variants={fadeUp}
                className="inline-block text-[oklch(0.62_0.12_45)] text-sm font-semibold tracking-[0.2em] uppercase mb-4"
              >
                Designer Planters
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight mb-6"
              >
                A consistent
                <em className="block italic text-[oklch(0.45_0.09_140)]">
                  design language
                </em>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="font-sans text-muted-foreground leading-relaxed mb-10"
              >
                No mismatched nursery pots. Each installation uses a curated
                planter system that creates visual harmony — every container
                chosen to complement the others and the home's architectural
                style.
              </motion.p>
              <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
                {planterStyles.map((ps) => (
                  <motion.div
                    key={ps.name}
                    variants={fadeUp}
                    className="bg-white border border-border rounded-sm p-5 hover:border-[oklch(0.62_0.12_45/0.5)] transition-colors duration-200"
                  >
                    <h4 className="font-display text-lg font-light text-foreground mb-1">
                      {ps.name}
                    </h4>
                    <p className="text-xs text-muted-foreground font-sans">
                      {ps.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute -inset-4 bg-[oklch(0.62_0.12_45/0.15)] rounded-sm blur-xl" />
              <img
                src={plantersCollection}
                alt="Designer planter collection"
                className="relative w-full h-80 md:h-96 object-cover rounded-sm shadow-2xl"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Balcony Transformation ─────────────────────────────── */}
      <section className="relative py-16 md:py-28 lg:py-40 px-6 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${balconyTransform})`,
          }}
        />
        <div className="absolute inset-0 bg-[oklch(0.12_0.04_150/0.82)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-[oklch(0.62_0.12_45)] text-sm font-semibold tracking-[0.2em] uppercase mb-6"
            >
              The Vision
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl md:text-7xl font-light text-white leading-tight mb-6"
            >
              Not just plants.
              <em className="block italic text-[oklch(0.88_0.04_140)] mt-1">
                A designed space.
              </em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-sans text-xl text-[oklch(0.78_0.03_140)] max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Your balcony is not extra storage. It's a green extension of your
              home — a retreat from the city, designed with intention and
              installed with care.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button
                asChild
                size="lg"
                className="bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold px-10 py-6 text-base rounded-sm tracking-wide shadow-xl"
              >
                <Link to="/consult">Start Your Transformation</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Who We Serve ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-14"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-[oklch(0.62_0.12_45)] text-sm font-semibold tracking-[0.2em] uppercase mb-4"
            >
              Who We Serve
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-foreground leading-tight"
            >
              Designed for
              <em className="block italic text-[oklch(0.45_0.09_140)]">
                city life
              </em>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {customers.map((c) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                className="bg-card border border-border rounded-sm p-8 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-11 h-11 rounded-sm bg-[oklch(0.88_0.04_140)] flex items-center justify-center mb-5">
                  <c.Icon size={20} className="text-[oklch(0.25_0.075_155)]" />
                </div>
                <h3 className="font-display text-2xl font-light text-foreground mb-3">
                  {c.title}
                </h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                  {c.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Consultation CTA ──────────────────────────────────── */}
      <section
        id="contact"
        className="py-20 md:py-28 px-6 bg-[oklch(0.18_0.055_150)]"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-[oklch(0.62_0.12_45)] text-sm font-semibold tracking-[0.2em] uppercase mb-6"
            >
              Get Started
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight mb-6"
            >
              Ready to transform
              <em className="block italic text-[oklch(0.88_0.04_140)]">
                your balcony?
              </em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-sans text-[oklch(0.72_0.04_140)] text-lg mb-10 leading-relaxed"
            >
              Book a free consultation and we'll design the perfect green space
              for your home — at no obligation.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button
                asChild
                size="lg"
                className="bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold px-12 py-6 text-lg rounded-sm tracking-wide shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link to="/consult">Book Now</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-[oklch(0.14_0.04_150)] border-t border-[oklch(0.25_0.05_150)] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <img
                src={florilicLogo}
                alt="Florilic"
                className="h-10 w-auto mb-3 mx-auto md:mx-0"
              />
              <p className="font-display text-lg italic text-[oklch(0.62_0.12_45)] mb-1">
                Balconies. Designed. Grown.
              </p>
              <p className="text-sm text-[oklch(0.55_0.03_140)]">
                hello@florilic.co
              </p>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start text-sm text-[oklch(0.62_0.04_140)] font-sans">
              {["Services", "How It Works", "Plants", "Contact"].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    const id = item.toLowerCase().replace(/\s+/g, "-");
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-[oklch(0.62_0.12_45)] transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-10 pt-6 border-t border-[oklch(0.22_0.04_150)] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[oklch(0.48_0.025_140)]">
            <p>© {new Date().getFullYear()} Florilic. All rights reserved.</p>
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
      </footer>
    </div>
  );
}
