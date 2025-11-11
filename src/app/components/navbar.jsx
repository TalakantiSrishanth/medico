"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [dark, setDark] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || "/";
  const homeHref = isAdminUser ? "/adminDashboard" : "/";

  useEffect(() => {
    // read user info from localStorage
    try {
      const raw = localStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      setIsLoggedIn(!!u);
      setIsAdminUser(!!u && u.role === "admin");
    } catch {
      setIsLoggedIn(false);
      setIsAdminUser(false);
    }

    const saved = localStorage.getItem("medico_dark") === "true";
    setDark(saved);
    if (saved) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [pathname]);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("medico_dark", next);
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }

  function handleLogout() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  localStorage.clear();
  setIsLoggedIn(false);
  setIsAdminUser(false);

  if (user && user.name) {
    toast.info(`${user.name} has been logged out.`, { theme: "dark" });
  } else {
    toast.info("You have been logged out.", { theme: "dark" });
  }

  router.push("/");
}

  const isActive = (href) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <nav className="flex items-center justify-between px-6 py-3 shadow-soft bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link href={homeHref} className="flex items-center gap-3">
          <Image src="/medico.svg" alt="Logo" width={44} height={44} />
          <span className="text-2xl font-bold tracking-tight">Medico</span>
        </Link>

        <div className="hidden md:flex items-center ml-6 gap-4">
          {!isAdminUser ? (
            <>
              <Link href="/" className={`text-sm ${isActive("/") ? "text-white font-semibold" : "hover:text-medico-100"}`}>Home</Link>
              <Link href="/Consult" className={`text-sm ${isActive("/Consult") ? "text-white font-semibold" : "hover:text-medico-100"}`}>Consult</Link>
              <Link href="/Status" className={`text-sm ${isActive("/Status") ? "text-white font-semibold" : "hover:text-medico-100"}`}>Status</Link>
            </>
          ) : (
            <>
              <Link href="/adminDashboard" className={`text-sm ${isActive("/adminDashboard") ? "text-white font-semibold" : "hover:text-medico-100"}`}>Dashboard</Link>
              <Link href="/adminDashboard/history" className={`text-sm ${isActive("/adminDashboard/history") ? "text-white font-semibold" : "hover:text-medico-100"}`}>History</Link>
            </>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button onClick={toggleDark} aria-label="Toggle theme" className="p-2 rounded-md hover:bg-white/5 transition">
          {dark ? "🌙" : "☀️"}
        </button>

        {isLoggedIn ? (
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Logout</button>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-blue-300 text-sm">User Login</Link>
            <Link href="/adminLogin" className="hover:text-red-400 text-sm">Admin Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
