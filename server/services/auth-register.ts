import type { Context } from "hono";
import connectionToDatabase from "../lib/database.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email-service.js";

export async function register(c: Context) {
  const { username, email, password } = await c.req.json();
  try {
    if (!username || !email || !password) {
      return c.json({ message: "All fields must be filled" }, 400);
    }

    const db = await connectionToDatabase();

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const users = Array.isArray(rows) ? rows : [];

    if (users.length > 0) {
      return c.json({ message: "Email sudah terdaftar" }, 400);
    }

    try {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10); // salt rounds

      // Save to database - added verification_token field
      const [result] = await db.execute(
        "INSERT INTO users (username, email, password, verification_token, verification_token_expires) VALUES (?, ?, ?, ?, ?)",
        [username, email, hashedPassword, verificationToken, expiryTime]
      );

      // Send email AFTER database is successfully saved
      await sendVerificationEmail(email, verificationToken);

      await db.commit();

      console.log(`-> User registered successfully : ${username} (${email})`);

      return c.json({
        message: "Registration successful",
        data: { username, email },
      });
    } catch (dbError) {
      // Rollback register if error occurs
      await db.rollback();
      throw dbError;
    }
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ message: "Register failed" }, 500);
  }
}
