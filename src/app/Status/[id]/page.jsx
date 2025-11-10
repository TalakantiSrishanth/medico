"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
export default function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await axios.get(`/api/report/${id}`);
        setReport(res.data.report);
      } catch {
        toast.error("Failed to load report details");
      }
    }
    fetchReport();
  }, [id]);

  if (!report) return <p className="text-center text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <Link className="text-green-600 text-2xl hover:text-blue-400" href="/Status">Back</Link>
      <h1 className="text-3xl font-bold mb-6">Report Details</h1>

      <div className="bg-white/10 p-6 rounded-lg">
        <p><strong>Symptom:</strong> {report.symptom}</p>
        <p><strong>Severity:</strong> {report.severity}</p>
        <p><strong>Since:</strong> {report.since_days} days</p>
        <p><strong>Status:</strong> {report.status}</p>

        {report.status === "Resolved" && (
          <>
            <hr className="my-4 border-gray-700" />
            <h2 className="text-xl font-semibold text-green-400">Admin Response</h2>
            <p><strong>Treatment:</strong> {report.typical_treatments?.join(", ")}</p>
            <p><strong>Notes:</strong> {report.notes}</p>
          </>
        )}
      </div>
    </div>
  );
}
