import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * هش کردن رمز عبور
 */
export async function hashPassword(
  password: string
): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * مقایسه رمز وارد شده با هش ذخیره شده
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}