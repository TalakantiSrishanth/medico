"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function validEmail(e) {
    return /\S+@\S+\.\S+/.test(e);
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!validEmail(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/auth", {
        type: "login",
        email,
        password,
      });
      const data = res.data;

      if (data.success && data.user.role === "user") {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(`Welcome, ${data.user.name || "user"}!`);
        router.push("/");
      } else if (data.user?.role === "admin") {
        toast.warn("Admins must login via Admin Login page.");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white/6 backdrop-blur-md border border-white/8 rounded-xl p-6 space-y-4 shadow"
        aria-label="User login form"
      >
        <h1 className="text-2xl font-bold text-center">User Login</h1>

        <label className="text-sm">Email</label>
        <input
          type="email"
          placeholder="you@college.edu"
          className="w-full p-3 rounded-md bg-transparent border border-white/10 text-white placeholder:text-white/60 focus:ring-2 focus:ring-medico-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required
        />

        <label className="text-sm">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-3 rounded-md bg-transparent border border-white/10 text-white placeholder:text-white/60 focus:ring-2 focus:ring-medico-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="flex items-center justify-center text-sm text-gray-300">
         <div> Dont have an account?<Link href="/signup" className="text-blue-300 hover:underline">
            Create account
          </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
