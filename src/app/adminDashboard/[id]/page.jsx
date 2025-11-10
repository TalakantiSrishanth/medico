"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminRespond() {
  const { id } = useParams();
  const router = useRouter();


  const [report, setReport] = useState(null);
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState("Mild");
  const [treatments, setTreatments] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await axios.get(`/api/report/${id}`);
        setReport(res.data.report);
      } catch (err) {
        toast.error("Failed to load report details");
      }
    }
    fetchReport();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(`/api/admin/respond`, {
        report_id: id,
        symptom,
        severity,
        treatments: treatments.split(",").map((t) => t.trim()),
        notes,
      });

      toast.success("Response submitted successfully!");
      router.push("/adminDashboard");
    } catch (err) {
      console.error("Submit response error:", err);
      toast.error("Failed to submit response.");
    }
  }

  if (!report)
    return <p className="text-center text-gray-400 mt-20">Loading report...</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Respond to Report #{id}</h1>

      <div className="bg-white/10 p-6 rounded-lg mb-6">
        <p><strong>Symptom:</strong> {report.symptom}</p>
        <p><strong>Severity:</strong> {report.severity}</p>
        <p><strong>Since:</strong> {report.since_days} days</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white/10 p-6 rounded-lg">
        <label>
          Symptom (optional):
          <input 
            type="text"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder={report.symptom}
            className="w-full p-2 rounded text-shadow-amber-50"
          />
        </label>

        <label>
          Severity:
          <select
            value={severity} onSelect={(e)=> e.target.classList.add("text-white")}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full  p-2 rounded text-black"
          >
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </label>

        <label>
          Treatments (comma separated):
          <input
            type="text"
            value={treatments}
            onChange={(e) => setTreatments(e.target.value)}
            placeholder="e.g. Rest, Hydration, Paracetamol"
            className="w-full p-2 rounded text-shadow-amber-50"
          />
        </label>

        <label>
          Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 rounded text-shadow-amber-50"
          />
        </label>

        <button className="bg-green-600 hover:bg-green-700 p-2 rounded w-full">
          Submit Response
        </button>
      </form>
    </div>
  );
}
