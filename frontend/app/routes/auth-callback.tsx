import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    async function processAuthToken() {
      // 1. Check for query error parameters from backend redirect
      const searchParams = new URLSearchParams(window.location.search);
      const queryErr = searchParams.get("error");
      const queryMsg = searchParams.get("message");

      if (queryErr || queryMsg) {
        navigate(
          `/login?error=${encodeURIComponent(queryErr || "auth_failed")}&message=${encodeURIComponent(
            queryMsg || "Google authentication encountered an error. Please try again."
          )}`,
          { replace: true }
        );
        return;
      }

      // 2. Check for token hash fragment
      const hash = window.location.hash;
      if (!hash) {
        navigate(
          `/login?error=missing_payload&message=${encodeURIComponent(
            "No authentication payload found in callback request."
          )}`,
          { replace: true }
        );
        return;
      }

      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("token");

      if (!token) {
        navigate(
          `/login?error=invalid_payload&message=${encodeURIComponent(
            "Invalid authentication token received."
          )}`,
          { replace: true }
        );
        return;
      }

      try {
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Failed to create authenticated session cookie.");
        }

        // Clean token hash from browser URL bar and history
        window.history.replaceState(null, "", window.location.pathname);

        // Invalidate auth query to reload user state across app
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

        // Redirect user to dashboard
        navigate("/dashboard", { replace: true });
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Authentication error occurred.";
        navigate(
          `/login?error=session_error&message=${encodeURIComponent(msg)}`,
          { replace: true }
        );
      }
    }

    void processAuthToken();
  }, [navigate, queryClient]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-foreground">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <h2 className="text-lg font-medium text-foreground">Completing sign in</h2>
        <p className="text-sm text-muted-foreground">Securing your session token and loading profile...</p>
      </div>
    </div>
  );
}
