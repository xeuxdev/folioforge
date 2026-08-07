import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("auth/callback", "routes/auth-callback.tsx"),
  route("api/*", "routes/api-proxy.ts"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),

  // Public Portfolio & /llm.txt routes
  route("u/:username", "routes/u/$username.tsx"),
  route("u/:username/llm.txt", "routes/u/$username.llm.txt.ts"),

  // Dashboard layout and child routes
  route("dashboard", "routes/dashboard.tsx", [
    index("routes/dashboard/index.tsx"),
    route("import", "routes/dashboard/import.tsx"),
    route("tailor", "routes/dashboard/tailor.tsx"),
    route("portfolio", "routes/dashboard/portfolio.tsx"),
    route("domains", "routes/dashboard/domains.tsx"),
    route("settings", "routes/dashboard/settings.tsx"),
  ]),
] satisfies RouteConfig;
