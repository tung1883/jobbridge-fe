import { useState, useEffect } from "react";
import { applications, cvs, jobs } from "../api.js";
import { Spinner, Alert, Field, Modal, SalaryDisplay } from "../shared.jsx";
import { useSubmit } from "./hooks.js";
import { fileUrl } from "./utils.js";

export function JobDetailModal({ job, onClose, user, onApplied }) {
  const [cvList, setCvList] = useState([]);
  const [selectedCv, setSelectedCv] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [applied, setApplied] = useState(false);
  const { loading, error, success, submit } = useSubmit(async () => {
    if (!selectedCv) throw new Error("Please select a CV first.");
    await applications.apply(job.id, selectedCv);
    setApplied(true);
    onApplied?.();
    return "Application submitted!";
  });

  useEffect(() => {
    if (user) {
      cvs.list().then(setCvList).catch(() => {});
      jobs.getCompany(job.id).then(setCompanyInfo).catch(() => {});
    }
  }, [job.id, user]);

  return (
    <Modal title={job.title} onClose={onClose} wide>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {job.type && <span className="badge badge-gold">{job.type}</span>}
        {job.location && <span className="badge badge-ink">📍 {job.location}</span>}
        {job.is_verified && <span className="badge badge-sage">✓ Verified employer</span>}
      </div>

      <div style={{ fontSize: "var(--text-md)", fontWeight: 600, marginBottom: "1.25rem", color: "var(--sage)" }}>
        <SalaryDisplay min={job.min_salary} max={job.max_salary} currency={job.currency} />
        {job.currency && job.min_salary ? <span style={{ fontSize: "var(--text-sm)", color: "var(--muted)", fontWeight: 400 }}> / year</span> : null}
      </div>

      {companyInfo && (
        <div style={{ background: "var(--cream)", borderRadius: "var(--r-md)", padding: "1rem", marginBottom: "1.25rem", display: "flex", gap: "0.85rem", alignItems: "center" }}>
          <div style={{ width: 42, height: 42, borderRadius: 8, background: "var(--chalk)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", overflow: "hidden", flexShrink: 0 }}>
            {companyInfo.logo_url ? <img src={fileUrl(companyInfo.logo_url)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🏢"}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-base)" }}>{companyInfo.name}</div>
            {companyInfo.website && (
              <a href={companyInfo.website} target="_blank" rel="noreferrer" style={{ fontSize: "var(--text-xs)", color: "var(--sage)", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
                {companyInfo.website}
              </a>
            )}
          </div>
        </div>
      )}

      {job.description && (
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "var(--text-base)" }}>About this role</div>
          <div style={{ fontSize: "var(--text-base)", lineHeight: 1.75, color: "var(--ink)", whiteSpace: "pre-line" }}>{job.description}</div>
        </div>
      )}

      {job.responsibilities && (
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "var(--text-base)" }}>Responsibilities</div>
          <div style={{ fontSize: "var(--text-base)", lineHeight: 1.75, whiteSpace: "pre-line", color: "var(--muted)" }}>{job.responsibilities}</div>
        </div>
      )}

      {job.qualifications && (
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "var(--text-base)" }}>Requirements</div>
          <div style={{ fontSize: "var(--text-base)", lineHeight: 1.75, whiteSpace: "pre-line", color: "var(--muted)" }}>{job.qualifications}</div>
        </div>
      )}

      <div className="divider" />
      {!user ? (
        <Alert type="info">Sign in to apply for this job.</Alert>
      ) : applied ? (
        <Alert type="success">Application submitted successfully! You can track it in &quot;My Applications&quot;.</Alert>
      ) : (
        <>
          {error && <Alert type="danger">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}
          <Field label="Apply with CV">
            <select
              className="field-select"
              value={selectedCv}
              onChange={(e) => setSelectedCv(e.target.value)}
            >
              <option value="">— Select a CV —</option>
              {cvList.map((cv) => (
                <option key={cv.id} value={cv.id}>{cv.filename || `CV #${cv.id}`}</option>
              ))}
            </select>
          </Field>
          {cvList.length === 0 && (
            <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginTop: "-0.5rem", marginBottom: "0.75rem" }}>
              Upload a CV in &quot;My CVs&quot; before applying.
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={submit}
              disabled={loading || !selectedCv}
            >
              {loading ? <><Spinner size="sm" white />Applying…</> : "Apply now →"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
