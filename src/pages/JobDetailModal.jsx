import { useState, useEffect } from "react"
import { applications, cvs, jobs } from "../api.js"
import { Spinner, Alert, Field, Modal, SalaryDisplay } from "../shared.jsx"
import { useSubmit } from "./hooks.js"
import { fileUrl } from "./utils.js"

export function JobDetailModal({ job, onClose, user, onUpdate }) {
    const REMOVED_CV = "__removed__"
    const [cvList, setCvList] = useState([])
    const [selectedCv, setSelectedCv] = useState("")
    const [jobInfo, setJobInfo] = useState(job)
    const [companyInfo, setCompanyInfo] = useState(null)
    const [originalCvId, setOriginalCvId] = useState(jobInfo?.submitted?.cv_id ?? REMOVED_CV)
    const [deleting, setDeleting] = useState(false)
    const [view, setView] = useState("job") // "job" | "company"
    const [hoveringCompany, setHoveringCompany] = useState(false)

    useEffect(() => {
        setOriginalCvId(jobInfo?.submitted?.cv_id ?? REMOVED_CV)
    }, [jobInfo.submitted])

    const { loading, error, success, submit } = useSubmit(async () => {
        if (!selectedCv) throw new Error("Please select a CV first.")
        const res = await applications.apply(jobInfo.id, selectedCv)
        onUpdate?.(res)
        return "Application submitted!"
    })

    useEffect(() => {
        if (user) {
            cvs.list().then(setCvList).catch(() => {})
            jobs.getCompany(jobInfo.id).then(setCompanyInfo).catch(() => {})
        }
    }, [jobInfo.id, user])

    const handleUpdate = async () => {
        const newApp = await applications.updateApplication(jobInfo.submitted.application_id, { cv_id: selectedCv })
        setJobInfo((prev) => ({
            ...prev,
            submitted: {
                status: newApp.status,
                cv_id: newApp.cv_id,
                cv_url: newApp.cv_url,
                cv_name: newApp.cv_name,
                application_id: newApp.id,
            },
        }))
        setSelectedCv(newApp.cv_id)
        onUpdate?.(newApp)
    }

    const handleDelete = async () => {
        const id = jobInfo.submitted.application_id
        await applications.deleteApplication(id)
        onUpdate?.({ id, status: "deleted" })
        onClose?.()
    }

    const memberSince = companyInfo?.created_at
        ? new Date(companyInfo.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })
        : null

    return (
        <Modal
            title={
                view === "company" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                            onClick={() => setView("job")}
                            style={{
                                all: "unset", cursor: "pointer",
                                color: "var(--accent)", fontSize: "var(--text-sm)",
                                display: "flex", alignItems: "center", gap: "0.25rem",
                            }}
                        >
                            ← Back
                        </button>
                        <span style={{ color: "var(--border)" }}>|</span>
                        <span>Company Profile</span>
                    </div>
                ) : jobInfo.title
            }
            onClose={onClose}
            wide
        >
            <div style={{ overflow: "hidden", position: "relative" }}>
                <div
                    style={{
                        display: "flex",
                        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: view === "company" ? "translateX(-50%)" : "translateX(0)",
                        width: "200%",
                        alignItems: "flex-start",
                    }}
                >
                    <div style={{ width: "50%", minWidth: 0 }}>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                            {jobInfo.type && <span className="badge badge-gold">{jobInfo.type}</span>}
                            {jobInfo.location && <span className="badge badge-ink">📍 {jobInfo.location}</span>}
                            {jobInfo.is_verified && <span className="badge badge-sage">✓ Verified employer</span>}
                        </div>

                        <div
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                                background: "var(--accent-soft)", borderRadius: "var(--r-md)",
                                padding: "0.45rem 0.85rem", marginBottom: "1.5rem",
                            }}
                        >
                            <span style={{ fontSize: "var(--text-base)", fontWeight: 700, color: "var(--accent)" }}>
                                <SalaryDisplay min={jobInfo.min_salary} max={jobInfo.max_salary} currency={jobInfo.currency} />
                            </span>
                            {(jobInfo.min_salary || jobInfo.max_salary) && (
                                <span style={{ fontSize: "var(--text-xs)", color: "var(--accent)", opacity: 0.7 }}>/yr</span>
                            )}
                        </div>

                        {companyInfo ? (
                            <div
                                onClick={() => {
                                    setView("company")
                                }}
                                onMouseEnter={() => setHoveringCompany(true)}
                                onMouseLeave={() => setHoveringCompany(false)}
                                style={{
                                    border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
                                    padding: "1rem 1.1rem", marginBottom: "1.5rem",
                                    display: "flex", gap: "1rem", alignItems: "flex-start",
                                    background: hoveringCompany ? "var(--cream)" : "var(--chalk)",
                                    cursor: "pointer", transition: "background 0.15s, box-shadow 0.15s",
                                    boxShadow: hoveringCompany ? "0 2px 12px rgba(0,0,0,0.07)" : "none",
                                }}
                            >
                                <div
                                    style={{
                                        width: 48, height: 48, borderRadius: 10,
                                        background: "var(--cream)", border: "1px solid var(--border)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "1.4rem", overflow: "hidden", flexShrink: 0,
                                    }}
                                >
                                    {companyInfo.logo_url
                                        ? <img src={fileUrl(companyInfo.logo_url)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        : "🏢"
                                    }
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                        <span style={{ fontWeight: 600, fontSize: "var(--text-base)" }}>{companyInfo.name}</span>
                                        {companyInfo.verification_status === "verified" || true && (
                                            <span className="badge badge-sage" style={{ fontSize: "0.6rem" }}>✓ Verified</span>
                                        )}
                                    </div>
                                    {companyInfo.location && (
                                        <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginTop: "0.2rem" }}>📍 {companyInfo.location}</div>
                                    )}
                                    {companyInfo.description && (
                                        <div style={{
                                            fontSize: "var(--text-sm)", color: "var(--muted)", marginTop: "0.5rem",
                                            lineHeight: 1.6, display: "-webkit-box",
                                            WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                                        }}>
                                            {companyInfo.description}
                                        </div>
                                    )}
                                    {companyInfo.website && (
                                        <a
                                            href={companyInfo.website?.startsWith("http") ? companyInfo.website : `https://${companyInfo.website}`}
                                             target="_blank" rel="noreferrer"
                                            style={{ display: "inline-block", marginTop: "0.45rem", fontSize: "var(--text-xs)", color: "var(--accent)", textDecoration: "none" }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            🔗 {companyInfo.website}
                                        </a>
                                    )}
                                </div>
                                <div style={{
                                    alignSelf: "center", flexShrink: 0,
                                    fontSize: "var(--text-sm)", color: "var(--accent)",
                                    opacity: hoveringCompany ? 1 : 0,
                                    transition: "opacity 0.15s, transform 0.15s",
                                    transform: hoveringCompany ? "translateX(2px)" : "translateX(-4px)",
                                    fontWeight: 600
                                }}>
                                    View →
                                </div>
                            </div>
                        ) : (
                            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "1rem 1.1rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start", background: "var(--chalk)" }}>
                                <div style={{ width: 48, height: 48, borderRadius: 10, background: "linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)", backgroundSize: "400px 100%", animation: "shimmer 1.2s infinite", flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ width: "40%", height: 14, background: "linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)", backgroundSize: "400px 100%", animation: "shimmer 1.2s infinite", borderRadius: 4, marginBottom: "0.4rem" }} />
                                    <div style={{ width: "100%", height: 10, background: "linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)", backgroundSize: "400px 100%", animation: "shimmer 1.2s infinite", borderRadius: 4, marginBottom: "0.3rem" }} />
                                    <div style={{ width: "90%", height: 10, background: "linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)", backgroundSize: "400px 100%", animation: "shimmer 1.2s infinite", borderRadius: 4 }} />
                                </div>
                            </div>
                        )}

                        {jobInfo.description && <Section title="About this role">{jobInfo.description}</Section>}
                        {jobInfo.responsibilities && <Section title="Responsibilities">{jobInfo.responsibilities}</Section>}
                        {jobInfo.qualifications && <Section title="Requirements">{jobInfo.qualifications}</Section>}

                        <div className="divider" />

                        {!user ? (
                            <Alert type="info">Sign in to apply for this job.</Alert>
                        ) : jobInfo.submitted ? (
                            <>
                                <div style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                                    <strong>Status:</strong>{" "}
                                    <span className={`status-badge status-${jobInfo.submitted.status}`} style={{ padding: "4px 10px", borderRadius: "999px", display: "inline-block" }}>
                                        {jobInfo.submitted.status?.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                                    </span>
                                </div>
                                {!jobInfo?.submitted?.cv_id && <Alert>The previous CV was removed, recruiters can still see the CV but at best you should choose a new one.</Alert>}
                                {error && <Alert type="danger">{error}</Alert>}
                                {success && <Alert type="success">{success}</Alert>}
                                <Field label={<span style={{ all: "unset", fontWeight: "900", fontSize: "0.85rem" }}>Update CV:</span>}>
                                    <select className="field-select" value={selectedCv || jobInfo.submitted.cv_id || REMOVED_CV} onChange={(e) => setSelectedCv(e.target.value)}>
                                        <option value="">— Select a CV —</option>
                                        {!job?.submitted?.cv_id && <option value={REMOVED_CV}>{jobInfo.submitted.cv_name} (Removed)</option>}
                                        {cvList.map((cv) => (
                                            <option key={cv.id} value={cv.id}>{cv.file_name || `CV #${cv.id}`}</option>
                                        ))}
                                    </select>
                                </Field>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                                    {!deleting ? (
                                        <>
                                            <button type="button" className="btn btn-danger" onClick={() => setDeleting(true)}>Delete</button>
                                            <button type="button" className="btn btn-primary" onClick={handleUpdate}
                                                disabled={loading || (selectedCv ?? originalCvId) === originalCvId || selectedCv === REMOVED_CV || !selectedCv}>
                                                {loading ? <><Spinner size="sm" white /> Updating…</> : "Update"}
                                            </button>
                                        </>
                                    ) : (
                                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                            <span style={{ fontSize: "0.85rem" }}>Are you sure?</span>
                                            <button className="btn btn-danger" onClick={handleDelete}>Yes, delete</button>
                                            <button className="btn btn-ghost" onClick={() => setDeleting(false)}>Cancel</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {error && <Alert type="danger">{error}</Alert>}
                                {success && <Alert type="success">{success}</Alert>}
                                <Field label="Apply with CV">
                                    <select className="field-select" value={selectedCv} onChange={(e) => setSelectedCv(e.target.value)} disabled={success}>
                                        <option value="">— Select a CV —</option>
                                        {cvList.map((cv) => (
                                            <option key={cv.id} value={cv.id}>{cv.file_name || `CV #${cv.id}`}</option>
                                        ))}
                                    </select>
                                </Field>
                                {cvList.length === 0 && (
                                    <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginTop: "-0.5rem", marginBottom: "0.75rem" }}>
                                        Upload a CV in "My CVs" before applying.
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                                    <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                                    {!success ? (
                                        <button type="button" className="btn btn-primary" onClick={submit} disabled={loading || !selectedCv}>
                                            {loading ? <><Spinner size="sm" white /> Applying…</> : "Apply now →"}
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary" disabled>Applied!</button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div style={{ width: "50%", minWidth: 0, paddingLeft: "1px" }}>
                        {companyInfo && (
                            <>
                                <div style={{
                                    borderRadius: "var(--r-lg)",
                                    background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--chalk) 100%)",
                                    border: "1px solid var(--border)",
                                    padding: "1.25rem", marginBottom: "1.25rem",
                                    display: "flex", gap: "1rem", alignItems: "center",
                                }}>
                                    <div style={{
                                        width: 64, height: 64, borderRadius: 14, flexShrink: 0,
                                        background: "var(--cream)", border: "1px solid var(--border)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "1.75rem", overflow: "hidden",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                    }}>
                                        {companyInfo.logo_url
                                            ? <img src={fileUrl(companyInfo.logo_url)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            : "🏢"
                                        }
                                    </div>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                                            <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--ink)" }}>
                                                {companyInfo.name ?? "—"}
                                            </h2>
                                            {companyInfo.verification_status === "verified" && <span className="badge badge-sage">✓ Verified</span>}
                                            {companyInfo.verification_status === "pending" && <span className="badge badge-gold">⏳ Pending</span>}
                                        </div>
                                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                                            {companyInfo.industry && <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>🏭 {companyInfo.industry}</span>}
                                            {companyInfo.location && <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>📍 {companyInfo.location}</span>}
                                            {memberSince && <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>🗓 Since {memberSince}</span>}
                                        </div>
                                    </div>
                                </div>

                                {companyInfo.description && <Section title="About">{companyInfo.description}</Section>}

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.65rem", marginBottom: "1.25rem" }}>
                                    {companyInfo.industry && <DetailCard icon="🏭" label="Industry" value={companyInfo.industry} />}
                                    {companyInfo.location && <DetailCard icon="📍" label="Location" value={companyInfo.location} />}
                                    {companyInfo.verification_status && (
                                        <DetailCard icon="🔖" label="Status" value={companyInfo.verification_status.charAt(0).toUpperCase() + companyInfo.verification_status.slice(1)} />
                                    )}
                                    {memberSince && <DetailCard icon="🗓" label="Member since" value={memberSince} />}
                                </div>

                                {companyInfo.website && (
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: "0.6rem",
                                        padding: "0.75rem 1rem", borderRadius: "var(--r-md)",
                                        border: "1px solid var(--border)", background: "var(--chalk)",
                                    }}>
                                        <span style={{ fontSize: "var(--text-sm)", color: "var(--muted)" }}>🔗 Website</span>
                                        <a
                                            href={companyInfo.website?.startsWith("http") ? companyInfo.website : `https://${companyInfo.website}`}
                                            target="_blank" rel="noreferrer"
                                            style={{ fontSize: "var(--text-sm)", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
                                        >
                                            {companyInfo.website}
                                        </a>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

function DetailCard({ icon, label, value }) {
    return (
        <div style={{ padding: "0.75rem 1rem", borderRadius: "var(--r-md)", border: "1px solid var(--border)", background: "var(--chalk)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginBottom: "0.25rem" }}>{icon} {label}</div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--ink)" }}>{value}</div>
        </div>
    )
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontWeight: 600, fontSize: "var(--text-base)", marginBottom: "0.5rem", color: "var(--ink)" }}>{title}</div>
            <div style={{ fontSize: "var(--text-base)", lineHeight: 1.75, color: "var(--muted)", whiteSpace: "pre-line" }}>{children}</div>
        </div>
    )
}