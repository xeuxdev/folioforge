import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function processAuthToken() {
      const hash = window.location.hash;
      if (!hash) {
        setErrorMessage("No authentication token found in request.");
        return;
      }

      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("token");

      if (!token) {
        setErrorMessage("Invalid authentication payload received.");
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
        const msg = err instanceof Error ? err.message : "Authentication error occurred.";
        setErrorMessage(msg);
      }
    }

    void processAuthToken();
  }, [navigate, queryClient]);

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-foreground">
        <div className="max-w-md w-full bg-card p-6 rounded-xl border border-border shadow-xs text-center space-y-4">
          <h2 className="text-lg font-semibold text-destructive">Authentication Failed</h2>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

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
