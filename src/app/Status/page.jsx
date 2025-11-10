"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { ClockLoader } from "react-spinners";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { redirect } from "next/navigation";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function StatusPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all"); 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warn("Please login first.");
       redirect("/login");
      return;
    }

    async function fetchReports() {
      try {
        const res = await axios.get(`/api/report?user_id=${user.id}`);
        setReports(res.data.reports || []);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <ClockLoader
          loading={isLoading}
          cssOverride={override}
          size={120}
          color="#4ade80"
        />
      </div>
    );
  const filteredReports =
    filterStatus === "all"
      ? reports
      : reports.filter(
          (r) => r.status.toLowerCase() === filterStatus.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="flex justify-between">

      <h1 className="text-3xl grow font-bold mb-6 text-center">My Reports</h1>

     
      <div className="flex justify-center mb-6">
        <Select onValueChange={(value) => setFilterStatus(value)}>
          <SelectTrigger className="w-48 bg-white/10 text-white border border-white/20">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
        </div>

      {filteredReports.length === 0 ? (
        <p className="text-center text-gray-400">No reports found.</p>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white/10 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{report.symptom}</h2>
                <p className="text-sm text-gray-300">
                  Severity: {report.severity} | Since: {report.since_days} days
                </p>
                <p
                  className={`text-sm mt-1 ${
                    report.status === "Resolved"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  Status: {report.status}
                </p>
              </div>

              {report.status === "Resolved" ? (
                <Link
                  href={`/Status/${report.id}`}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                >
                  View Details
                </Link>
              ) : (
                <span className="text-gray-400 text-sm">Waiting...</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
