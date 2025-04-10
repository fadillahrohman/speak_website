import type { Context } from "hono";
import connectionToDatabase from "../lib/database.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

// Create an interface for the JWT payload
interface MyJwtPayload extends JwtPayload {
  id: string | number;
  email: string;
}

export async function getUserProfile(c: Context) {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return c.json({ message: "No token provided" }, 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "5db3560f5305814ea03df6c22525b72286e66e1b3f89278736392e95a0b1d706"
    ) as MyJwtPayload;

    const db = await connectionToDatabase();

    const [rows]: any = await db.execute(
      "SELECT id, username, email FROM users WHERE id = ?",
      [decoded.id]
    );

    const user = rows[0];
    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Verification error:", error);
    return c.json({ message: "Invalid token" }, 401);
  }
}
