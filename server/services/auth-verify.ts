import type { Context } from "hono";
import connectionToDatabase from "../lib/database.js";
import jwt from "jsonwebtoken";

export async function verifyAuth(c: Context) {
  try {
    // Get token from cookie
    const cookieHeader = c.req.header('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(cookie => {
        const [name, value] = cookie.split('=');
        return [name, value];
      })
    );
    
    const token = cookies.auth_token;
    
    if (!token) {
      // Status 200 with authenticated data: false
      return c.json({ authenticated: false, user: null }, 200);
    }
    
    try {
      // Verify token
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "5db3560f5305814ea03df6c22525b72286e66e1b3f89278736392e95a0b1d706"
      );
      
      // Get user data from database
      const db = await connectionToDatabase();
      const [rows]: any = await db.execute(
        "SELECT id, username, email FROM users WHERE id = ?",
        [decoded.id]
      );
      
      const user = rows[0];
      
      if (!user) {
        return c.json({ authenticated: false, user: null }, 200);
      }
      
      // Restore authentication status and user data
      return c.json({
        authenticated: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        }
      }, 200);
    } catch (error) {
      // Token is invalid
      return c.json({ authenticated: false, user: null }, 200);
    }
  } catch (error) {
    console.error("Auth verification error:", error);
    return c.json({ authenticated: false, user: null }, 200);
  }
}