import { useState, useEffect } from "react"
import { applications, cvs, jobs } from "../api.js"
import { Spinner, Alert, Field, Modal, SalaryDisplay } from "../shared.jsx"
import { useSubmit } from "./hooks.js"
import { fileUrl } from "./utils.js"

export function JobDetailModal({ job, onClose, user, onApplied }) {
    const [cvList, setCvList] = useState([])
    const [selectedCv, setSelectedCv] = useState("")
    const [companyInfo, setCompanyInfo] = useState(null)
    const [applied, setApplied] = useState(false)

    const { loading, error, success, submit } = useSubmit(async () => {
        if (!selectedCv) throw new Error("Please select a CV first.")
        await applications.apply(job.id, selectedCv)
        setApplied(true)
        onApplied?.()
        return "Application submitted!"
    })

    useEffect(() => {
        if (user) {
            cvs.list()
                .then(setCvList)
                .catch(() => {})
            jobs.getCompany(job.id)
                .then(setCompanyInfo)
                .catch(() => {})
        }
    }, [job.id, user])

    return (
        <Modal title={job.title} onClose={onClose} wide>
            {/* ── Meta badges ── */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {job.type && <span className="badge badge-gold">{job.type}</span>}
                {job.location && <span className="badge badge-ink">📍 {job.location}</span>}
                {job.is_verified && <span className="badge badge-sage">✓ Verified employer</span>}
            </div>

            {/* ── Salary ── */}
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "var(--accent-soft)",
                    borderRadius: "var(--r-md)",
                    padding: "0.45rem 0.85rem",
                    marginBottom: "1.5rem",
                }}
            >
                <span style={{ fontSize: "var(--text-base)", fontWeight: 700, color: "var(--accent)" }}>
                    <SalaryDisplay min={job.min_salary} max={job.max_salary} currency={job.currency} />
                </span>
                {job.min_salary || job.max_salary ? (
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--accent)", opacity: 0.7 }}>/yr</span>
                ) : null}
            </div>

            {/* ── Company card ── */}
            {companyInfo && (
                <div
                    style={{
                        border: "1px solid var(--border)",
                        borderRadius: "var(--r-lg)",
                        padding: "1rem 1.1rem",
                        marginBottom: "1.5rem",
                        display: "flex",
                        gap: "1rem",
                        alignItems: "flex-start",
                        background: "var(--chalk)",
                    }}
                >
                    {/* company logo */}
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 10,
                            background: "var(--cream)",
                            border: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.4rem",
                            overflow: "hidden",
                            flexShrink: 0,
                        }}
                    >
                        {companyInfo.logo_url ? (
                            <img src={fileUrl(companyInfo.logo_url)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            "🏢"
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600, fontSize: "var(--text-base)" }}>{companyInfo.name}</span>
                            {companyInfo.verification_status === "verified" && (
                                <span className="badge badge-sage" style={{ fontSize: "0.6rem" }}>
                                    ✓ Verified
                                </span>
                            )}
                        </div>

                        {companyInfo.location && (
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginTop: "0.2rem" }}>📍 {companyInfo.location}</div>
                        )}

                        {companyInfo.description && (
                            <div
                                style={{
                                    fontSize: "var(--text-sm)",
                                    color: "var(--muted)",
                                    marginTop: "0.5rem",
                                    lineHeight: 1.6,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {companyInfo.description}
                            </div>
                        )}

                        {companyInfo.website && (
                            <a
                                href={companyInfo.website}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: "inline-block",
                                    marginTop: "0.45rem",
                                    fontSize: "var(--text-xs)",
                                    color: "var(--accent)",
                                    textDecoration: "none",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                🔗 {companyInfo.website}
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/*  show job info */}
            {job.description && <Section title="About this role">{job.description}</Section>}
            {job.responsibilities && <Section title="Responsibilities">{job.responsibilities}</Section>}
            {job.qualifications && <Section title="Requirements">{job.qualifications}</Section>}

            <div className="divider" />

            {/* apply section */}
            {!user ? (
                <Alert type="info">Sign in to apply for this job.</Alert>
            ) : applied ? (
                <Alert type="success">Application submitted! Track it in "My Applications".</Alert>
            ) : (
                <>
                    {error && <Alert type="danger">{error}</Alert>}
                    {success && <Alert type="success">{success}</Alert>}

                    <Field label="Apply with CV">
                        <select className="field-select" value={selectedCv} onChange={(e) => setSelectedCv(e.target.value)}>
                            <option value="">— Select a CV —</option>
                            {cvList.map((cv) => (
                                <option key={cv.id} value={cv.id}>
                                    {cv.file_name || `CV #${cv.id}`}
                                </option>
                            ))}
                        </select>
                    </Field>

                    {cvList.length === 0 && (
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginTop: "-0.5rem", marginBottom: "0.75rem" }}>
                            Upload a CV in "My CVs" before applying.
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={submit} disabled={loading || !selectedCv}>
                            {loading ? (
                                <>
                                    <Spinner size="sm" white /> Applying…
                                </>
                            ) : (
                                "Apply now →"
                            )}
                        </button>
                    </div>
                </>
            )}
        </Modal>
    )
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: "1.25rem" }}>
            <div
                style={{
                    fontWeight: 600,
                    fontSize: "var(--text-base)",
                    marginBottom: "0.5rem",
                    color: "var(--ink)",
                }}
            >
                {title}
            </div>
            <div
                style={{
                    fontSize: "var(--text-base)",
                    lineHeight: 1.75,
                    color: "var(--muted)",
                    whiteSpace: "pre-line",
                }}
            >
                {children}
            </div>
        </div>
    )
}
