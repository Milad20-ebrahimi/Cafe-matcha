import { nanoid } from "nanoid";
import type {
  PaymentGateway,
  PaymentRequestParams,
  PaymentRequestResult,
  PaymentVerifyParams,
  PaymentVerifyResult,
} from "./types";

/**
 * درگاه آزمایشی (Sandbox) — جایگزین موقت درگاه‌های واقعی مثل زرین‌پال/زیبال.
 * ساختار درخواست/تایید دقیقاً مطابق الگوی درگاه‌های واقعی ایرانی است:
 * ۱) requestPayment => دریافت authority و آدرس ریدایرکت به صفحه بانک
 * ۲) کاربر در صفحه بانک (اینجا صفحه شبیه‌سازی‌شده) پرداخت را تایید/لغو می‌کند
 * ۳) verifyPayment => تایید نهایی تراکنش و دریافت شماره پیگیری (refId)
 */
export class SandboxGateway implements PaymentGateway {
  readonly name = "sandbox";

  async requestPayment(params: PaymentRequestParams): Promise<PaymentRequestResult> {
    if (params.amount <= 0) {
      return { ok: false, error: "مبلغ پرداخت نامعتبر است." };
    }
    const authority = `SANDBOX-${nanoid(16)}`;
    const redirectUrl = `/pay/sandbox/${authority}?amount=${params.amount}&order=${params.orderNumber}&callback=${encodeURIComponent(
      params.callbackUrl,
    )}`;
    return { ok: true, authority, redirectUrl };
  }

  async verifyPayment(params: PaymentVerifyParams): Promise<PaymentVerifyResult> {
    if (!params.authority) {
      return { ok: false, error: "شناسه تراکنش یافت نشد." };
    }
    const refId = `REF-${Math.floor(100000000 + Math.random() * 899999999)}`;
    return { ok: true, refId, cardPan: "6219-86**-****-1234" };
  }
}
