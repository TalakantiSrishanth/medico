"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
     const router = useRouter();
  async function handleSignup(e) {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth", {
        type: "signup",
        name,
        email,
        password,
      });

      const data = res.data;
      if (data.success) {
      toast.success("Account created successfully");
       router.push("/");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error("Something went wrong during signup.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <form
        onSubmit={handleSignup}
        className="flex flex-col space-y-3 bg-white/10 p-8 rounded-xl w-80"
      >
        <h1 className="text-2xl font-bold text-center">User Signup</h1>
        <input
          type="text"
          placeholder="Name"
          className="p-2 rounded text-white"
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button className="bg-green-600 hover:bg-green-700 p-2 rounded">
          Signup
        </button>
        <p className="font-light text-center">
          Have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
