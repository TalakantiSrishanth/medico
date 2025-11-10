"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth", { type: "login", email, password });
      const data = res.data;

      if (data.success && data.user.role === "admin") {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Welcome Admin!");
        router.push("/adminDashboard");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
      toast.error("Something went wrong during login.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <form
        onSubmit={handleLogin}
        className="flex flex-col space-y-3 bg-white/10 p-8 rounded-xl w-80"
      >
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <input
          type="email"
          placeholder="Admin Email"
          className="p-2 rounded text-black"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded text-black"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-red-600 hover:bg-red-700 p-2 rounded">
          Login as Admin
        </button>
      </form>
    </div>
  );
}
