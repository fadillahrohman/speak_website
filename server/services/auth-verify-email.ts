import type { Context } from "hono";
import jwt from "jsonwebtoken";
import connectionToDatabase from "../lib/database.js";
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "5db3560f5305814ea03df6c22525b72286e66e1b3f89278736392e95a0b1d706";

export async function verifyEmail(c: Context) {
  const token = c.req.query("token");

  if (!token) {
    return c.json({ message: "Invalid verification token" }, 400);
  }

  try {
    const db = await connectionToDatabase();

    // Search user with verification token
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE verification_token = ?",
      [token]
    );

    const users = Array.isArray(rows) ? rows : [];

    if (users.length === 0) {
      return c.json({ message: "Invalid verification token" }, 400);
    }

    const user = users[0] as { email: string, verification_token_expires?: number };

    // Check if verification token has expired
    if (user.verification_token_expires && Date.now() > user.verification_token_expires) {
      return c.redirect(
        `http://localhost:5173/verification-failed?reason=expired&email=${encodeURIComponent(user.email)}`
      );
    }

    // Update status verification
    await db.execute(
      "UPDATE users SET email_verified = 'verified', verification_token = NULL WHERE verification_token = ?",
      [token]
    );

    console.log(`User verified: ${user.email}`);

    // Create JWT for success page - 5 minutes
    const successToken = jwt.sign(
      {
        email: user.email,
        purpose: "verification_success",
        timestamp: Date.now(),
      },
      JWT_SECRET,
      { expiresIn: "5m" }
    );

    // Redirect to success page (frontend) with token JWT
    return c.redirect(
      `http://localhost:5173/verification-success?token=${successToken}`
    );
  } catch (error) {
    console.error("Error during verification:", error);
    return c.json({ message: "An error occurred during verification" }, 500);
  }
}

// Endpoint for token validation success
export async function validateSuccessToken(c: Context) {
  const token = c.req.query("token");

  if (!token) {
    return c.json({ valid: false }, 400);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      email: string;
      purpose: string;
    };

    // Check if the token is for the correct destination
    if (decoded.purpose !== "verification_success") {
      return c.json({ valid: false }, 400);
    }

    return c.json({ valid: true, email: decoded.email });
  } catch (error) {
    console.error("Token validation error:", error);

    // Spesific handling for expired tokens
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return c.json({valid: false, error: "Token has expired"}, 401);
    }

    return c.json({ valid: false }, 400);
  }
}
