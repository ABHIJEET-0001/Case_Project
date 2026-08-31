export interface AuthUser {
  fullName: string;
  email: string;
  role: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  fullName: string;
  role: string;
  iat: number;
  exp: number;
}

const TOKEN_STORAGE_KEY = "caselens.jwt";
const USER_STORAGE_KEY = "caselens.user";
const DEFAULT_TOKEN_TTL_SEC = 60 * 60 * 12;
const REFRESH_THRESHOLD_SEC = 60 * 20;

function createSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const rand = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `sid_${time}_${rand}`;
}

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64Url(input: string): string {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const binary = atob(b64 + pad);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function createDemoJwt(user: AuthUser, ttlSec = DEFAULT_TOKEN_TTL_SEC): string {
  const nowSec = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    sub: createSessionId(),
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    iat: nowSec,
    exp: nowSec + ttlSec,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const headerPart = toBase64Url(JSON.stringify(header));
  const payloadPart = toBase64Url(JSON.stringify(payload));

  // Demo-only signature for frontend prototype.
  const pseudoSignature = toBase64Url(`${payload.sub}.${user.email}.caselens`);
  return `${headerPart}.${payloadPart}.${pseudoSignature}`;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadJson = fromBase64Url(parts[1]);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp > nowSec;
}

export function shouldRefreshToken(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp - nowSec <= REFRESH_THRESHOLD_SEC;
}

export function refreshDemoJwt(token: string, user: AuthUser): string | null {
  if (!isTokenValid(token)) return null;
  if (!shouldRefreshToken(token)) return token;
  return createDemoJwt(user);
}

export function saveSession(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function loadSession(): { token: string; user: AuthUser } | null {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const userRaw = localStorage.getItem(USER_STORAGE_KEY);
  if (!token || !userRaw) return null;

  try {
    const user = JSON.parse(userRaw) as AuthUser;
    if (!isTokenValid(token)) return null;
    return { token, user };
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}
