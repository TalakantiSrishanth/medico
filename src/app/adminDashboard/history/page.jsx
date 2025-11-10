"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminHistory() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    
    async function fetchResolved() {
      try {
        const res = await axios.get("/api/admin/history");
        setReports(res.data.reports);
      } catch (err) {
        console.error("Fetch history error:", err);
        toast.error("Failed to load resolved reports.");
      }
    }
    fetchResolved();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Resolved Reports</h1>

      {reports.length === 0 ? (
        <p className="text-center text-gray-400">No resolved reports yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r.id} className="bg-white/10 p-6 rounded-lg shadow">
              <p><strong>Symptom:</strong> {r.symptom}</p>
              <p><strong>Severity:</strong> {r.severity}</p>
              <p><strong>Resolved:</strong> ✅</p>
              <p className="text-sm text-gray-400 mt-2 italic">
                {r.notes}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
