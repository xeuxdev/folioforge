import type { Route } from "./+types/login";
import { LoginCard } from "../components/auth/login-card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In | FolioForge" },
    {
      name: "description",
      content:
        "Sign in to FolioForge using Google OAuth to manage your canonical resume graph and self-hosted portfolios.",
    },
  ];
}

export default function Login() {
  return <LoginCard />;
}
