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
import { useRouter } from "next/navigation";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function StatusPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [reminding, setReminding] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warn("Please login first.");
      router.push("/login");
      return;
    }

    async function fetchReports() {
      setLoading(true);
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
  }, [router]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <ClockLoader loading={isLoading} cssOverride={override} size={80} color="#4ade80" />
      </div>
    );

  const filteredReports = (filterStatus === "all"
    ? reports
    : reports.filter(
        (r) => (r.status || "").toLowerCase() === filterStatus.toLowerCase()
      )
  ).filter((r) => {
    if (!search) return true;
    return (r.symptom || "").toLowerCase().includes(search.toLowerCase());
  });

  async function handleRemind(reportId) {
    setReminding((s) => ({ ...s, [reportId]: true }));
    try {
      await axios.post(`/api/report/${reportId}/remind`);
      toast.success("Admin has been notified.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reminder.");
    } finally {
      setReminding((s) => ({ ...s, [reportId]: false }));
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">My Reports</h1>
            <p className="text-sm text-gray-300 mt-1">
              You have{" "}
              <span className="font-semibold text-white">{reports.length}</span>{" "}
              total reports — showing{" "}
              <span className="font-semibold text-white">
                {filteredReports.length}
              </span>
              .
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-72">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search symptoms..."
                className="w-full p-2 rounded-md bg-white/10 placeholder:text-gray-200 text-white outline-none border border-white/20 focus:ring-2 focus:ring-white"
                aria-label="Search reports"
              />
            </div>

           {/* Filter Dropdown - controlled Select so only one label is shown */}
<div>
  <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value || "all")}>
    <SelectTrigger className="w-44 bg-white/20 text-gray-200 font-medium border border-white/30 focus:ring-2 focus:ring-blue-400 flex items-center justify-between px-3 py-2">
      {/* let SelectValue render the visible label */}
      <SelectValue>
        {/* keep same gray color as search placeholder */}
        <span className="text-gray-200 font-medium">{`Filter: ${filterStatus}`}</span>
      </SelectValue>
      <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </SelectTrigger>

    <SelectContent className="bg-slate-800 text-white border border-white/10 shadow-md">
      <SelectItem value="all" className="hover:bg-blue-600/40 focus:bg-blue-600/50 text-gray-200">
        All
      </SelectItem>
      <SelectItem value="Pending" className="hover:bg-yellow-600/40 focus:bg-yellow-600/50 text-gray-200">
        Pending
      </SelectItem>
      <SelectItem value="Resolved" className="hover:bg-green-600/40 focus:bg-green-600/50 text-gray-200">
        Resolved
      </SelectItem>
    </SelectContent>
  </Select>
</div>

          </div>
        </header>

        {/* Report List */}
        {filteredReports.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No reports found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <article
                key={report.id}
                className="bg-white/6 p-4 rounded-xl flex flex-col justify-between gap-4 border border-white/8 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{report.symptom}</h2>
                    <p className="text-sm text-gray-300 mt-1">
                      Severity:{" "}
                      <span className="font-medium">{report.severity}</span> | Since:{" "}
                      <span className="font-medium">
                        {report.since_days ?? "—"}
                      </span>{" "}
                      days
                    </p>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-3">
                      {report.notes || ""}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        (report.status || "").toLowerCase() === "resolved"
                          ? "bg-green-400 text-black"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {report.status || "Pending"}
                    </span>

                    <div className="text-xs text-gray-400 mt-1">
                      ID: {report.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/Status/${report.id}`}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm"
                    >
                      View Details
                    </Link>

                    {report.status !== "Resolved" && (
                      <button
                        onClick={() => handleRemind(report.id)}
                        disabled={!!reminding[report.id]}
                        className="px-3 py-1 rounded bg-medico-500 hover:bg-medico-700 text-sm text-black disabled:opacity-60"
                        aria-label={`Remind admin for report ${report.id}`}
                      >
                        {reminding[report.id] ? "Notifying..." : "Remind Admin"}
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-gray-400">
                    {new Date(
                      report.created_at || report.createdAt || Date.now()
                    ).toLocaleString()}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
