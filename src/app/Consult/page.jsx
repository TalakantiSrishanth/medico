"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

export default function Issue() {
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState("Mild");
  const [since, setSince] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warn("Please login first.");
      redirect("/login");
      return;
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast.warn("Please log in first!");
        redirect("/login");
        return;
      }

      const res = await axios.post("/api/report", {
        user_id: user.id,
        symptom,
        severity,
        since_days: since,
      });

      const data = res.data;
      if (data.success) {
        toast.success("Issue submitted successfully");
        setSymptom("");
        setSeverity("Mild");
        setSince("");
      } else {
        toast.error(data.error || "Submission failed.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Something went wrong while submitting the issue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 p-6 rounded-xl shadow-lg"
        aria-label="Report an issue form"
      >
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Report an issue</h2>

        <label htmlFor="symptom" className="block text-sm font-medium text-slate-700">
          Symptom
        </label>
        <input
          id="symptom"
          type="text"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          required
          className="mt-1 mb-4 w-full p-3 rounded-md border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medico-500"
          placeholder="Describe your symptom (e.g., headache, fever)"
        />

        <label htmlFor="severity" className="block text-sm font-medium text-slate-700">
          Severity
        </label>
        {/* Use explicit light background & dark text so options are always visible */}
        <select
          id="severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="mt-1 mb-4 w-full p-3 rounded-md border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-medico-500"
        >
          <option value="Mild">Mild</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
        </select>

        <label htmlFor="since" className="block text-sm font-medium text-slate-700">
          Since (days)
        </label>
        <input
          id="since"
          type="number"
          value={since}
          onChange={(e) => setSince(e.target.value)}
          className="mt-1 mb-6 w-full p-3 rounded-md border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medico-500"
          placeholder="e.g., 3"
          min="0"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded-md font-medium ${
              submitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
