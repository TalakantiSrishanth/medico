"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const rawPathname = usePathname() || "/";
  const pathname = rawPathname.replace(/\/$/, "") || "/"; // normalize trailing slash
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("medico_admin_sidebar_collapsed") === "true";
    setCollapsed(saved);
  }, []);

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("medico_admin_sidebar_collapsed", next);
  }

  const links = [
    { href: "/adminDashboard", label: "Dashboard", icon: "/images/dashboard.png" },
    { href: "/adminDashboard/history", label: "History", icon: "/images/history.png" },
  ];

  function isActiveLink(linkHref) {
    const normalized = (linkHref || "").replace(/\/$/, "");
    if (normalized === "/adminDashboard") {
      return pathname === "/adminDashboard";
    }
    return pathname === normalized || pathname.startsWith(normalized + "/");
  }

  return (
    <aside
      className={`flex flex-col items-stretch shrink-0 transition-all duration-200 ease-in-out
        ${collapsed ? "w-16" : "w-56"} bg-gradient-to-b from-emerald-900/95 to-emerald-800/90 text-white`}
      aria-label="Admin Sidebar"
    >
      <div className="flex items-center justify-between px-3 py-4">
        <div className="flex items-center gap-2">
          <Image src="/images/admin_panel.jpg" alt="Admin Logo" width={32} height={32} />
          {!collapsed && <span className="font-semibold text-lg tracking-wide">Admin Panel</span>}
        </div>

        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1 rounded-md hover:bg-white/10 transition"
        >
          <svg
            className={`w-5 h-5 transform transition-transform ${collapsed ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-2 py-3">
        <ul className="space-y-1">
          {links.map((link) => {
            const active = isActiveLink(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  title={link.label}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-150
                    ${active ? "bg-emerald-700/80 text-white shadow-md" : "hover:bg-emerald-800/60 text-gray-200"}
                    ${collapsed ? "justify-center" : ""}`}
                >
                  <Image src={link.icon} alt={link.label} width={22} height={22} />
                  {!collapsed && <span className="text-base font-medium">{link.label}</span>}
                  {active && !collapsed && (
                    <span className="ml-auto text-xs px-2 py-0.5 bg-white/20 rounded-full">Active</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        {!collapsed ? (
          <div className="text-sm text-gray-200">
            <div className="font-medium">Logged in as</div>
            <div className="text-xs text-gray-300 mt-1">Admin</div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="sr-only">Admin</span>
            <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
              <path d="M6 20v-1c0-2.21 3.58-4 6-4s6 1.79 6 4v1" />
            </svg>
          </div>
        )}
      </div>
    </aside>
  );
}
