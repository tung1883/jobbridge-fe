import { useState, useEffect, useCallback } from "react";
import { jobs, savedJobs } from "../api.js";
import { Spinner, Alert, Field, EmptyState, LoadingPage } from "../shared.jsx";
import { JOB_TYPES, CURRENCIES } from "./constants.js";
import { salaryStepForCurrency, validateSalaryMinMax } from "./salary.js";
import { JobCard } from "./JobCard.jsx";
import { JobDetailModal } from "./JobDetailModal.jsx";

const EMPTY_FILTERS = { search: "", location: "", minSalary: "", maxSalary: "", currency: "", type: "" };

export function JobsBrowse({ user }) {
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const [results, setResults] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [fetchErr, setFetchErr] = useState("");
  const [saveErr, setSaveErr] = useState("");
  const [selected, setSelected] = useState(null);
  const [savedIds, setSavedIds] = useState(() => new Set());

  const setF = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  const loadJobs = useCallback(async (f) => {
    const rangeErr = validateSalaryMinMax(f.minSalary, f.maxSalary);
    if (rangeErr) {
      setFetchErr(rangeErr);
      return;
    }
    setFetching(true);
    setFetchErr("");
    try {
      const res = await jobs.search({
        search: f.search || undefined,
        location: f.location || undefined,
        minSalary: f.minSalary || undefined,
        maxSalary: f.maxSalary || undefined,
        currency: f.currency || undefined,
        type: f.type || undefined,
      });
      setResults(res?.data ?? []);
    } catch (e) {
      setFetchErr(e.message || "Could not load jobs.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    loadJobs({ ...EMPTY_FILTERS });
  }, [loadJobs]);

  useEffect(() => {
    if (!user) {
      try {
        const ids = JSON.parse(localStorage.getItem("tb_saved_ids") || "[]");
        setSavedIds(new Set(ids.map(String)));
      } catch {
        setSavedIds(new Set());
      }
      return undefined;
    }
    let cancelled = false;
    savedJobs
      .list()
      .then((list) => {
        if (!cancelled) setSavedIds(new Set(list.map((j) => String(j.id))));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user]);

  async function toggleSave(job) {
    setSaveErr("");
    const id = String(job.id);
    if (user) {
      try {
        if (savedIds.has(id)) {
          await savedJobs.unsave(job.id);
          setSavedIds((prev) => {
            const n = new Set(prev);
            n.delete(id);
            return n;
          });
        } else {
          await savedJobs.save(job.id);
          setSavedIds((prev) => new Set([...prev, id]));
        }
      } catch (e) {
        setSaveErr(e.message || "Could not update saved jobs.");
      }
      return;
    }
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        try {
          const saved = JSON.parse(localStorage.getItem("tb_saved_jobs") || "[]");
          localStorage.setItem("tb_saved_jobs", JSON.stringify(saved.filter((j) => String(j.id) !== id)));
        } catch { /* ignore */ }
      } else {
        next.add(id);
        try {
          const saved = JSON.parse(localStorage.getItem("tb_saved_jobs") || "[]");
          if (!saved.find((j) => String(j.id) === id)) saved.push(job);
          localStorage.setItem("tb_saved_jobs", JSON.stringify(saved));
        } catch { /* ignore */ }
      }
      localStorage.setItem("tb_saved_ids", JSON.stringify([...next]));
      return next;
    });
  }

  const step = salaryStepForCurrency(filters.currency || "USD");

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-title">Browse Jobs</div>
        <div className="page-sub">Search thousands of verified listings</div>
      </div>

      <div className="card filter-bar-card" style={{ marginBottom: "1.5rem" }}>
        <div className="filter-bar-grid">
          <Field label="Keyword" style={{ marginBottom: 0 }}>
            <input
              className="field-input"
              placeholder="Title, skill, keyword…"
              value={filters.search}
              onChange={(e) => setF("search", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadJobs(filters)}
            />
          </Field>
          <Field label="Location" style={{ marginBottom: 0 }}>
            <input
              className="field-input"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setF("location", e.target.value)}
            />
          </Field>
          <Field label="Currency" style={{ marginBottom: 0 }}>
            <select className="field-select" value={filters.currency} onChange={(e) => setF("currency", e.target.value)}>
              <option value="">Any</option>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Min salary" style={{ marginBottom: 0 }}>
            <input
              className="field-input"
              type="number"
              placeholder="e.g. 50000"
              min={0}
              step={step}
              value={filters.minSalary}
              onChange={(e) => setF("minSalary", e.target.value === "" ? "" : String(Math.max(0, Number(e.target.value) || 0)))}
            />
          </Field>
          <Field label="Max salary" style={{ marginBottom: 0 }}>
            <input
              className="field-input"
              type="number"
              placeholder="e.g. 120000"
              min={0}
              step={step}
              value={filters.maxSalary}
              onChange={(e) => setF("maxSalary", e.target.value === "" ? "" : String(Math.max(0, Number(e.target.value) || 0)))}
            />
          </Field>
          <Field label="Type" style={{ marginBottom: 0 }}>
            <select className="field-select" value={filters.type} onChange={(e) => setF("type", e.target.value)}>
              <option value="">All types</option>
              {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <div className="filter-bar-actions" style={{ paddingBottom: "0.05rem" }}>
            <button type="button" className="btn btn-primary" style={{ height: "38px", width: "100%" }} onClick={() => loadJobs(filters)} disabled={fetching}>
              {fetching ? <Spinner size="sm" white /> : "Search"}
            </button>
          </div>
        </div>
      </div>

      {fetchErr && <Alert type="danger">{fetchErr}</Alert>}
      {saveErr && <Alert type="danger" onClose={() => setSaveErr("")}>{saveErr}</Alert>}

      {fetching && !results && <LoadingPage />}

      {results && (
        <>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--muted)", marginBottom: "1rem" }}>
            {results.length} result{results.length !== 1 ? "s" : ""}
            {(filters.search || filters.location) && ` for "${[filters.search, filters.location].filter(Boolean).join(", ")}"`}
          </div>
          {results.length === 0 ? (
            <EmptyState icon="🔍" title="No jobs found" desc="Try broadening your search terms or removing filters." />
          ) : (
            <div className="grid-auto-280">
              {results.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onView={() => setSelected(job)}
                  savedIds={savedIds}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          )}
        </>
      )}

      {selected && (
        <JobDetailModal
          job={selected}
          onClose={() => setSelected(null)}
          user={user}
          onApplied={() => {}}
        />
      )}
    </div>
  );
}
