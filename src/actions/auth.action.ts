"use server";

import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { hashPassword } from "@/lib/auth/password";


const registerSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ کاراکتر باشد"),

  email: z
    .string()
    .email("ایمیل معتبر نیست"),

  password: z
    .string()
    .min(8, "رمز عبور حداقل ۸ کاراکتر باشد"),
});



export async function registerAction(
  data: {
    name: string;
    email: string;
    password: string;
  }
) {


  const result = registerSchema.safeParse(data);



  if (!result.success) {

    return {
      success: false,
      message: "اطلاعات وارد شده صحیح نیست",
      errors: result.error.flatten(),
    };

  }



  const {
    name,
    email,
    password,
  } = result.data;



const existingUser = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1);



if (existingUser.length > 0) {

  return {
    success: false,
    message: "این ایمیل قبلاً ثبت شده است",
  };

}
const passwordHash = await hashPassword(password);
const newUser = await db
  .insert(users)
  .values({

    name,

    email,

    passwordHash,

  })
  .returning({
    id: users.id,
    email: users.email,
  });
  return {
  success: true,
  message: "ثبت نام موفق بود",
  user: newUser[0],
};



}