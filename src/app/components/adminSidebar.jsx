"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/adminDashboard", label: "Dashboard", icon: "/dashboard.svg" },
    { href: "/adminDashboard/history", label: "History", icon: "/history.svg" },
  ];

  return (
    <div className="flex flex-col w-48 min-h-screen bg-emerald-900 text-white p-4 space-y-6">
      <h2 className="text-xl font-semibold mb-4 border-b border-emerald-700 pb-2">
        Admin Panel
      </h2>

      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-3 p-2 rounded-lg transition ${
            pathname === link.href
              ? "bg-emerald-700 text-white"
              : "hover:bg-emerald-800 text-gray-200"
          }`}
        >
          <Image src={link.icon} alt="" width={20} height={20} />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
