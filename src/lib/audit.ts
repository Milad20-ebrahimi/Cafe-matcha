import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import type { SessionPayload } from "@/lib/session";

export async function logAudit(
  session: SessionPayload | null,
  action: string,
  entityType: string,
  entityId: string,
  details: Record<string, unknown> = {},
) {
  try {
    await db.insert(auditLogs).values({
      adminId: session?.userId ?? null,
      adminName: session?.name ?? "سیستم",
      action,
      entityType,
      entityId,
      details,
    });
  } catch (err) {
    console.error("audit log failed", err);
  }
}
