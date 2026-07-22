// lib/validations/auth.schema.ts

import { z } from "zod";


// --------------------
// Register Schema
// --------------------

export const registerSchema = z
  .object({

    name: z
      .string()
      .min(2, "نام باید حداقل ۲ کاراکتر باشد"),


    email: z
      .string()
      .email("ایمیل معتبر نیست"),


    password: z
      .string()
      .min(8, "رمز باید حداقل ۸ کاراکتر باشد"),


    confirmPassword: z
      .string(),

  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "رمزها یکسان نیستند",
      path: ["confirmPassword"],
    }
  );




// --------------------
// Login Schema
// --------------------

export const loginSchema = z.object({

  email: z
    .string()
    .email("ایمیل معتبر نیست"),


  password: z
    .string()
    .min(1, "رمز عبور الزامی است"),

});




// --------------------
// Forgot Password
// --------------------

export const forgotPasswordSchema =
  z.object({

    email: z
      .string()
      .email("ایمیل معتبر نیست"),

  });




// --------------------
// Reset Password
// --------------------

export const resetPasswordSchema =
  z
    .object({

      password: z
        .string()
        .min(
          8,
          "رمز باید حداقل ۸ کاراکتر باشد"
        ),


      confirmPassword: z
        .string(),

    })
    .refine(
      (data) =>
        data.password === data.confirmPassword,
      {
        message:
          "رمزها یکسان نیستند",
        path:
          ["confirmPassword"],
      }
    );
