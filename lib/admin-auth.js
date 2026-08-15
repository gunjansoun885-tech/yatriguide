import { createHmac, timingSafeEqual } from "crypto";

export const COOKIE_NAME = "yatriguide_admin_session";
export const SECRET_KEY = process.env.ADMIN_JWT_SECRET || "yatriguide-super-secure-admin-secret-2026-v2-prod";

/**
 * Returns the single authorized Website Owner account.
 * Configurable via environment variables (ADMIN_EMAIL & ADMIN_PASSWORD).
 */
export function getAuthorizedAdmins() {
  return [
    {
      email: (process.env.ADMIN_EMAIL || "owner@yatriguide.in").trim().toLowerCase(),
      password: (process.env.ADMIN_PASSWORD || "Owner@Yatri2026!").trim(),
      role: "owner",
      name: "Website Owner",
    },
  ];
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function safeEqual(strA, strB) {
  try {
    const bufA = Buffer.from(strA, "utf8");
    const bufB = Buffer.from(strB, "utf8");
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Verify provided email & password against the single authorized Owner account
 */
export function verifyAdminCredentials(inputEmail, inputPassword) {
  if (!inputEmail || !inputPassword) return null;
  const cleanEmail = inputEmail.trim().toLowerCase();
  const cleanPassword = inputPassword.trim();

  const admins = getAuthorizedAdmins();
  for (const admin of admins) {
    const emailMatch = safeEqual(cleanEmail, admin.email);
    const passwordMatch = safeEqual(cleanPassword, admin.password);
    if (emailMatch && passwordMatch) {
      return {
        email: admin.email,
        role: admin.role,
        name: admin.name,
      };
    }
  }
  return null;
}

/**
 * Generate a cryptographically signed HMAC-SHA256 session token
 */
export function generateSessionToken(email, role = "owner") {
  const payload = JSON.stringify({
    email,
    role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 Hours Expiry
  });

  const base64Payload = Buffer.from(payload).toString("base64url");
  const signature = createHmac("sha256", SECRET_KEY).update(base64Payload).digest("base64url");
  return `${base64Payload}.${signature}`;
}

/**
 * Verify session token signature and check expiration date
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;

  try {
    const [base64Payload, signature] = token.split(".");
    const expectedSignature = createHmac("sha256", SECRET_KEY).update(base64Payload).digest("base64url");

    // Timing-safe check on HMAC signature
    if (!safeEqual(signature, expectedSignature)) return null;

    const payloadStr = Buffer.from(base64Payload, "base64url").toString("utf8");
    const payload = JSON.parse(payloadStr);

    if (payload.exp && Date.now() > payload.exp) return null;

    // Ensure email belongs to the authorized owner
    const admins = getAuthorizedAdmins();
    const isAuthorizedEmail = admins.some((a) => a.email === payload.email?.toLowerCase());
    if (!isAuthorizedEmail) return null;

    return payload;
  } catch {
    return null;
  }
}
