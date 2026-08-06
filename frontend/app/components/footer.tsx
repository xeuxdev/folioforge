import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-stone-600">
        <div className="flex items-center space-x-3">
          <Logo className="w-6 h-6" showText={true} />
          <span className="text-stone-400">&bull;</span>
          <span>Self-Hosted CV & Portfolio Engine</span>
        </div>

        <div className="flex items-center space-x-6">
          <a href="#problem" className="hover:text-stone-900 transition-colors">
            Problem
          </a>
          <a href="#philosophy" className="hover:text-stone-900 transition-colors">
            Thought Process
          </a>
          <a href="#solution" className="hover:text-stone-900 transition-colors">
            Solution
          </a>
          <a href="#pricing" className="hover:text-stone-900 transition-colors">
            Pricing
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-stone-900 transition-colors"
          >
            GitHub
          </a>
        </div>

        <div className="text-xs text-stone-400">
          &copy; {new Date().getFullYear()} FolioForge. Open source under MIT License.
        </div>
      </div>
    </footer>
  );
}
