import { Lock, FileX2, Bot } from "lucide-react";

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="py-20 bg-stone-100 border-y border-stone-200 px-4 sm:px-6 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-200/80 px-3 py-1 rounded-full border border-stone-300">
            Act I: The Status Quo
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-stone-900 font-semibold mt-4 tracking-tight">
            Why modern resume builders feel broken.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            Most online resume creators prioritize recurring subscription
            revenue over candidate outcomes. They turn basic document creation
            into a hostile user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                Subscription Traps & Paywalls
              </h3>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                You spend hours building your CV, only to be hit with a
                mandatory recurring subscription when you need to download a PDF
                20 minutes before your interview.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-stone-100 text-xs font-medium text-stone-500">
              Impact: Loss of data portability and unexpected charges.
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 mb-6">
                <FileX2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                The ATS Parsing Black Hole
              </h3>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                Visual editors generate messy DOM trees, multi-column tables,
                and embedded raster images that break automated applicant
                tracking systems before a human reads them.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-stone-100 text-xs font-medium text-stone-500">
              Impact: Silent rejection by recruitment automation.
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                AI Hallucinations & Fabrication
              </h3>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                Generic AI tools invent metrics, fake previous responsibilities,
                and rewrite bullet points into exaggerated claims that break
                down during technical screens.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-stone-100 text-xs font-medium text-stone-500">
              Impact: Damage to professional credibility and trust.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
