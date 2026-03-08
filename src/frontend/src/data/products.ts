export type ProductCategory =
  | "Pots & Planters"
  | "Indoor Plants"
  | "Outdoor Plants"
  | "Seeds"
  | "Gardening Tools"
  | "Decor & Accessories";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  priceFrom: number;
  image: string;
  tags: string[];
}

export const CATEGORIES: ProductCategory[] = [
  "Pots & Planters",
  "Indoor Plants",
  "Outdoor Plants",
  "Seeds",
  "Gardening Tools",
  "Decor & Accessories",
];

export const PRODUCTS: Product[] = [
  // Pots & Planters
  {
    id: "p1",
    name: "Matte Terracotta Pot Set",
    category: "Pots & Planters",
    description:
      "Handcrafted matte terracotta pots in three sizes. Perfect for succulents, herbs, and small flowering plants.",
    priceFrom: 849,
    image:
      "https://images.unsplash.com/photo-1490750967835-88a4576959a6?w=400&h=300&fit=crop",
    tags: ["terracotta", "handcrafted", "set"],
  },
  {
    id: "p2",
    name: "Minimalist Cement Planter",
    category: "Pots & Planters",
    description:
      "Industrial-chic cement planter with drainage hole. Neutral grey tone complements any balcony aesthetic.",
    priceFrom: 1299,
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop",
    tags: ["cement", "modern", "drainage"],
  },
  {
    id: "p3",
    name: "Ceramic Glazed Bowl Planter",
    category: "Pots & Planters",
    description:
      "Deep-glazed ceramic bowl in forest green. Wide mouth ideal for spreading ferns and trailing vines.",
    priceFrom: 1599,
    image:
      "https://images.unsplash.com/photo-1490750967835-88a4576959a6?w=400&h=300&fit=crop&crop=top",
    tags: ["ceramic", "glazed", "bowl"],
  },
  {
    id: "p4",
    name: "Hanging Wicker Basket",
    category: "Pots & Planters",
    description:
      "Natural wicker hanging basket with coco liner. Adds vertical greenery to railings and overhangs.",
    priceFrom: 699,
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop&crop=bottom",
    tags: ["wicker", "hanging", "natural"],
  },

  // Indoor Plants
  {
    id: "ip1",
    name: "Snake Plant (Sansevieria)",
    category: "Indoor Plants",
    description:
      "Architectural and nearly indestructible. Thrives in low light and purifies indoor air. Ideal for beginners.",
    priceFrom: 449,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    tags: ["low-light", "air-purifying", "easy-care"],
  },
  {
    id: "ip2",
    name: "Jade Plant",
    category: "Indoor Plants",
    description:
      "Compact succulent with glossy oval leaves. Long-lived and symbolically associated with good fortune.",
    priceFrom: 349,
    image:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop",
    tags: ["succulent", "compact", "low-water"],
  },
  {
    id: "ip3",
    name: "Pothos (Money Plant)",
    category: "Indoor Plants",
    description:
      "Fast-growing trailing plant perfect for shelves or hanging displays. Tolerates low light and irregular watering.",
    priceFrom: 299,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=right",
    tags: ["trailing", "fast-growing", "hardy"],
  },
  {
    id: "ip4",
    name: "Peace Lily",
    category: "Indoor Plants",
    description:
      "Elegant white blooms and deep-green foliage. An outstanding air purifier that thrives in shade.",
    priceFrom: 549,
    image:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop&crop=left",
    tags: ["flowering", "shade", "air-purifying"],
  },

  // Outdoor Plants
  {
    id: "op1",
    name: "Areca Palm",
    category: "Outdoor Plants",
    description:
      "Feathery, tropical palm that screens balconies beautifully. Prefers bright indirect light and regular watering.",
    priceFrom: 1199,
    image:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=300&fit=crop",
    tags: ["tropical", "privacy", "large"],
  },
  {
    id: "op2",
    name: "Bougainvillea Vine",
    category: "Outdoor Plants",
    description:
      "Vibrant pink-magenta blooms that transform railings into living walls. Drought-tolerant once established.",
    priceFrom: 799,
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=300&fit=crop",
    tags: ["flowering", "climbing", "drought-tolerant"],
  },
  {
    id: "op3",
    name: "Fern (Boston)",
    category: "Outdoor Plants",
    description:
      "Lush, full fronds that bring jungle vibes to shaded balcony corners. Loves humidity and indirect light.",
    priceFrom: 499,
    image:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=300&fit=crop&crop=top",
    tags: ["shade", "lush", "humidity-loving"],
  },
  {
    id: "op4",
    name: "Rosemary Bush",
    category: "Outdoor Plants",
    description:
      "Fragrant culinary herb that doubles as an ornamental plant. Full-sun performer with minimal watering.",
    priceFrom: 299,
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=300&fit=crop&crop=bottom",
    tags: ["herb", "fragrant", "full-sun"],
  },

  // Seeds
  {
    id: "s1",
    name: "Microgreens Starter Kit",
    category: "Seeds",
    description:
      "20 seed varieties for nutrient-dense microgreens. Harvest in 7-14 days from tiny pots on your balcony.",
    priceFrom: 249,
    image:
      "https://images.unsplash.com/photo-1464297162577-f5295c892cf4?w=400&h=300&fit=crop",
    tags: ["microgreens", "fast-growing", "edible"],
  },
  {
    id: "s2",
    name: "Wildflower Seed Mix",
    category: "Seeds",
    description:
      "Native wildflower blend to attract pollinators. Scatter in large planters for a meadow effect.",
    priceFrom: 199,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
    tags: ["wildflower", "pollinator", "scatter-sow"],
  },
  {
    id: "s3",
    name: "Herb Garden Seed Set",
    category: "Seeds",
    description:
      "Basil, coriander, mint, parsley, and chives. Grow a kitchen herb garden on any sun-lit balcony.",
    priceFrom: 179,
    image:
      "https://images.unsplash.com/photo-1464297162577-f5295c892cf4?w=400&h=300&fit=crop&crop=right",
    tags: ["herbs", "kitchen", "edible"],
  },

  // Gardening Tools
  {
    id: "t1",
    name: "Compact Tool Set (5-piece)",
    category: "Gardening Tools",
    description:
      "Trowel, cultivator, weeder, transplanter, and pruning scissors in a canvas roll bag. Perfect for balconies.",
    priceFrom: 899,
    image:
      "https://images.unsplash.com/photo-1585320806297-9c0d6aca60e6?w=400&h=300&fit=crop",
    tags: ["set", "compact", "canvas-bag"],
  },
  {
    id: "t2",
    name: "Brass Watering Can",
    category: "Gardening Tools",
    description:
      "1.5L copper-toned brass watering can with long spout. Decorative enough to display, practical enough to use daily.",
    priceFrom: 1199,
    image:
      "https://images.unsplash.com/photo-1585320806297-9c0d6aca60e6?w=400&h=300&fit=crop&crop=top",
    tags: ["brass", "decorative", "long-spout"],
  },
  {
    id: "t3",
    name: "Bypass Pruning Shears",
    category: "Gardening Tools",
    description:
      "Ergonomic stainless-steel pruning shears with soft-grip handles. Clean cuts protect plant health.",
    priceFrom: 549,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=bottom",
    tags: ["pruning", "stainless-steel", "ergonomic"],
  },

  // Decor & Accessories
  {
    id: "d1",
    name: "Pebble Mulch Bag (5kg)",
    category: "Decor & Accessories",
    description:
      "White decorative river pebbles for top-dressing planters. Retains moisture and adds a finished look.",
    priceFrom: 349,
    image:
      "https://images.unsplash.com/photo-1491926626787-62db157af940?w=400&h=300&fit=crop",
    tags: ["pebbles", "mulch", "decorative"],
  },
  {
    id: "d2",
    name: "Macramé Plant Hanger Set",
    category: "Decor & Accessories",
    description:
      "Hand-knotted cotton macramé hangers in three sizes. Adds bohemian texture to balcony walls.",
    priceFrom: 599,
    image:
      "https://images.unsplash.com/photo-1466692476868-9ee5a3a3e93b?w=400&h=300&fit=crop",
    tags: ["macrame", "boho", "wall-hanging"],
  },
  {
    id: "d3",
    name: "Solar LED String Lights",
    category: "Decor & Accessories",
    description:
      "10m weatherproof string lights with warm Edison bulbs. Solar-charged for chemical-free evening ambiance.",
    priceFrom: 799,
    image:
      "https://images.unsplash.com/photo-1491926626787-62db157af940?w=400&h=300&fit=crop&crop=right",
    tags: ["solar", "lights", "outdoor"],
  },
];

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getCategoryCounts(): Record<ProductCategory, number> {
  const counts = {} as Record<ProductCategory, number>;
  for (const cat of CATEGORIES) {
    counts[cat] = PRODUCTS.filter((p) => p.category === cat).length;
  }
  return counts;
}
