import { getCart } from "@/services/cart.service";
import { getCartOwner } from "@/lib/cart-owner";

export default async function CartPage() {

  const owner = await getCartOwner();

  if (!owner) {
    return (
      <div className="py-12">
        <h1 className="text-3xl font-bold">
          سبد خرید
        </h1>

        <p className="mt-4">
          سبد خرید شما خالی است.
        </p>
      </div>
    );
  }

  const cart = await getCart(owner);

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold">
        سبد خرید
      </h1>

      <pre className="mt-8">
        {JSON.stringify(cart, null, 2)}
      </pre>
    </div>
  );
}