"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await axios.get("/api/admin/reports");
        setReports(res.data.reports || []);
      } catch (err) {
        console.error("Fetch reports error:", err);
        toast.error("Failed to load reports");
      }
    }
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Pending Reports</h1>

      {reports.length === 0 ? (
        <p className="text-center text-gray-400">No pending reports 🎉</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-md transition hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-blue-200">{r.symptom}</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Since {r.since_days} days
                  </p>
                  <p className="text-sm text-gray-300 mt-2">
                    Severity: <strong>{r.severity}</strong>
                  </p>
                </div>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    r.severity === "Severe"
                      ? "bg-red-600"
                      : r.severity === "Moderate"
                      ? "bg-yellow-400 text-black"
                      : "bg-green-600"
                  }`}
                >
                  {r.severity}
                </span>
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  href={`/adminDashboard/${r.id}`}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
                >
                  Respond →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
