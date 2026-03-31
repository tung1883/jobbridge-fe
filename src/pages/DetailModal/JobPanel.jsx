import { useState, useEffect } from "react"
import { applications, cvs, jobs } from "../../api.js"
import { Spinner, Alert, Field } from "../../shared.jsx"
import { useSubmit } from "../../utils/hooks.js"
import { fileUrl } from "../../utils/utils.js"
import { SalaryDisplay, Section } from "../../shared.jsx"

export function JobPanel({ job, companyInfo, setCompanyInfo, user, onClose, onUpdate, onViewCompany }) {
    const REMOVED_CV = "__removed__"
    const [jobInfo, setJobInfo] = useState(job)
    const [cvList, setCvList] = useState([])
    const [selectedCv, setSelectedCv] = useState("")
    const [originalCvId, setOriginalCvId] = useState(jobInfo?.submitted?.cv_id ?? REMOVED_CV)
    const [deleting, setDeleting] = useState(false)
    const [hoveringCompany, setHoveringCompany] = useState(false)

    useEffect(() => {
        setOriginalCvId(jobInfo?.submitted?.cv_id ?? REMOVED_CV)
    }, [jobInfo?.submitted])

    useEffect(() => {
        if (user && jobInfo?.id) jobs.getCompany(jobInfo?.id).then(setCompanyInfo)
    }, [jobInfo?.id, user])

    const { loading, error, success, submit } = useSubmit(async () => {
        if (!selectedCv) throw new Error("Please select a CV first.")
        const res = await applications.apply(jobInfo?.id, selectedCv)
        onUpdate?.(res)
        return "Application submitted!"
    })

    useEffect(() => {
        if (user) cvs.list().then(setCvList)
    }, [user])

    const handleUpdate = async () => {
        const newApp = await applications.updateApplication(jobInfo?.submitted.application_id, { cv_id: selectedCv })
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
        const id = jobInfo?.submitted.application_id
        await applications.deleteApplication(id)
        onUpdate?.({ id, status: "deleted" })
        onClose?.()
    }

    return (
        <>
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
                    <SalaryDisplay min={jobInfo?.salary_min} max={jobInfo?.salary_max} currency={jobInfo?.currency} />
                </span>
                {(jobInfo?.salary_min || jobInfo?.salary_max) && (
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--accent)", opacity: 0.7 }}>/yr</span>
                )}
            </div>

            {/* Company card */}
            {companyInfo ? (
                <div
                    onClick={onViewCompany}
                    onMouseEnter={() => setHoveringCompany(true)}
                    onMouseLeave={() => setHoveringCompany(false)}
                    style={{
                        border: "1px solid var(--border)",
                        borderRadius: "var(--r-lg)",
                        padding: "1rem 1.1rem",
                        marginBottom: "1.5rem",
                        display: "flex",
                        gap: "1rem",
                        alignItems: "flex-start",
                        background: hoveringCompany ? "var(--cream)" : "var(--chalk)",
                        cursor: "pointer",
                        transition: "background 0.15s, box-shadow 0.15s",
                        boxShadow: hoveringCompany ? "0 2px 12px rgba(0,0,0,0.07)" : "none",
                    }}
                >
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
                                href={companyInfo.website?.startsWith("http") ? companyInfo.website : `https://${companyInfo.website}`}
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
                    <div
                        style={{
                            alignSelf: "center",
                            flexShrink: 0,
                            fontSize: "var(--text-sm)",
                            color: "var(--accent)",
                            opacity: hoveringCompany ? 1 : 0,
                            transition: "opacity 0.15s, transform 0.15s",
                            fontWeight: 600,
                            transform: hoveringCompany ? "translateX(2px)" : "translateX(-4px)",
                        }}
                    >
                        View →
                    </div>
                </div>
            ) : (
                <CompanyCardShimmer />
            )}

            {jobInfo?.description && (
                <Section title="About this role" style={{ textAlign: "justify", paddingRight: "0.5rem" }}>
                    {jobInfo?.description}
                </Section>
            )}
            {jobInfo?.responsibilities && <Section title="Responsibilities">{jobInfo?.responsibilities}</Section>}
            {jobInfo?.qualifications && <Section title="Requirements">{jobInfo?.qualifications}</Section>}

            <div className="divider" />

            {!user ? (
                <Alert type="info">Sign in to apply for this job.</Alert>
            ) : jobInfo?.submitted ? (
                <>
                    <div style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                        <strong>Status:</strong>{" "}
                        <span
                            className={`status-badge status-${jobInfo?.submitted.status}`}
                            style={{ padding: "4px 10px", borderRadius: "999px", display: "inline-block" }}
                        >
                            {jobInfo?.submitted.status
                                ?.split(" ")
                                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                .join(" ")}
                        </span>
                    </div>
                    {!jobInfo?.submitted?.cv_id && (
                        <Alert>The previous CV was removed, recruiters can still see the CV but at best you should choose a new one.</Alert>
                    )}
                    {error && <Alert type="danger">{error}</Alert>}
                    {success && <Alert type="success">{success}</Alert>}
                    <Field label={<span style={{ all: "unset", fontWeight: "900", fontSize: "0.85rem" }}>Update CV:</span>}>
                        <select
                            className="field-select"
                            value={selectedCv || jobInfo?.submitted.cv_id || REMOVED_CV}
                            onChange={(e) => setSelectedCv(e.target.value)}
                        >
                            <option value="">— Select a CV —</option>
                            {!jobInfo?.submitted?.cv_id && <option value={REMOVED_CV}>{jobInfo?.submitted.cv_name} (Removed)</option>}
                            {cvList.map((cv) => (
                                <option key={cv.id} value={cv.id}>
                                    {cv.file_name || `CV #${cv.id}`}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                        {!deleting ? (
                            <>
                                <button type="button" className="btn btn-danger" onClick={() => setDeleting(true)}>
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdate}
                                    disabled={loading || (selectedCv ?? originalCvId) === originalCvId || selectedCv === REMOVED_CV || !selectedCv}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size="sm" white /> Updating…
                                        </>
                                    ) : (
                                        "Update"
                                    )}
                                </button>
                            </>
                        ) : (
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                <span style={{ fontSize: "0.85rem" }}>Are you sure?</span>
                                <button className="btn btn-danger" onClick={handleDelete}>
                                    Yes, delete
                                </button>
                                <button className="btn btn-ghost" onClick={() => setDeleting(false)}>
                                    Cancel
                                </button>
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
                        {!success ? (
                            <button type="button" className="btn btn-primary" onClick={submit} disabled={loading || !selectedCv}>
                                {loading ? (
                                    <>
                                        <Spinner size="sm" white /> Applying…
                                    </>
                                ) : (
                                    "Apply now →"
                                )}
                            </button>
                        ) : (
                            <button type="button" className="btn btn-primary" disabled>
                                Applied!
                            </button>
                        )}
                    </div>
                </>
            )}
        </>
    )
}

function CompanyCardShimmer() {
    const bar = (w, h = 10) => ({
        width: w, height: h, borderRadius: 4,
        background: "linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%)",
        backgroundSize: "400px 100%",
        animation: "shimmer 1.2s infinite",
    })
    return (
        <div style={{
            border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
            padding: "1rem 1.1rem", marginBottom: "1.5rem",
            display: "flex", gap: "1rem", alignItems: "flex-start", background: "var(--chalk)",
        }}>
            <div style={{ ...bar(48), height: 48, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <div style={bar("40%", 14)} />
                <div style={bar("100%")} />
                <div style={bar("80%")} />
            </div>
        </div>
    )
}