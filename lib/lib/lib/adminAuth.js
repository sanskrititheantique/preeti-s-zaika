import crypto from "crypto";

const COOKIE_NAME = "zaika_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "insecure-default-secret";
}

function sign(payload) {
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(payload);
  return hmac.digest("hex");
}

// Builds the cookie value: "<expiry-timestamp>.<signature>"
export function createSessionCookieValue() {
  const expiry = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(expiry);
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function isValidSessionCookieValue(value) {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const valid =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid) return false;
  return Number(payload) > Date.now();
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_SECONDS;

// Checks an incoming Next.js Request for a valid admin session cookie
export function isAdminRequest(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;
  const value = decodeURIComponent(match.split("=").slice(1).join("="));
  return isValidSessionCookieValue(value);
}
