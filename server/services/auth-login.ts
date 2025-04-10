import type { Context } from "hono";
import connectionToDatabase from "../lib/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { grantResendAccess } from "../middleware/verification-access.js";

export async function login(c: Context) {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ message: "Email and password are required" }, 400);
  }

  const db = await connectionToDatabase();

  try {
    // Search user by email
    const [rows]: any = await db.execute(
      "SELECT id, username, email, password, email_verified FROM users WHERE email = ?",
      [email]
    );

    const user = rows[0];

    if (!user) {
      return c.json({ message: "Invalid email or password" }, 401);
    }

    // Check if the email has been verified
    // if (user.email_verified === "unverified") {

    //   return c.json(
    //     {
    //       message: "Please verify your email before logging in",
    //       redirect: "/resend-verification",
    //       email: user.email,
    //     },
    //     401
    //   );
    // }

    // Check verification status after credentials are valid
    if (user.email_verified === "unverified") {
      // Grant access for resend verification
      grantResendAccess(email);

      return c.json(
        {
          success: false,
          redirect: "/resend-verification",
          message: "Please verify your email before logging in",
          canResendVerification: true,
        },
        401
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return c.json({ message: "Invalid email or password" }, 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET ||
        "5db3560f5305814ea03df6c22525b72286e66e1b3f89278736392e95a0b1d706",
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    // Set token as HttpOnly cookie
    c.header(
      "Set-Cookie",
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}; SameSite=Lax`
    );

    // Send token along with user information
    return c.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ message: "An error occurred on the server" }, 500);
  }
}
