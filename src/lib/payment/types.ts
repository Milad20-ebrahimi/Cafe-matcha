export type PaymentRequestParams = {
  orderId: string;
  orderNumber: string;
  amount: number;
  description: string;
  callbackUrl: string;
  mobile?: string;
  email?: string;
};

export type PaymentRequestResult =
  | { ok: true; authority: string; redirectUrl: string }
  | { ok: false; error: string };

export type PaymentVerifyParams = {
  authority: string;
  amount: number;
};

export type PaymentVerifyResult =
  | { ok: true; refId: string; cardPan?: string }
  | { ok: false; error: string };

/**
 * لایه انتزاعی درگاه پرداخت.
 * برای اتصال به درگاه واقعی (مثلاً زرین‌پال یا زیبال)، کافیست یک کلاس جدید
 * پیاده‌ساز همین اینترفیس بسازید (مثلاً ZarinpalGateway) و در index.ts
 * جایگزین SandboxGateway کنید. هیچ بخش دیگری از کد نیاز به تغییر ندارد.
 */
export interface PaymentGateway {
  readonly name: string;
  requestPayment(params: PaymentRequestParams): Promise<PaymentRequestResult>;
  verifyPayment(params: PaymentVerifyParams): Promise<PaymentVerifyResult>;
}
