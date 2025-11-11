"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validEmail(e) {
    return /\S+@\S+\.\S+/.test(e);
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!validEmail(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("/api/auth", {
        type: "signup",
        name,
        email,
        password,
      });

      const data = res.data;
      if (data.success) {
        toast.success("Account created successfully. You can login now.");
        router.push("/login");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error("Something went wrong during signup.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm bg-white/6 backdrop-blur-md border border-white/8 rounded-xl p-6 space-y-4 shadow"
        aria-label="User signup form"
      >
        <h1 className="text-2xl font-bold text-center">Create account</h1>

        <label className="text-sm">Full name</label>
        <input
          type="text"
          placeholder="Your name"
          className="w-full p-3 rounded-md bg-transparent border border-white/10 text-white placeholder:text-white/60 focus:ring-2 focus:ring-medico-500 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="text-sm">Email</label>
        <input
          type="email"
          placeholder="you@college.edu"
          className="w-full p-3 rounded-md bg-transparent border border-white/10 text-white placeholder:text-white/60 focus:ring-2 focus:ring-medico-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="text-sm">Password</label>
        <input
          type="password"
          placeholder="Choose a secure password"
          className="w-full p-3 rounded-md bg-transparent border border-white/10 text-white placeholder:text-white/60 focus:ring-2 focus:ring-medico-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-md bg-green-600 hover:bg-green-700 disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Signup"}
        </button>

        <p className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-300 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
