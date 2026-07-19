"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "تایید",
  cancelLabel = "انصراف",
  danger = true,
  loading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-dark/50 p-4 backdrop-blur-sm animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`flex size-11 items-center justify-center rounded-full ${
              danger ? "bg-rose-100 text-rose-600" : "bg-amber/15 text-amber-dark"
            }`}
          >
            <AlertTriangle className="size-5" />
          </div>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="focus-ring rounded-lg p-1.5 text-forest/40 hover:bg-forest/5 hover:text-forest"
          >
            <X className="size-4" />
          </button>
        </div>
        <h3 id="confirm-dialog-title" className="mb-1.5 text-base font-bold text-forest">
          {title}
        </h3>
        {description && <p className="mb-5 text-sm leading-6 text-forest/60">{description}</p>}
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
