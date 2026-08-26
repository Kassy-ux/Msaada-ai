"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminLegalDocuments, deleteAdminLegalDocument, AdminLegalDocument } from "@/lib/api";

export default function AdminLegalDocumentsPage() {
  const [docs, setDocs] = useState<AdminLegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    getAdminLegalDocuments()
      .then(setDocs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this document and all its chunks?")) return;
    await deleteAdminLegalDocument(id);
    load();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin" className="text-sm text-emerald-700 hover:underline mb-4 inline-block">
          &larr; Admin Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Legal Documents</h1>
        <p className="text-gray-600 mb-8">Manage the verified legal knowledge base powering RAG.</p>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading && <p className="text-gray-500">Loading documents...</p>}

        <div className="space-y-4">
          {docs.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-900 font-semibold">{d.title}</p>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                  {d.documentType}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{d.source} · {d.jurisdiction}</p>
              <p className="text-xs text-gray-400 mb-3">
                {d._count.chunks} chunk{d._count.chunks !== 1 ? "s" : ""}
                {d.verifiedAt && ` · Verified ${new Date(d.verifiedAt).toLocaleDateString("en-KE")}`}
              </p>
              <button onClick={() => handleDelete(d.id)} className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
