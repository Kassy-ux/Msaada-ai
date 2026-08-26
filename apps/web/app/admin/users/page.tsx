"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminUsers, AdminUser } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin" className="text-sm text-emerald-700 hover:underline mb-4 inline-block">
          &larr; Admin Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600 mb-8">Registered Msaada users.</p>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading && <p className="text-gray-500">Loading users...</p>}

        <div className="space-y-4">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-gray-900 font-semibold">{u.name || "Unnamed User"}</p>
                  <p className="text-sm text-gray-600">{u.phone}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                  {u.role}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {u._count.cases} case{u._count.cases !== 1 ? "s" : ""}
                {u.location && ` · ${u.location}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
