import type { Route } from "./+types/login";
import type { LoaderFunctionArgs } from "react-router";
import { requireAnonymous } from "~/lib/auth-server";
import { LoginCard } from "../components/auth/login-card";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  return null;
}

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
