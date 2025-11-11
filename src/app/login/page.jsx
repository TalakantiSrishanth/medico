"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth", {
        type: "login",
        email,
        password,
      });

      const data = res.data;

      if (data.success && data.user.role === "user") {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(`Welcome, ${data.user.name}!`);
        router.push("/");
      } else if (data.user?.role === "admin") {
        toast.warn("Admins must login via Admin Login page.");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Enter valid credentitals");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <form
        onSubmit={handleLogin}
        className="flex flex-col space-y-3 bg-white/10 p-8 rounded-xl w-80"
      >
        <h1 className="text-2xl font-bold text-center">User Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded text-white"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded text-white"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded">
          Login
        </button>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
