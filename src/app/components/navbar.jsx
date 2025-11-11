"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname=usePathname();
   useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [pathname]);


  function handleLogout() {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push("/"); 
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-slate-800 text-white">
     
      <div className="flex items-center gap-2">
        <Link href="/" className="flex gap-2 items-center">
          <Image src="/medico.svg" alt="Logo" width={40} height={40} />
          <h1 className="font-bold text-2xl">Medico</h1>
        </Link>
      </div>

     
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
        >
          Logout
        </button>
      ) : (
        <div className="flex gap-4">
          <Link href="/login" className="hover:text-blue-300">
            User Login
          </Link>
          <Link href="/adminLogin" className="hover:text-red-400">
            Admin Login
          </Link>
        </div>
      )}
    </nav>
  );
}
