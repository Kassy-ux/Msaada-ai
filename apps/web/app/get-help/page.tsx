"use client";

import { useState } from "react";
import { submitTriage, TriageResponse, createCase } from "@/lib/api";

const URGENCY_STYLES: Record<string, string> = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
};

export default function GetHelpPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [caseCreated, setCaseCreated] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim().length < 5) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCaseCreated(null);

    try {
      const response = await submitTriage(input);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">What happened?</h1>
        <p className="text-gray-600 mb-6">
          Describe your situation in your own words. Msaada will help you understand
          your options.
        </p>

        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. My landlord locked me outside my house because I haven't paid rent."
            rows={4}
            className="w-full rounded-xl border border-gray-200 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
          />
          <button
            type="submit"
            disabled={loading || input.trim().length < 5}
            className="mt-3 w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            {loading ? "Analyzing..." : "Get Help"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Possible area
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    URGENCY_STYLES[result.classification.urgency]
                  }`}
                >
                  {result.classification.urgency} urgency
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {result.area_summary}
              </h2>
              <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What you can do now</h3>
              <ol className="space-y-2">
                {result.next_steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {result.evidence_to_preserve.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Evidence to preserve
                </h3>
                <ul className="space-y-2">
                  {result.evidence_to_preserve.map((item, i) => (
                    <li key={i} className="flex gap-2 text-gray-700">
                      <span className="text-emerald-600">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.sources_used.length > 0 && (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Sources</h3>
                <ul className="space-y-1">
                  {result.sources_used.map((src, i) => (
                    <li key={i} className="text-sm text-gray-500">
                      {src}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              
                href={
                  result
                    ? `/providers?category=${result.classification.category}`
                    : "/providers"
                }
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors text-center"
              >
                Find Legal Help
              </a>
              <button
                onClick={async () => {
                  if (!result) return;
                  try {
                    const newCase = await createCase(
                      result.classification.category,
                      input,
                      result.classification.urgency
                    );
                    setCaseCreated(newCase.code);
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : "Failed to create case."
                    );
                  }
                }}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                {caseCreated ? `Case ${caseCreated} created` : "Create Case"}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center pt-2">
              {result.disclaimer}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
