import { RegisterForm } from "@/components/auth/register-form";


export default function RegisterPage() {

  return (

    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        p-6
      "
    >

      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          p-8
        "
      >

        <h1
          className="
            mb-6
            text-2xl
            font-bold
          "
        >
          ساخت حساب کاربری
        </h1>


        <RegisterForm />

      </div>


    </main>

  );

}