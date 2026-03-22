import { useState } from "react";
import { jobs, companyProfile } from "../api.js";
import {
  Alert, Spinner, EmptyState, LoadingPage, ConfirmModal, SalaryDisplay, DateDisplay,
} from "../shared.jsx";
import { useAsync } from "../useAsync.js";

export function RecruiterJobs({ onEditJob, onViewApplicants, navigateTo }) {
  const { data, loading, error, refetch } = useAsync(() => jobs.getMine(), []);
  const { data: company } = useAsync(() => companyProfile.getOwn(), []);
  const [deleteId, setDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    setDeletingId(id); setDeleteId(null);
    try { await jobs.delete(id); refetch(); }
    catch { /* optional toast */ }
    finally { setDeletingId(null); }
  }

  function handlePostJob() {
    if (company && company.verification_status !== "verified") {
      navigateTo("company");
      return;
    }
    navigateTo("job-create");
  }

  const list = data || [];

  return (
    <div className="page-enter">
      <div className="page-header-row">
        <div>
          <div className="page-title">My Postings</div>
          <div className="page-sub">Manage all active job listings</div>
        </div>
        <button type="button" className="btn btn-primary" onClick={handlePostJob}>+ Post a job</button>
      </div>

      {company && company.verification_status !== "verified" && (
        <Alert type="warn">
          Your company is not verified yet — you must complete verification before posting jobs.{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer", fontWeight: 500 }}
            onClick={() => navigateTo("company")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && navigateTo("company")}>
            Complete verification →
          </span>
        </Alert>
      )}

      {error && <Alert type="danger">{error}</Alert>}
      {loading && <LoadingPage />}

      {!loading && list.length === 0 && (
        <EmptyState
          icon="📢"
          title="No postings yet"
          desc="Create your first job listing to start attracting candidates."
          action={<button type="button" className="btn btn-primary" onClick={() => navigateTo("job-create")}>Post a job</button>}
        />
      )}

      {!loading && list.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {list.map((job) => (
            <div key={job.id} className="card-flat" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ fontWeight: 600, marginBottom: "0.4rem" }}>{job.title}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  {job.location && <span>📍 {job.location}</span>}
                  <span className="badge badge-gold">{job.job_type || job.type || "Full-time"}</span>
                  <SalaryDisplay min={job.salary_min ?? job.min_salary} max={job.salary_max ?? job.max_salary} currency={job.currency} />
                  <span style={{ color: "var(--border-md)" }}>·</span>
                  <span>Posted <DateDisplay date={job.created_at} /></span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0, flexWrap: "wrap" }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onViewApplicants(job)}>
                  Applicants
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEditJob(job)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteId(job.id)}
                  disabled={deletingId === job.id}
                >
                  {deletingId === job.id ? <Spinner size="sm" /> : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete job posting?"
          desc="This will permanently remove the listing and cannot be undone."
          danger
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
