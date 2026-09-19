import { getCart } from "@/services/cart.service";
import { getCartOwner } from "@/lib/cart-owner";

import { CartItemCard } from "@/components/cart/cart-item-card";
import { formatToman } from "@/lib/utils";


export default async function CartPage() {


  const owner = await getCartOwner();


  const cart = await getCart(owner);



  const total = cart.items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );



  return (
    <main
      className="
        min-h-screen
        bg-cream
        py-12
      "
    >

      <div
        className="
          mx-auto
          max-w-5xl
          px-5
        "
      >


        <h1
          className="
            mb-8
            text-3xl
            font-bold
            text-forest
          "
        >
          سبد خرید
        </h1>




        {cart.items.length === 0 ? (


          <div
            className="
              rounded-2xl
              bg-white
              p-10
              text-center
              text-forest/60
            "
          >
            سبد خرید شما خالی است.
          </div>



        ) : (


          <div
            className="
              grid
              gap-6
              lg:grid-cols-[1fr_350px]
            "
          >


            {/* Items */}

            <div
              className="
                flex
                flex-col
                gap-4
              "
            >

              {cart.items.map((item) => (

                <CartItemCard
                  key={item.id}
                  item={item}
                />

              ))}

            </div>





            {/* Summary */}

            <div
              className="
                h-fit
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >

              <h2
                className="
                  mb-5
                  text-xl
                  font-bold
                  text-forest
                "
              >
                خلاصه سفارش
              </h2>



              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  pt-4
                  font-bold
                "
              >

                <span>
                  مجموع
                </span>


                <span>
                  {formatToman(total)}
                </span>


              </div>



              <button
                className="
                  mt-6
                  w-full
                  rounded-xl
                  bg-forest
                  py-3
                  text-cream
                  transition
                  hover:bg-amber
                "
              >
                ادامه پرداخت
              </button>


            </div>


          </div>


        )}


      </div>


    </main>
  );
}