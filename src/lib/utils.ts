import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToman(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return "۰ تومان";
  return `${new Intl.NumberFormat("fa-IR").format(Math.round(n))} تومان`;
}

export function formatNumberFa(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return "۰";
  return new Intl.NumberFormat("fa-IR").format(n);
}

export function formatDateFa(date: Date | string | number) {
  const d = new Date(date);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateTimeFa(date: Date | string | number) {
  const d = new Date(date);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function generateOrderNumber() {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CM-${time}-${rand}`;
}

const persianCharMap: Record<string, string> = {
  ا: "a",
  آ: "a",
  ب: "b",
  پ: "p",
  ت: "t",
  ث: "s",
  ج: "j",
  چ: "ch",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "z",
  ر: "r",
  ز: "z",
  ژ: "zh",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "z",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "gh",
  ک: "k",
  گ: "g",
  ل: "l",
  م: "m",
  ن: "n",
  و: "v",
  ه: "h",
  ی: "y",
  " ": "-",
};

export function slugify(input: string) {
  const trimmed = input.trim().toLowerCase();
  const hasLatin = /[a-z0-9]/.test(trimmed);
  if (hasLatin && !/[\u0600-\u06FF]/.test(trimmed)) {
    return trimmed
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  let out = "";
  for (const ch of trimmed) {
    out += persianCharMap[ch] ?? (/[a-z0-9-]/.test(ch) ? ch : "-");
  }
  return out
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toDigits(input: string) {
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  const ar = "٠١٢٣٤٥٦٧٨٩";
  return input.replace(/[۰-۹٠-٩]/g, (ch) => {
    const faIndex = fa.indexOf(ch);
    if (faIndex > -1) return String(faIndex);
    const arIndex = ar.indexOf(ch);
    if (arIndex > -1) return String(arIndex);
    return ch;
  });
}

export function formatPhoneInput(value: string) {
  const digits = toDigits(value).replace(/\D/g, "").slice(0, 11);
  return digits;
}

export function formatPostalCodeInput(value: string) {
  const digits = toDigits(value).replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function isValidIranPhone(value: string) {
  return /^09\d{9}$/.test(value);
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
