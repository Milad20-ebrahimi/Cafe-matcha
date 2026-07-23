import { LoginForm } from "@/components/auth/LoginForm";


export default function LoginPage() {

  return (

    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
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
          ورود به حساب کاربری
        </h1>


        <LoginForm />


      </div>

    </div>

  );

}