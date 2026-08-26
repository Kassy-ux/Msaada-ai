"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCase, CaseDetail } from "@/lib/api";

export default function CaseDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getCase(id)
      .then(setCaseData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-6">
        <p className="text-gray-500 max-w-2xl mx-auto">Loading case...</p>
      </main>
    );
  }

  if (error || !caseData) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-6">
        <p className="text-red-600 max-w-2xl mx-auto">{error || "Case not found."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <p className="text-sm font-mono text-gray-500 mb-1">{caseData.code}</p>
          <h1 className="text-xl font-bold text-gray-900 mb-3">{caseData.category}</h1>
          <div className="flex gap-2 mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {caseData.status}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
              {caseData.urgency} urgency
            </span>
          </div>
          <p className="text-gray-700">{caseData.description}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Timeline</h2>
          <div className="space-y-4">
            {caseData.events.map((event, i) => (
              <div key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  {i < caseData.events.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-gray-900">
                    {event.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(event.createdAt).toLocaleString("en-KE", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
