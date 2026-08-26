"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProviders, Provider } from "@/lib/api";

export default function ProvidersPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProviders(category)
      .then(setProviders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Legal Help</h1>
        <p className="text-gray-600 mb-8">
          {category
            ? `Verified providers for ${category.toLowerCase()} issues.`
            : "Verified legal aid organizations near you."}
        </p>

        {loading && <p className="text-gray-500">Loading providers...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && providers.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
            No verified providers found for this category yet.
          </div>
        )}

        <div className="space-y-4">
          {providers.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                {p.verified && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Verified
                  </span>
                )}
              </div>
              {p.organization && (
                <p className="text-sm text-gray-600 mb-2">{p.organization}</p>
              )}
              {p.location && (
                <p className="text-sm text-gray-500 mb-3">📍 {p.location}</p>
              )}
              <div className="flex flex-wrap gap-3 text-sm">
                {p.phone && (
                  
                    href={`tel:${p.phone}`}
                    className="text-emerald-700 font-medium hover:underline"
                  >
                    {p.phone}
                  </a>
                )}
                {p.website && (
                  
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-medium hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
