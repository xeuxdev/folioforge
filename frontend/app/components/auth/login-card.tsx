import { ArrowLeft } from "lucide-react";
import { Logo } from "../logo";
import { Button } from "~/components/ui/button";

export function LoginCard() {
  const handleGoogleLogin = () => {
    // Triggers Express Google OAuth endpoint in production/integration phase
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 text-foreground">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <a
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-1.5 w-4 h-4" />
          Back to home
        </a>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
          Google OAuth Only
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto bg-card text-card-foreground p-8 sm:p-10 rounded-2xl border border-border shadow-xs space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <Logo className="w-10 h-10" showText={false} />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
            Sign in to FolioForge
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Manage your canonical resume graph, tailor bullet points, and publish self-hosted portfolios.
          </p>
        </div>

        {/* Google Auth Button with shadcn Button */}
        <div className="space-y-4 pt-2">
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full py-6 text-sm font-semibold flex items-center justify-center space-x-3 cursor-pointer"
          >
            {/* Google Multicolor SVG Icon */}
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-muted-foreground space-y-2">
        <div className="flex justify-center space-x-4">
          <a href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <span>&bull;</span>
          <a href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} FolioForge. All rights reserved.</p>
      </div>
    </div>
  );
}
