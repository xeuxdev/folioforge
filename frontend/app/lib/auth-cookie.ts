export const TOKEN_COOKIE_NAME = "folioforge_session_token";

export function parseTokenFromCookie(
  cookieHeader: string | null | undefined,
): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split("=");
    if (name === TOKEN_COOKIE_NAME) {
      return rest.join("=");
    }
  }

  return null;
}

export function createSessionCookie(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  const secureFlag = isProd ? " Secure;" : "";
  const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds

  return `${TOKEN_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge};${secureFlag}`;
}

export function destroySessionCookie(): string {
  const isProd = process.env.NODE_ENV === "production";
  const secureFlag = isProd ? " Secure;" : "";

  return `${TOKEN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0;${secureFlag}`;
}
