"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";


export function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();


    const result = await signIn(
      "credentials",
      {
        email,
        password,
        redirect: false,
      }
    );


    console.log(
      "LOGIN RESULT:",
      result
    );

  }



  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <input
        type="email"
        placeholder="ایمیل"
        value={email}
        onChange={(e)=>
          setEmail(e.target.value)
        }
        className="w-full rounded-xl border p-3"
      />


      <input
        type="password"
        placeholder="رمز عبور"
        value={password}
        onChange={(e)=>
          setPassword(e.target.value)
        }
        className="w-full rounded-xl border p-3"
      />


      <button
        type="submit"
        className="
          w-full
          rounded-xl
          bg-black
          p-3
          text-white
        "
      >
        ورود
      </button>


    </form>

  );

}