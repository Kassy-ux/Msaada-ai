"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/get-help", label: "Get Help" },
  { href: "/cases", label: "My Cases" },
  { href: "/providers", label: "Find Help" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-6 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-emerald-700">
          Msaada
        </Link>
        <div className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-emerald-100 text-emerald-800 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
