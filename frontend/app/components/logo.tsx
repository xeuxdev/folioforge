interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "w-8 h-8", showText = true }: LogoProps) {
  return (
    <div className="flex items-center space-x-2.5">
      <img
        src="/logo.png"
        alt="FolioForge Logo"
        className={`${className} object-contain`}
      />

      {showText && (
        <span className="font-heading font-bold text-stone-900 text-lg tracking-tight">
          FolioForge
        </span>
      )}
    </div>
  );
}
