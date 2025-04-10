import type { Context } from "hono";
import connectionToDatabase from "../lib/database.js";
import crypto from "crypto";
import { sendVerificationEmail } from "./email-service.js";

export async function resendVerificationEmail(c: Context) {
  const { email } = await c.req.json();

  try {
    if (!email) {
      return c.json({ message: "Email is required" }, 400);
    }

    const db = await connectionToDatabase();

    try {
      // Check if user exists and is not verified
      const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ? AND email_verified = 'unverified'",
        [email]
      );

      const users = Array.isArray(rows) ? rows : [];

      if (users.length === 0) {
        await db.rollback();
        return c.json({ message: "Email not found or already verified" }, 400);
      }

      const newVerificationToken = crypto.randomBytes(32).toString("hex");
      const newExpiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes

      // Update token and expiration time in database
      await db.execute(
        "UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE email = ?",
        [newVerificationToken, newExpiryTime, email]
      );

      await sendVerificationEmail(email, newVerificationToken);

      await db.commit();

      return c.json({
        message:
          "Email verifikasi berhasil dikirim ulang! Silakan periksa email Anda.",
      });
    } catch (dbError) {
      await db.rollback();
      throw dbError;
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    return c.json(
      { message: "Failed to resend verification email", error },
      500
    );
  }
}
