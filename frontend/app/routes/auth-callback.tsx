import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function AuthCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    async function processAuthToken() {
      // 1. Check for query error parameters from backend redirect
      const searchParams = new URLSearchParams(window.location.search);
      const queryErr = searchParams.get("error");
      const queryMsg = searchParams.get("message");

      if (queryErr || queryMsg) {
        setErrorCode(queryErr || "AUTH_ERROR");
        setErrorMessage(
          queryMsg || "Google authentication encountered an error. Please try again."
        );
        return;
      }

      // 2. Check for token hash fragment
      const hash = window.location.hash;
      if (!hash) {
        setErrorMessage("No authentication payload found in callback request.");
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
        const msg =
          err instanceof Error ? err.message : "Authentication error occurred.";
        setErrorMessage(msg);
      }
    }

    void processAuthToken();
  }, [navigate, queryClient]);

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-foreground">
        <div className="max-w-md w-full bg-card p-6 rounded-2xl border border-border shadow-md text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-destructive">
              Authentication Failed
            </h2>
            {errorCode && (
              <span className="inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                Code: {errorCode}
              </span>
            )}
            <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
              {errorMessage}
            </p>
          </div>
          <Button
            onClick={() => navigate("/login", { replace: true })}
            className="w-full text-xs font-semibold cursor-pointer"
          >
            Return to Login
          </Button>
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
