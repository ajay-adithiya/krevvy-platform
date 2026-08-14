import { Metadata } from "next";
import { CartPageContent } from "../../components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Shopping Cart | Krevvy",
  description: "View and manage items in your Krevvy shopping cart.",
};

export default function CartPage() {
  return (
    <div className="flex-1 bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Your Cart
          </h1>
        </div>

        <CartPageContent />
      </div>
    </div>
  );
}
