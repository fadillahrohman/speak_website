import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";

export async function blockIfAuthenticated(c: Context, next: Next) {
  const cookieHeader = c.req.header("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, value] = cookie.split("=");
      return [name, value];
    })
  );

  const token = cookies.auth_token;

  if (token) {
    try {
      // Verifikasi token saja tanpa menyimpan decoded
      jwt.verify(
        token,
        process.env.JWT_SECRET || "5db3560f5305814ea03df6c22525b72286e66e1b3f89278736392e95a0b1d706"
      );
      // Jika berhasil, berarti sudah login → blokir
      return c.redirect("http://localhost:5173/", 302);
    } catch (err) {
      // Jika error (token invalid/expired), lanjut ke route
    }
  }

  await next();
}
