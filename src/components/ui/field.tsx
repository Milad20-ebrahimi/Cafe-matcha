"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type FieldWrapperProps = {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function FieldWrapper({ label, error, hint, required, className, children }: FieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-forest">
          {label}
          {required && <span className="text-amber-dark"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-xs text-rose-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-forest/50">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputBaseClass =
  "focus-ring h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-forest placeholder:text-forest/35 transition-colors disabled:bg-forest/5 disabled:text-forest/40";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, required, className, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required}>
        <input
          ref={ref}
          className={cn(
            inputBaseClass,
            error ? "border-rose-400 focus-visible:outline-rose-400" : "border-forest/15",
            className,
          )}
          {...props}
        />
      </FieldWrapper>
    );
  },
);
TextField.displayName = "TextField";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, hint, required, className, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required}>
        <textarea
          ref={ref}
          className={cn(
            inputBaseClass,
            "h-auto min-h-28 resize-y py-3 leading-6",
            error ? "border-rose-400 focus-visible:outline-rose-400" : "border-forest/15",
            className,
          )}
          {...props}
        />
      </FieldWrapper>
    );
  },
);
TextareaField.displayName = "TextareaField";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, hint, required, className, children, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required}>
        <select
          ref={ref}
          className={cn(
            inputBaseClass,
            "cursor-pointer",
            error ? "border-rose-400 focus-visible:outline-rose-400" : "border-forest/15",
            className,
          )}
          {...props}
        >
          {children}
        </select>
      </FieldWrapper>
    );
  },
);
SelectField.displayName = "SelectField";
