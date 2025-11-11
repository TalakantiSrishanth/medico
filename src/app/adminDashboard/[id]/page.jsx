"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

export default function AdminReportPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // form state (for resolving)
  const [treatmentsText, setTreatmentsText] = useState(""); // comma-separated
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchReport() {
    setLoading(true);
    try {
      const res = await axios.get(`/api/report/${id}`);
      const rep = res.data?.report ?? res.data;
      setReport(rep || null);

      // prefill form if unresolved OR keep previous values if already set
      const treatmentsArray =
        rep?.typical_treatments ||
        rep?.treatments ||
        rep?.admin_treatments ||
        [];
      if (!isResolved(rep)) {
        setTreatmentsText(Array.isArray(treatmentsArray) ? treatmentsArray.join(", ") : (treatmentsArray || ""));
        setNotes(rep?.notes || rep?.admin_notes || "");
      }
    } catch (err) {
      console.error("Failed to load report", err);
      toast.error("Failed to load report");
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  function isResolved(r) {
    if (!r) return false;
    const status = (r.status || r.state || "").toString().toLowerCase();
    return status === "resolved" || status === "closed" || status === "done";
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
        <div>Loading report…</div>
      </div>
    );

  if (!report)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
        <div className="text-center">
          <p>Report not found.</p>
          <button
            onClick={() => router.push("/adminDashboard")}
            className="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );

  // Extract treatments array robustly
  function getTreatmentsArray(r) {
    const arr =
      r?.typical_treatments ||
      r?.treatments ||
      r?.admin_treatments ||
      [];
    if (!arr) return [];
    if (Array.isArray(arr)) return arr;
    if (typeof arr === "string") {
      return arr.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }

  // If already resolved, show resolved view
  if (isResolved(report)) {
    const treatments = getTreatmentsArray(report);
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <Link href="/adminDashboard" className="text-green-400 hover:text-green-300">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-6">Resolved Report</h1>

        <div className="max-w-3xl bg-white/6 border border-white/8 rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold mb-1 text-blue-200">{report.symptom}</h2>
          <p className="text-sm text-gray-300">Since {report.since_days ?? "—"} days</p>
          <p className="text-sm text-gray-300 mt-1">Severity: <strong>{report.severity}</strong></p>

          <hr className="my-4 border-white/8" />

          <div className="space-y-3 text-gray-200">
            <div>
              <h3 className="text-lg font-semibold">Recommended Treatment</h3>
              {treatments.length ? (
                <ul className="mt-2 list-disc list-inside">
                  {treatments.map((t, i) => (
                    <li key={i} className="text-sm">{t}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-gray-400">No treatment recorded.</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold">Notes</h3>
              <p className="whitespace-pre-line mt-2 text-sm">{report.notes || report.admin_notes || "No notes provided."}</p>
            </div>

            <div className="text-sm text-gray-300">
              <div>Resolved by: <strong>{report.resolved_by || report.admin_name || report.resolver || "Admin"}</strong></div>
              <div>Resolved at: <strong>{new Date(report.resolved_at || report.updated_at || report.updatedAt || Date.now()).toLocaleString()}</strong></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise show form to submit response
  async function handleResolve(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        id: report.id,
        status: "Resolved",
        typical_treatments: treatmentsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        notes: notes,
        resolved_by: (() => {
          try {
            const raw = localStorage.getItem("user");
            const u = raw ? JSON.parse(raw) : null;
            return u?.name || u?.email || "Admin";
          } catch {
            return "Admin";
          }
        })(),
      };

      // Update endpoint — change to match your backend if needed
      const res = await axios.post("/api/admin/respond", payload);
      if (res.data?.success) {
        toast.success("Report resolved successfully");
        // re-fetch fresh report to show resolved view
        await fetchReport();
      } else {
        toast.error(res.data?.error || "Failed to resolve report");
      }
    } catch (err) {
      console.error("Resolve error", err);
      toast.error("Something went wrong while resolving");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <Link href="/adminDashboard" className="text-green-400 hover:text-green-300">
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-6">Respond to Report</h1>

      <div className="max-w-3xl bg-white/6 border border-white/8 rounded-xl p-6 shadow">
        <h2 className="text-2xl font-semibold mb-2 text-blue-200">{report.symptom}</h2>
        <p className="text-sm text-gray-300 mb-4">Severity: <strong>{report.severity}</strong> • Since {report.since_days} days</p>

        <form onSubmit={handleResolve} className="space-y-4">
          <label className="block">
            <div className="text-sm font-medium text-gray-200 mb-1">Typical Treatments (comma separated)</div>
            <input
              value={treatmentsText}
              onChange={(e) => setTreatmentsText(e.target.value)}
              placeholder="e.g., Paracetamol 500mg, Rest, Hydration"
              className="w-full p-3 rounded-md bg-transparent border border-white/10 text-white placeholder:text-white/60 focus:ring-2 focus:ring-medico-500 outline-none"
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-gray-200 mb-1">Notes / Instructions</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Add any additional advice or follow-up instructions..."
              className="w-full p-3 rounded-md bg-transparent border border-white/10 text-white placeholder:text-white/60 focus:ring-2 focus:ring-medico-500 outline-none"
            />
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/adminDashboard")}
              className="px-4 py-2 rounded-md bg-white/6 hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 rounded-md font-medium ${
                submitting ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting ? "Saving…" : "Submit & Resolve"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
