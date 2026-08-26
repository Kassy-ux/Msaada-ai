"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCases, CaseRecord } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  RESOLVED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-gray-100 text-gray-600",
  ESCALATED: "bg-red-100 text-red-800",
};

const URGENCY_STYLES: Record<string, string> = {
  LOW: "bg-blue-50 text-blue-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  HIGH: "bg-orange-50 text-orange-700",
  CRITICAL: "bg-red-50 text-red-700",
};

export default function CasesPage() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCases()
      .then(setCases)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Cases</h1>
        <p className="text-gray-600 mb-8">Track the progress of your cases with Msaada.</p>

        {loading && <p className="text-gray-500">Loading cases...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && cases.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-500 mb-4">You don't have any cases yet.</p>
            <Link
              href="/get-help"
              className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Get Help
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {cases.map((c) => (
            <Link
              key={c.id}
              href={`/cases/${c.id}`}
              className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono text-gray-500">{c.code}</span>
                <div className="flex gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      URGENCY_STYLES[c.urgency]
                    }`}
                  >
                    {c.urgency}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      STATUS_STYLES[c.status]
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
              <p className="text-gray-900 font-medium mb-1">{c.category}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(c.createdAt).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
