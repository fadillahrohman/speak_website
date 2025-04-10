import { Hono } from "hono";
import { login } from "../services/auth-login.js";
import { logout } from "../services/auth-logout.js";
import { register } from "../services/auth-register.js";
import {
  validateSuccessToken,
  verifyEmail,
} from "../services/auth-verify-email.js";
import { resendVerificationEmail } from "../services/resend-verification-email.js";
import { getUserProfile } from "../services/get-user-profile.js";
import { verifyAuth } from "../services/auth-verify.js";
import {
  checkResendAccess,
  ACCESS_DURATION_MS,
  getCurrentResendAccess,
} from "../middleware/verification-access.js";
import { blockIfAuthenticated } from "../middleware/block-if-authenticated.js";

const authRoutes = new Hono();

// Login route
authRoutes.post("/login", blockIfAuthenticated ,async (c) => {
  return login(c);
});

// Logout route
authRoutes.post("/logout", async (c) => {
  return logout(c);
});

// Register route
authRoutes.post("/register", blockIfAuthenticated ,async (c) => {
  return register(c);
});

authRoutes.get("/verify", async (c) => {
  return verifyAuth(c);
});

// Endpoint for verification email
authRoutes.get("/verify-email", blockIfAuthenticated ,async (c) => {
  return verifyEmail(c);
});

authRoutes.get("/validate-success-token", blockIfAuthenticated, async (c) => {
  return validateSuccessToken(c);
});
// To resend the verification email
authRoutes.post("/resend-verification", checkResendAccess, blockIfAuthenticated , async (c) => {
  return resendVerificationEmail(c);
});

// Endpoint untuk ambil informasi akses verifikasi
// authRoutes.get("/resend-access-info", async (c) => {
//   const currentAccess = getCurrentResendAccess();

//   return c.json({
//     accessDuration: ACCESS_DURATION_MS,
//     expiryTime: currentAccess?.expiryTime ?? null,
//     email: currentAccess?.email ?? null,
//   });
// });

authRoutes.get("/me", async (c) => {
  return getUserProfile(c);
});

export default authRoutes;
