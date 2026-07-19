import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { roleHasPermission, type Permission } from "@/lib/rbac";

export async function requirePermission(perm: Permission) {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        { message: "برای انجام این عملیات باید وارد حساب کاربری شوید." },
        { status: 401 },
      ),
    };
  }
  if (!roleHasPermission(session.permissions, perm)) {
    return {
      session,
      error: NextResponse.json(
        { message: "شما دسترسی لازم برای انجام این عملیات را ندارید." },
        { status: 403 },
      ),
    };
  }
  return { session, error: null };
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ message: "ابتدا وارد حساب کاربری خود شوید." }, { status: 401 }),
    };
  }
  return { session, error: null };
}
