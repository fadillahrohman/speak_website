import type { Context } from "hono";

export async function logout(c: Context) {
  try {
  // If using cookies, delete cookies
    c.header('Set-Cookie', 'auth_token=; Path=/; Max-Age=0; SameSite=Lax');
    
  // Return success message
    return c.json({
      message: "Logout successful"
    }, 200);
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({ message: "An error occurred during logout" }, 500);
  }
}