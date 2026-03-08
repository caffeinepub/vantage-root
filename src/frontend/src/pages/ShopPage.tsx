import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  Heart,
  Search,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  CATEGORIES,
  PRODUCTS,
  type Product,
  type ProductCategory,
  getCategoryCounts,
} from "../data/products";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } },
};

const categoryCounts = getCategoryCounts();

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  function toggleWishlist() {
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast.success(`Removed "${product.name}" from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`Added "${product.name}" to wishlist`);
    }
  }

  function handleAddToCart() {
    addToCart(product);
    toast.success(`Added "${product.name}" to cart`);
  }

  return (
    <motion.div
      variants={fadeUp}
      data-ocid={`shop.product.card.${index + 1}`}
      className="group bg-[oklch(0.19_0.05_150)] border border-[oklch(0.26_0.05_150)] rounded-sm overflow-hidden hover:border-[oklch(0.40_0.08_150)] hover:shadow-[0_8px_32px_oklch(0.08_0.04_150)] transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[oklch(0.22_0.055_150)]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-sm bg-[oklch(0.14_0.04_150/0.85)] text-[oklch(0.72_0.10_45)] border border-[oklch(0.62_0.12_45/0.3)] backdrop-blur-sm">
            {product.category}
          </span>
        </div>
        {/* Coming Soon badge */}
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 text-xs font-sans font-medium px-2 py-0.5 rounded-sm bg-[oklch(0.55_0.14_65/0.25)] text-[oklch(0.88_0.10_65)] border border-[oklch(0.62_0.14_65/0.4)] backdrop-blur-sm">
            <Clock size={9} />
            Coming Soon
          </span>
        </div>
        {/* Wishlist button */}
        <button
          type="button"
          data-ocid={`shop.product.wishlist.${index + 1}`}
          onClick={toggleWishlist}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[oklch(0.16_0.045_150/0.90)] border border-[oklch(0.30_0.05_150)] flex items-center justify-center text-[oklch(0.55_0.03_140)] hover:text-[oklch(0.75_0.18_25)] hover:border-[oklch(0.60_0.15_25/0.5)] transition-all duration-200 backdrop-blur-sm"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            className={
              wishlisted
                ? "fill-[oklch(0.72_0.18_25)] text-[oklch(0.72_0.18_25)]"
                : ""
            }
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-base font-light text-white leading-snug mb-1 group-hover:text-[oklch(0.82_0.06_120)] transition-colors">
          {product.name}
        </h3>
        <p className="text-[oklch(0.52_0.03_140)] font-sans text-xs leading-relaxed line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs font-sans px-1.5 py-0.5 rounded-sm bg-[oklch(0.25_0.055_150)] text-[oklch(0.55_0.03_140)] border border-[oklch(0.30_0.05_150)]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[oklch(0.45_0.03_140)] font-sans text-xs">
              Starting from
            </p>
            <p className="text-[oklch(0.68_0.10_45)] font-sans text-sm font-semibold">
              ₹{product.priceFrom.toLocaleString("en-IN")}
              <span className="text-[oklch(0.42_0.03_140)] font-normal text-xs ml-1">
                (est.)
              </span>
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    type="button"
                    data-ocid={`shop.product.add_cart.${index + 1}`}
                    size="sm"
                    onClick={handleAddToCart}
                    className="bg-[oklch(0.62_0.12_45/0.15)] hover:bg-[oklch(0.62_0.12_45/0.25)] text-[oklch(0.75_0.10_45)] border border-[oklch(0.62_0.12_45/0.35)] hover:border-[oklch(0.62_0.12_45/0.6)] rounded-sm font-sans text-xs h-8 px-3 transition-all duration-200"
                  >
                    <ShoppingCart size={12} className="mr-1.5" />
                    Reserve
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-[oklch(0.24_0.055_150)] border-[oklch(0.32_0.05_150)] text-[oklch(0.82_0.04_140)] text-xs font-sans"
              >
                Reserve now — available soon
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
}

type PriceFilter = "all" | "under500" | "500-1000" | "over1000";
type PlantType = "all" | "indoor" | "outdoor";

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: "all", label: "Any Price" },
  { value: "under500", label: "Under ₹500" },
  { value: "500-1000", label: "₹500 – ₹1,000" },
  { value: "over1000", label: "Above ₹1,000" },
];

function matchesPrice(product: Product, filter: PriceFilter): boolean {
  if (filter === "all") return true;
  if (filter === "under500") return product.priceFrom < 500;
  if (filter === "500-1000")
    return product.priceFrom >= 500 && product.priceFrom <= 1000;
  return product.priceFrom > 1000;
}

function matchesPlantType(product: Product, type: PlantType): boolean {
  if (type === "all") return true;
  if (type === "indoor") return product.category === "Indoor Plants";
  if (type === "outdoor") return product.category === "Outdoor Plants";
  return true;
}

function FiltersPanel({
  activeCategory,
  onCategoryChange,
  priceFilter,
  onPriceChange,
  plantType,
  onPlantTypeChange,
  onClearFilters,
  hasActiveFilters,
}: {
  activeCategory: ProductCategory | "all";
  onCategoryChange: (cat: ProductCategory | "all") => void;
  priceFilter: PriceFilter;
  onPriceChange: (p: PriceFilter) => void;
  plantType: PlantType;
  onPlantTypeChange: (t: PlantType) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-[oklch(0.55_0.03_140)] font-sans text-xs uppercase tracking-widest mb-3">
          Categories
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              data-ocid="shop.category.tab.1"
              onClick={() => onCategoryChange("all")}
              className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-sm text-sm font-sans transition-all duration-150 ${
                activeCategory === "all"
                  ? "bg-[oklch(0.62_0.12_45/0.15)] text-[oklch(0.78_0.10_45)] border border-[oklch(0.62_0.12_45/0.3)]"
                  : "text-[oklch(0.65_0.03_140)] hover:bg-[oklch(0.22_0.055_150)] hover:text-white border border-transparent"
              }`}
            >
              <span>All Products</span>
              <span className="text-xs text-[oklch(0.45_0.03_140)]">
                {PRODUCTS.length}
              </span>
            </button>
          </li>
          {CATEGORIES.map((cat, i) => (
            <li key={cat}>
              <button
                type="button"
                data-ocid={`shop.category.tab.${i + 2}`}
                onClick={() => onCategoryChange(cat)}
                className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-sm text-sm font-sans transition-all duration-150 ${
                  activeCategory === cat
                    ? "bg-[oklch(0.62_0.12_45/0.15)] text-[oklch(0.78_0.10_45)] border border-[oklch(0.62_0.12_45/0.3)]"
                    : "text-[oklch(0.65_0.03_140)] hover:bg-[oklch(0.22_0.055_150)] hover:text-white border border-transparent"
                }`}
              >
                <span>{cat}</span>
                <span className="text-xs text-[oklch(0.45_0.03_140)]">
                  {categoryCounts[cat]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-[oklch(0.55_0.03_140)] font-sans text-xs uppercase tracking-widest mb-3">
          Price Range
        </h3>
        <ul className="space-y-1">
          {PRICE_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => onPriceChange(opt.value)}
                className={`w-full text-left px-3 py-2 rounded-sm text-sm font-sans transition-all duration-150 ${
                  priceFilter === opt.value
                    ? "bg-[oklch(0.22_0.055_150)] text-white border border-[oklch(0.35_0.05_150)]"
                    : "text-[oklch(0.65_0.03_140)] hover:bg-[oklch(0.22_0.055_150)] hover:text-white border border-transparent"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Plant type */}
      <div>
        <h3 className="text-[oklch(0.55_0.03_140)] font-sans text-xs uppercase tracking-widest mb-3">
          Plant Type
        </h3>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "indoor", "outdoor"] as PlantType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onPlantTypeChange(t)}
              className={`px-3 py-1.5 rounded-sm text-xs font-sans capitalize transition-all duration-150 ${
                plantType === t
                  ? "bg-[oklch(0.62_0.12_45/0.2)] text-[oklch(0.78_0.10_45)] border border-[oklch(0.62_0.12_45/0.4)]"
                  : "bg-[oklch(0.22_0.055_150)] text-[oklch(0.60_0.03_140)] border border-[oklch(0.28_0.05_150)] hover:text-white hover:bg-[oklch(0.25_0.06_150)]"
              }`}
            >
              {t === "all"
                ? "All Types"
                : t === "indoor"
                  ? "Indoor"
                  : "Outdoor"}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          type="button"
          data-ocid="shop.clear_filters.button"
          onClick={onClearFilters}
          className="flex items-center gap-1.5 text-[oklch(0.55_0.15_25)] hover:text-[oklch(0.72_0.15_25)] text-sm font-sans transition-colors"
        >
          <X size={13} />
          Clear all filters
        </button>
      )}
    </div>
  );
}

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(
    "all",
  );
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [plantType, setPlantType] = useState<PlantType>("all");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const { cartCount } = useCart();

  const hasActiveFilters =
    activeCategory !== "all" ||
    priceFilter !== "all" ||
    plantType !== "all" ||
    search.trim() !== "";

  function clearFilters() {
    setSearch("");
    setActiveCategory("all");
    setPriceFilter("all");
    setPlantType("all");
  }

  const filtered = PRODUCTS.filter((p) => {
    const searchLower = search.toLowerCase().trim();
    if (
      searchLower &&
      !p.name.toLowerCase().includes(searchLower) &&
      !p.description.toLowerCase().includes(searchLower) &&
      !p.tags.some((t) => t.includes(searchLower))
    ) {
      return false;
    }
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (!matchesPrice(p, priceFilter)) return false;
    if (!matchesPlantType(p, plantType)) return false;
    return true;
  });

  // Active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (activeCategory !== "all") {
    activeChips.push({
      label: activeCategory,
      onRemove: () => setActiveCategory("all"),
    });
  }
  if (priceFilter !== "all") {
    const label =
      PRICE_OPTIONS.find((o) => o.value === priceFilter)?.label ?? priceFilter;
    activeChips.push({ label, onRemove: () => setPriceFilter("all") });
  }
  if (plantType !== "all") {
    activeChips.push({
      label: plantType === "indoor" ? "Indoor Plants" : "Outdoor Plants",
      onRemove: () => setPlantType("all"),
    });
  }
  if (search.trim()) {
    activeChips.push({
      label: `"${search.trim()}"`,
      onRemove: () => setSearch(""),
    });
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[oklch(0.14_0.04_150)] pt-16">
        {/* Page header */}
        <div className="bg-[oklch(0.16_0.045_150)] border-b border-[oklch(0.24_0.05_150)] py-8 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <ShoppingBag
                    size={20}
                    className="text-[oklch(0.62_0.12_45)]"
                  />
                  <h1 className="font-display text-2xl sm:text-3xl font-light text-white">
                    Shop
                  </h1>
                  <Badge className="bg-[oklch(0.55_0.14_65/0.2)] text-[oklch(0.82_0.10_65)] border border-[oklch(0.62_0.14_65/0.35)] hover:bg-[oklch(0.55_0.14_65/0.2)] font-sans text-xs rounded-sm">
                    <Clock size={9} className="mr-1" />
                    Launching Soon
                  </Badge>
                </div>
                <p className="text-[oklch(0.52_0.03_140)] font-sans text-sm">
                  Browse our curated collection of plants, planters, and
                  gardening essentials.
                </p>
              </div>

              {/* Search + Cart */}
              <div className="flex items-center gap-2 sm:w-72">
                <div className="relative flex-1">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.48_0.03_140)]"
                  />
                  <Input
                    type="search"
                    data-ocid="shop.search_input"
                    placeholder="Search products…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-[oklch(0.20_0.05_150)] border-[oklch(0.28_0.05_150)] text-white placeholder:text-[oklch(0.40_0.03_140)] focus:border-[oklch(0.62_0.12_45)] rounded-sm font-sans text-sm h-10"
                  />
                </div>

                {/* Cart button */}
                <button
                  type="button"
                  data-ocid="shop.cart.button"
                  onClick={() => setCartOpen(true)}
                  className="relative w-10 h-10 rounded-sm bg-[oklch(0.20_0.05_150)] border border-[oklch(0.28_0.05_150)] flex items-center justify-center text-[oklch(0.65_0.03_140)] hover:text-white hover:border-[oklch(0.40_0.07_150)] transition-all duration-200 flex-shrink-0"
                  aria-label="Open cart"
                >
                  <ShoppingCart size={16} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[oklch(0.62_0.12_45)] text-white text-[10px] font-bold flex items-center justify-center font-sans">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>

                {/* Mobile filter toggle */}
                <button
                  type="button"
                  data-ocid="shop.filters.toggle"
                  onClick={() => setFilterDrawerOpen(true)}
                  className="lg:hidden w-10 h-10 rounded-sm bg-[oklch(0.20_0.05_150)] border border-[oklch(0.28_0.05_150)] flex items-center justify-center text-[oklch(0.65_0.03_140)] hover:text-white hover:border-[oklch(0.40_0.07_150)] transition-all duration-200 flex-shrink-0"
                  aria-label="Open filters"
                >
                  <SlidersHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <FiltersPanel
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                priceFilter={priceFilter}
                onPriceChange={setPriceFilter}
                plantType={plantType}
                onPlantTypeChange={setPlantType}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Active chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {activeChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-sans bg-[oklch(0.22_0.055_150)] text-[oklch(0.72_0.04_140)] border border-[oklch(0.30_0.05_150)]"
                  >
                    {chip.label}
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      className="text-[oklch(0.50_0.03_140)] hover:text-white transition-colors"
                      aria-label={`Remove filter: ${chip.label}`}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  data-ocid="shop.clear_filters.button"
                  onClick={clearFilters}
                  className="text-xs font-sans text-[oklch(0.50_0.15_25)] hover:text-[oklch(0.70_0.15_25)] transition-colors px-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Count */}
            <p className="text-[oklch(0.50_0.03_140)] font-sans text-sm mb-5">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              {hasActiveFilters ? " matching your filters" : " available"}
            </p>

            {/* Grid or empty */}
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  data-ocid="shop.products.empty_state"
                  className="flex flex-col items-center justify-center py-20 text-center bg-[oklch(0.18_0.045_150)] border border-[oklch(0.26_0.05_150)] rounded-sm"
                >
                  <div className="w-14 h-14 rounded-full bg-[oklch(0.22_0.055_150)] flex items-center justify-center mb-4">
                    <ShoppingBag
                      size={22}
                      className="text-[oklch(0.42_0.03_140)]"
                    />
                  </div>
                  <p className="font-display text-xl font-light text-white mb-2">
                    No products found
                  </p>
                  <p className="text-[oklch(0.50_0.03_140)] font-sans text-sm max-w-xs mb-5">
                    Try adjusting your filters or search term.
                  </p>
                  <Button
                    type="button"
                    onClick={clearFilters}
                    variant="outline"
                    className="border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] hover:bg-[oklch(0.22_0.055_150)] hover:text-white rounded-sm text-sm"
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                <motion.ul
                  key="grid"
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {filtered.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={idx}
                    />
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile filter drawer */}
        <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
          <SheetContent
            side="left"
            className="w-72 bg-[oklch(0.16_0.045_150)] border-r border-[oklch(0.26_0.05_150)] p-6"
          >
            <SheetHeader className="mb-6">
              <SheetTitle className="font-display text-xl font-light text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <SlidersHorizontal
                    size={16}
                    className="text-[oklch(0.72_0.10_45)]"
                  />
                  Filters
                </span>
              </SheetTitle>
            </SheetHeader>
            <FiltersPanel
              activeCategory={activeCategory}
              onCategoryChange={(cat) => {
                setActiveCategory(cat);
                setFilterDrawerOpen(false);
              }}
              priceFilter={priceFilter}
              onPriceChange={setPriceFilter}
              plantType={plantType}
              onPlantTypeChange={setPlantType}
              onClearFilters={() => {
                clearFilters();
                setFilterDrawerOpen(false);
              }}
              hasActiveFilters={hasActiveFilters}
            />
          </SheetContent>
        </Sheet>

        {/* Cart Drawer */}
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

        {/* Footer */}
        <div className="border-t border-[oklch(0.22_0.04_150)] py-6 px-6 mt-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-[oklch(0.40_0.02_140)] font-sans text-xs">
              © {new Date().getFullYear()} Plantly. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
