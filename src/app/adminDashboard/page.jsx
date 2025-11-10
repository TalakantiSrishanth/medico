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
        setReports(res.data.reports);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r.id} className="bg-white/10 p-6 rounded-lg shadow">
              <p><strong>Symptom:</strong> {r.symptom}</p>
              <p><strong>Severity:</strong> {r.severity}</p>
              <p><strong>Since:</strong> {r.since_days} days</p>
              <Link
                href={`/adminDashboard/${r.id}`}
                className="mt-4 inline-block text-blue-400 hover:text-blue-300"
              >
                Respond →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
