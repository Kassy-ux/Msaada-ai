import Link from "next/link";

const SECTIONS = [
  { href: "/admin/providers", title: "Providers", description: "Manage verified legal-aid providers" },
  { href: "/admin/legal-documents", title: "Legal Documents", description: "Manage the verified legal knowledge base" },
  { href: "/admin/users", title: "Users", description: "View registered users and their cases" },
  { href: "/admin/cases", title: "Cases", description: "Monitor and update case statuses" },
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage Msaada's data and monitor activity.</p>
        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-emerald-200 transition-colors"
            >
              <p className="text-gray-900 font-semibold">{s.title}</p>
              <p className="text-sm text-gray-600">{s.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
