"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAdminProviders,
  createAdminProvider,
  verifyAdminProvider,
  deleteAdminProvider,
  AdminProvider,
} from "@/lib/api";

const CATEGORIES = [
  "EMPLOYMENT", "HOUSING", "LAND", "POLICE", "FAMILY",
  "CONSUMER", "DEBT", "GBV", "PUBLIC_SERVICE", "OTHER",
];

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  function load() {
    setLoading(true);
    getAdminProviders()
      .then(setProviders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createAdminProvider({ name, organization, location, phone, email, categories });
      setName(""); setOrganization(""); setLocation(""); setPhone(""); setEmail(""); setCategories([]);
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleVerify(id: string, verified: boolean) {
    await verifyAdminProvider(id, verified);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this provider?")) return;
    await deleteAdminProvider(id);
    load();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin" className="text-sm text-emerald-700 hover:underline mb-4 inline-block">
          &larr; Admin Dashboard
        </Link>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
          >
            {showForm ? "Cancel" : "Add Provider"}
          </button>
        </div>
        <p className="text-gray-600 mb-8">Manage verified legal-aid providers.</p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 space-y-3">
            <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Organization" value={organization} onChange={(e) => setOrganization(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    categories.includes(cat)
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button disabled={saving} type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save Provider"}
            </button>
          </form>
        )}

        {loading && <p className="text-gray-500">Loading providers...</p>}

        <div className="space-y-4">
          {providers.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-gray-900 font-semibold">{p.name}</p>
                  {p.organization && <p className="text-sm text-gray-600">{p.organization}</p>}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  p.verified ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                }`}>
                  {p.verified ? "Verified" : "Unverified"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.services.map((s) => (
                  <span key={s.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {s.category}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {[p.location, p.phone, p.email].filter(Boolean).join(" · ")}
              </p>
              <div className="flex gap-3 text-sm">
                <button onClick={() => handleVerify(p.id, !p.verified)} className="text-emerald-700 hover:underline">
                  {p.verified ? "Unverify" : "Verify"}
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
