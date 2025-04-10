import type {Context, Next } from "hono";

// Using a single variable to store the latest email that has access
export let currentResendAccess: {
  email: string;
  expiryTime: number;
} | null = null;

// Duration for resend verification access (10 minutes)
const ACCESS_DURATION = 10 * 60 * 1000;
export const ACCESS_DURATION_MS = ACCESS_DURATION;

// Getter opsional
export function getCurrentResendAccess() {
    return currentResendAccess;
  }

// Middleware to grant resend verification access
export function grantResendAccess(email: string) {
  // Replace any previous access with the new email
  currentResendAccess = {
    email,
    expiryTime: Date.now() + ACCESS_DURATION
  };
}

// Middleware to check resend verification access
export async function checkResendAccess(c: Context, next: Next) {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ message: "Email is required" }, 400);
    }

    // Check if access is expired
    const now = Date.now();
    if (!currentResendAccess || currentResendAccess.expiryTime < now) {
      currentResendAccess = null;
      return c.json({
        message: "Akses ditolak. Silakan coba masuk terlebih dahulu untuk mengirim ulang email verifikasi"
      }, 403);
    }

    // Check if this email matches the one with access
    if (currentResendAccess.email !== email) {
      return c.json({
        message: "Akses ditolak. Silakan coba masuk terlebih dahulu untuk mengirim ulang email verifikasi"
      }, 403);
    }

    // Continue to the next handler if has access
    await next();
  } catch (error) {
    return c.json({ message: "Invalid request" }, 400);
  }
}