import { redirect } from "react-router";
import { parseTokenFromCookie, destroySessionCookie } from "./auth-cookie";
import type { User } from "~/hooks/use-auth";

export async function getAuthenticatedUser(request: Request): Promise<User | null> {
  const cookieHeader = request.headers.get("cookie");
  const token = parseTokenFromCookie(cookieHeader);

  if (!token) {
    return null;
  }

  const backendBaseUrl = process.env.BACKEND_URL || "http://localhost:8080";

  try {
    const response = await fetch(`${backendBaseUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = (await response.json()) as User;
    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(request: Request): Promise<User> {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": destroySessionCookie(),
      },
    });
  }
  return user;
}

export async function requireAnonymous(request: Request): Promise<void> {
  const user = await getAuthenticatedUser(request);
  if (user) {
    throw redirect("/dashboard");
  }
}
