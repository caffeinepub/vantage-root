import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, cartTotal, removeFromCart, updateQuantity } = useCart();

  function handleCheckout() {
    toast.info(
      "Checkout coming soon! We're working hard to bring you a seamless shopping experience.",
      {
        duration: 4000,
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[oklch(0.16_0.045_150)] border-l border-[oklch(0.26_0.05_150)] flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-[oklch(0.24_0.05_150)] flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="font-display text-xl font-light text-white flex items-center gap-2.5">
            <ShoppingCart size={18} className="text-[oklch(0.72_0.10_45)]" />
            Your Cart
            {items.length > 0 && (
              <span className="text-sm text-[oklch(0.55_0.03_140)] font-sans font-normal">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
          <button
            type="button"
            data-ocid="cart.close_button"
            onClick={onClose}
            className="text-[oklch(0.55_0.03_140)] hover:text-white transition-colors p-1 rounded-sm hover:bg-[oklch(0.24_0.05_150)]"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div
              data-ocid="cart.empty_state"
              className="flex flex-col items-center justify-center h-full py-16 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[oklch(0.22_0.055_150)] flex items-center justify-center mb-4">
                <ShoppingCart
                  size={26}
                  className="text-[oklch(0.42_0.03_140)]"
                />
              </div>
              <p className="font-display text-lg font-light text-white mb-2">
                Your cart is empty
              </p>
              <p className="text-[oklch(0.52_0.03_140)] font-sans text-sm">
                Add products from the shop to see them here.
              </p>
              <Button
                type="button"
                onClick={onClose}
                className="mt-6 bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm text-sm"
              >
                Browse Shop
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item, idx) => (
                <li
                  key={item.product.id}
                  data-ocid={`cart.item.${idx + 1}`}
                  className="flex gap-4 p-3 bg-[oklch(0.19_0.05_150)] border border-[oklch(0.26_0.05_150)] rounded-sm"
                >
                  {/* Product image */}
                  <div className="w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 bg-[oklch(0.22_0.055_150)]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-sans text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[oklch(0.55_0.03_140)] font-sans text-xs mt-0.5">
                      {item.product.category}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {/* Quantity controls */}
                      <button
                        type="button"
                        data-ocid={`cart.quantity_decrease.${idx + 1}`}
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-6 h-6 rounded-sm border border-[oklch(0.32_0.05_150)] flex items-center justify-center text-[oklch(0.65_0.03_140)] hover:border-[oklch(0.62_0.12_45)] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-white font-sans text-sm w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        data-ocid={`cart.quantity_increase.${idx + 1}`}
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded-sm border border-[oklch(0.32_0.05_150)] flex items-center justify-center text-[oklch(0.65_0.03_140)] hover:border-[oklch(0.62_0.12_45)] hover:text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    data-ocid={`cart.remove.${idx + 1}`}
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[oklch(0.45_0.03_140)] hover:text-[oklch(0.68_0.18_25)] transition-colors p-1 self-start"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only show when cart has items */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[oklch(0.24_0.05_150)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[oklch(0.65_0.03_140)] font-sans text-sm">
                Subtotal
              </span>
              <span className="text-white font-sans text-sm font-semibold">
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[oklch(0.45_0.03_140)] font-sans text-xs">
              Prices are indicative. Final pricing will be confirmed at
              checkout.
            </p>
            <Button
              type="button"
              data-ocid="cart.checkout.button"
              onClick={handleCheckout}
              className="w-full bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm h-11 text-sm"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
