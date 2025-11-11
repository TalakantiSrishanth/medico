"use client";

import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

export default function ClientHome() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getdiseases() {
      try {
        const res = await axios.get("/api/diseases");
        setData(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    getdiseases();
  }, []);

  const filtered = data.filter((item) => {
    if (!search) return true;
    return item.symptom?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen text-white">
      <header
        className="relative h-52 md:h-64 bg-medical-hero bg-cover bg-center flex items-center"
        style={{ backgroundBlendMode: "overlay" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        <div className="relative container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Medico — Quick Medical Consults</h1>
          <p className="text-sm text-gray-300 mt-2 max-w-xl">
            Report symptoms, get guidance from the admin team, and track your issue history — all in one place.
          </p>

          <div className="mt-4 w-full max-w-md">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search symptoms (e.g., fever, cough)..."
              className="w-full p-3 rounded-full bg-white/8 placeholder:text-gray-200 text-white outline-none ring-1 ring-white/6 focus:ring-2 focus:ring-medico-500 transition"
            />
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card key={item.id} data={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 mt-8">No symptoms match your search.</p>
        )}
      </section>
    </main>
  );
}
