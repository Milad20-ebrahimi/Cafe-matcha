import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { comparePassword } from "@/lib/auth/password";
export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({

  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

   async authorize(credentials) {

  if (
    !credentials?.email ||
    !credentials?.password
  ) {
    return null;
  }


  const email =
    credentials.email as string;


  const password =
    credentials.password as string;



  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);



  const user = result[0];


  if (!user) {
    return null;
  }



  if (!user.passwordHash) {
    return null;
  }



  const isValid =
    await comparePassword(
      password,
      user.passwordHash
    );



  if (!isValid) {
    return null;
  }



  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };

}
    }),
  ],


  pages: {
    signIn: "/login",
  },


  session: {
    strategy: "jwt",
  },

});