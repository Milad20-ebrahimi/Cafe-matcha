import type { PaymentGateway } from "./types";
import { SandboxGateway } from "./sandbox-gateway";

// در آینده برای اتصال به درگاه واقعی کافیست این بخش را تغییر دهید، مثلاً:
// import { ZarinpalGateway } from "./zarinpal-gateway";
// export const paymentGateway: PaymentGateway =
//   process.env.PAYMENT_PROVIDER === "zarinpal" ? new ZarinpalGateway() : new SandboxGateway();
export const paymentGateway: PaymentGateway = new SandboxGateway();

export * from "./types";
