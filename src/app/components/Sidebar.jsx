"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("medico_sidebar_collapsed") === "true";
    setCollapsed(saved);

    try {
      const raw = localStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("medico_sidebar_collapsed", next);
  }

  const links = [
    { href: "/", label: "Home", icon: "/home.svg" },
    { href: "/Consult", label: "Consult", icon: "/consult.svg" },
    { href: "/Status", label: "Status", icon: "/status.svg" },
  ];

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={`flex flex-col items-stretch shrink-0 transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-56"} 
        bg-gradient-to-b from-teal-900/90 to-teal-800/80 text-zinc-100`}
      aria-label="Sidebar"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/medico.svg" alt="logo" width={34} height={34} />
          {!collapsed && <span className="font-semibold text-lg">Medico</span>}
        </Link>

        <button
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1 rounded-md hover:bg-white/6 transition"
        >
          <svg
            className={`w-5 h-5 transform transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3">
        <ul className="space-y-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                title={l.label}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-150
                  ${
                    isActive(l.href)
                      ? "bg-white/10 text-white shadow"
                      : "hover:bg-white/4 text-zinc-100/90"
                  }
                  ${collapsed ? "justify-center" : ""}`}
              >
                <Image src={l.icon} alt={l.label} width={20} height={20} />
                {!collapsed && <span className="text-base">{l.label}</span>}
                {isActive(l.href) && !collapsed && (
                  <span className="ml-auto inline-block text-xs px-2 py-0.5 bg-medico-500 rounded-full text-black">
                    Active
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/6">
        {!collapsed ? (
          <div className="text-sm text-zinc-200">
            <div className="font-medium">Signed in as</div>
            <div className="text-xs text-zinc-300">
              {user?.name || user?.email || "Guest"}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Image
              src="/user.svg"
              alt="User"
              width={18}
              height={18}
              className="opacity-70"
            />
          </div>
        )}
      </div>
    </aside>
  );
}
