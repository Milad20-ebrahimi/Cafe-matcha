import { NextResponse } from "next/server";
import { randomUUID } from "crypto";


export async function GET() {

  const guestId = randomUUID();


  const response = NextResponse.json({
    success: true,
    guestId,
  });


  response.cookies.set(
    "guest_id",
    guestId,
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 روز
      path: "/",
    }
  );


  return response;
}