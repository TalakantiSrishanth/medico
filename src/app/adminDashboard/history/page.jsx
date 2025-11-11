"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClockLoader } from "react-spinners";

const loaderStyle = {
  display: "block",
  margin: "0 auto",
  borderColor: "transparent",
};

export default function AdminHistory() {
  const [reports, setReports] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  useEffect(() => {
    async function fetchResolved() {
      setLoading(true);
      try {
        const res = await axios.get("/api/admin/history");
        setReports(res.data.reports || []);
      } catch (err) {
        console.error("Fetch history error:", err);
        toast.error("Failed to load resolved reports.");
      } finally {
        setLoading(false);
      }
    }
    fetchResolved();
  }, []);

  const filtered = reports.filter((r) =>
    (r.symptom || "").toString().toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const pageItems = filtered.slice((pageSafe - 1) * PER_PAGE, pageSafe * PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <ClockLoader loading={true} cssOverride={loaderStyle} size={80} color="#60a5fa" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Resolved Reports</h1>
            <p className="text-sm text-gray-300 mt-1">
              Total resolved: <span className="font-semibold text-white">{reports.length}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by symptom..."
              className="w-full md:w-72 p-2 rounded-md bg-white/6 placeholder:text-gray-300 text-white outline-none border border-white/10"
              aria-label="Search resolved reports"
            />
          </div>
        </header>

        {/* Reports List */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No resolved reports found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pageItems.map((r) => (
                <article
                  key={r.id}
                  className="bg-white/6 p-4 rounded-xl border border-white/8 shadow flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{r.symptom}</h2>
                      <p className="text-sm text-gray-300 mt-1">
                        Severity: <span className="font-medium">{r.severity}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-3">{r.notes || "—"}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="inline-block px-3 py-1 rounded-full bg-green-400 text-black text-sm font-medium">
                        Resolved
                      </span>
                      <div className="text-xs text-gray-300 mt-2">
                        by {r.resolved_by || r.admin_name || "Admin"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <div>
                      Resolved at:{" "}
                      {new Date(r.resolved_at || r.updated_at || r.created_at || Date.now()).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/adminDashboard/${r.id}`}
                        className="text-sm px-3 py-1 rounded bg-white/7 hover:bg-white/10"
                      >
                        View
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(String(r.id));
                          toast.info("ID copied to clipboard");
                        }}
                        className="px-2 py-1 rounded bg-white/6 hover:bg-white/9 text-xs"
                        title="Copy report id"
                      >
                        Copy ID
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <footer className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-300">
                Showing{" "}
                <span className="text-white font-medium">{(pageSafe - 1) * PER_PAGE + 1}</span> —{" "}
                <span className="text-white font-medium">
                  {Math.min(pageSafe * PER_PAGE, filtered.length)}
                </span>{" "}
                of <span className="text-white font-medium">{filtered.length}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pageSafe === 1}
                  className="px-3 py-1 rounded bg-white/6 hover:bg-white/9 disabled:opacity-50"
                >
                  Prev
                </button>
                <div className="px-3 py-1 rounded bg-white/6 flex items-center">
                  Page {pageSafe} / {totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={pageSafe === totalPages}
                  className="px-3 py-1 rounded bg-white/6 hover:bg-white/9 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
