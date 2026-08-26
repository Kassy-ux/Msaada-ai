"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminCases, updateAdminCaseStatus, AdminCase } from "@/lib/api";

const STATUSES = ["ACTIVE", "RESOLVED", "CLOSED", "ESCALATED"];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  RESOLVED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-gray-100 text-gray-600",
  ESCALATED: "bg-red-100 text-red-800",
};

export default function AdminCasesPage() {
  const [cases, setCases] = useState<AdminCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    getAdminCases()
      .then(setCases)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleStatusChange(id: string, status: string) {
    await updateAdminCaseStatus(id, status);
    load();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin" className="text-sm text-emerald-700 hover:underline mb-4 inline-block">
          &larr; Admin Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cases</h1>
        <p className="text-gray-600 mb-8">Monitor and update case statuses across all users.</p>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading && <p className="text-gray-500">Loading cases...</p>}

        <div className="space-y-4">
          {cases.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono text-gray-500">{c.code}</span>
                <select
                  value={c.status}
                  onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 ${STATUS_STYLES[c.status]}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <p className="text-gray-900 font-medium mb-1">{c.category}</p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{c.description}</p>
              <p className="text-xs text-gray-400">
                {c.user.name || c.user.phone} · {c._count.events} event{c._count.events !== 1 ? "s" : ""} · {c._count.evidence} evidence
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
