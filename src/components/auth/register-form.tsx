"use client";


import { useState } from "react";
import { toast } from "sonner";

import { registerAction } from "@/actions/auth.action";

import { Button } from "@/components/ui/button";



export function RegisterForm() {


  const [loading,setLoading] = useState(false);



  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();


    const formData =
      new FormData(e.currentTarget);



    const name =
      formData.get("name") as string;


    const email =
      formData.get("email") as string;


    const password =
      formData.get("password") as string;



    setLoading(true);



    try {


      const result =
        await registerAction({
          name,
          email,
          password,
        });



      if(!result.success){

        toast.error(result.message);

        return;

      }



      toast.success(
        "ثبت نام موفق بود"
      );


    }
    catch(error){

      console.error(error);

      toast.error(
        "خطایی رخ داد"
      );

    }
    finally{

      setLoading(false);

    }


  }




  return (

    <form
      onSubmit={handleSubmit}
      className="
        space-y-4
      "
    >


      <input
        name="name"
        placeholder="نام"
        className="
          w-full
          rounded-lg
          border
          p-3
        "
      />



      <input
        name="email"
        type="email"
        placeholder="ایمیل"
        className="
          w-full
          rounded-lg
          border
          p-3
        "
      />



      <input
        name="password"
        type="password"
        placeholder="رمز عبور"
        className="
          w-full
          rounded-lg
          border
          p-3
        "
      />



      <Button
        disabled={loading}
        className="w-full"
      >

        {
          loading
          ?
          "در حال ثبت..."
          :
          "ثبت نام"
        }


      </Button>



    </form>

  );


}