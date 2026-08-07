import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  parseTokenFromCookie,
  createSessionCookie,
  destroySessionCookie,
} from "~/lib/auth-cookie";

interface SessionRequestBody {
  token?: string;
}

async function handleApiProxy(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const backendBaseUrl = process.env.BACKEND_URL || "http://localhost:8080";

  // 1. Session establishment endpoint: POST /api/auth/session
  if (url.pathname === "/api/auth/session" && request.method === "POST") {
    try {
      const body = (await request.json()) as SessionRequestBody;
      if (!body.token || typeof body.token !== "string") {
        return new Response(JSON.stringify({ error: "Missing token" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const cookieHeader = createSessionCookie(body.token);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieHeader,
        },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 2. Session teardown endpoint: DELETE /api/auth/session or POST /api/auth/logout
  if (
    (url.pathname === "/api/auth/session" && request.method === "DELETE") ||
    (url.pathname === "/api/auth/logout" && request.method === "POST")
  ) {
    const existingToken = parseTokenFromCookie(request.headers.get("cookie"));

    // Optionally notify backend to invalidate session
    if (existingToken) {
      try {
        await fetch(`${backendBaseUrl}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${existingToken}`,
          },
        });
      } catch {
        // Continue clearing client cookie even if backend logout call fails
      }
    }

    const clearCookieHeader = destroySessionCookie();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": clearCookieHeader,
      },
    });
  }

  // 3. Proxy all other /api/* requests to backend
  // Map /api/v1/... or /api/... to backend target URL
  let targetPath = url.pathname;
  if (targetPath.startsWith("/api/v1/")) {
    targetPath = targetPath.replace("/api/v1", "/api/v1");
  } else if (targetPath.startsWith("/api/")) {
    targetPath = targetPath.replace("/api", "/api/v1");
  }

  const targetUrl = new URL(`${backendBaseUrl}${targetPath}${url.search}`);

  const token = parseTokenFromCookie(request.headers.get("cookie"));

  // Build headers for backend request
  const proxyHeaders = new Headers();

  // Forward essential incoming headers
  const forwardHeaders = [
    "content-type",
    "accept",
    "user-agent",
    "accept-language",
  ];
  for (const headerName of forwardHeaders) {
    const value = request.headers.get(headerName);
    if (value) {
      proxyHeaders.set(headerName, value);
    }
  }

  // Attach HttpOnly token as Bearer token if present
  if (token) {
    proxyHeaders.set("Authorization", `Bearer ${token}`);
  }

  // Determine request body for methods that allow payloads
  let body: BodyInit | null = null;
  if (
    ["POST", "PUT", "PATCH", "DELETE"].includes(request.method.toUpperCase())
  ) {
    const contentType = request.headers.get("content-type") || "";
    if (
      contentType.includes("application/json") ||
      contentType.includes("text/")
    ) {
      body = await request.text();
    } else {
      const buffer = await request.arrayBuffer();
      if (buffer.byteLength > 0) {
        body = buffer;
      }
    }
  }

  try {
    const backendResponse = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: proxyHeaders,
      body,
      redirect: "manual",
    });

    // Construct response back to frontend browser
    const responseHeaders = new Headers();

    // Copy select headers from backend response
    const backendContentType = backendResponse.headers.get("content-type");
    if (backendContentType) {
      responseHeaders.set("Content-Type", backendContentType);
    }

    const locationHeader = backendResponse.headers.get("location");
    if (locationHeader) {
      responseHeaders.set("Location", locationHeader);
    }

    // If backend returns 401, automatically clear cookie
    if (backendResponse.status === 401 && token) {
      responseHeaders.set("Set-Cookie", destroySessionCookie());
    }

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Proxy request failed";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return handleApiProxy(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return handleApiProxy(request);
}
