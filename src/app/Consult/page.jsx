"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

export default function Issue() {
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState("Mild");
  const [since, setSince] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please log in first!");
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
        toast.success("Issue submitted successfully")
        setSymptom("");
        setSeverity("Mild");
        setSince("");
      } else {
        toast.error(data.error || "Submission failed.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Something went wrong while submitting the issue.");
    }
  }
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warn("Please login first.");
      redirect("/login");
      return;
    }
  }, [])
  return (
    <div className="h-full bg-zinc-500 flex justify-center items-center">
      <form
        className="border-2 border-solid space-y-7 p-6 rounded-lg bg-white/20"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label htmlFor="symptom" className="font-semibold text-white">
            Enter your symptom
          </label>
          <input
            type="text"
            id="symptom"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            required
            className="p-2 rounded text-black"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="severity" className="font-semibold text-white">
            Choose Your Severity
          </label>
          <select
            id="severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="border p-2 rounded text-black"
          >
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="since" className="font-semibold text-white">
            Since (in days)
          </label>
          <input
            type="number"
            id="since"
            placeholder="e.g., 3"
            value={since}
            onChange={(e) => setSince(e.target.value)}
            className="p-2 rounded text-black"
          />
        </div>

        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
