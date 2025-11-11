"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ReportDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warn("Please login first.");
      router.push("/login");
      return;
    }
    async function fetchReport() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/report/${id}`);
        setReport(res.data.report || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load report details");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchReport();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
        <div className="text-gray-300">Loading report…</div>
      </div>
    );

  if (!report)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
        <div className="text-center text-gray-300">
          <p>Report not found.</p>
          <button
            onClick={() => router.push("/Status")}
            className="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
          >
            Back to Status
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/Status" className="text-green-400 hover:text-green-300">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold">Report Details</h1>
      </div>

      <div className="max-w-3xl bg-white/6 border border-white/8 rounded-xl p-6 shadow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1">{report.symptom}</h2>
            <p className="text-sm text-gray-300">Since {report.since_days ?? "—"} days</p>
            <p className="text-sm text-gray-300 mt-1">Submitted by: {report.user_name || "You"}</p>
          </div>

          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                report.status === "Resolved"
                  ? "bg-green-600 text-black"
                  : report.status === "Pending"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-500 text-white"
              }`}
            >
              {report.status}
            </span>

            <div className="mt-3 text-xs text-gray-300">
              Severity: <strong>{report.severity}</strong>
            </div>
          </div>
        </div>

        <hr className="my-4 border-white/8" />

        <div className="text-gray-200">
          <p className="mb-3"><strong>Notes / Symptoms:</strong></p>
          <p className="whitespace-pre-line">{report.notes || "No additional notes provided."}</p>
        </div>

        {report.status === "Resolved" && (
          <>
            <hr className="my-4 border-white/8" />
            <h3 className="text-lg font-semibold text-green-300 mb-2">Admin Response</h3>
            <p><strong>Treatment:</strong> {report.typical_treatments?.join(", ") || "—"}</p>
            <p className="mt-2"><strong>Notes:</strong> {report.notes || "—"}</p>
          </>
        )}

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={() => router.push("/Status")}
            className="px-4 py-2 rounded bg-white/6 hover:bg-white/10"
          >
            Back
          </button>
          {report.status !== "Resolved" && (
            <button
              onClick={async () => {
                try {
                  await axios.post(`/api/report/${id}/remind`);
                  toast.success("Admin has been notified.");
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to send reminder.");
                }
              }}
              className="px-4 py-2 rounded bg-medico-500 hover:bg-medico-700 text-black"
            >
              Remind Admin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
