import { useState, useMemo } from "react"
import { applications, ranking as rankingApi, candidateProfile } from "../api.js"
import { Alert, Spinner, StatusBadge, EmptyState, LoadingPage, SalaryDisplay, DateDisplay } from "../shared.jsx"
import { useAsync } from "../useAsync.js"
import { STATUS_OPTIONS } from "../utils/constants.js"
import { fileUrl } from "../utils/utils.js"
import { DetailModal } from "./DetailModal/DetailModal.jsx"

export function JobApplicants({ job, onBack }) {
    const { data, loading, error, refetch } = useAsync(() => applications.getApplicationsForRecruiterJob(job.id), [job.id])
    const { data: rankData, loading: rankLoading, error: rankError } = useAsync(() => rankingApi.getForJob(job.id), [job.id])
    const [updatingId, setUpdatingId] = useState(null)
    const [selectedApplicant, setSelectedApplicant] = useState(null)

    async function handleStatusChange(appId, status) {
        setUpdatingId(appId)
        try {
            await applications.updateStatus(appId, status)
            refetch()
        } finally {
            setUpdatingId(null)
        }
    }

    const scoreMap = useMemo(() => {
        if (!rankData || !Array.isArray(rankData)) return {}
        return Object.fromEntries(rankData.map((r) => [r.email, { score: r.score, skills: r.skills }]))
    }, [rankData])

    const list = useMemo(
        () =>
            (data || [])
                .map((app) => {
                    return {
                        ...app,
                        aiScore: scoreMap[app.email]?.score ?? null,
                        aiSkills: scoreMap[app.email]?.skills ?? [],
                    }
                })
                .sort((a, b) => (b.aiScore ?? -1) - (a.aiScore ?? -1)),
        [data, scoreMap]
    )

    return (
        <div className="page-enter">
            <div className="page-header-row">
                <div>
                    <div className="page-title">Applicants</div>
                    <div className="page-sub">
                        Reviewing for: <strong>{job.title}</strong>
                    </div>
                </div>
                <button type="button" className="btn btn-ghost" onClick={onBack}>
                    ← Back to postings
                </button>
            </div>

            <div className="card-flat" style={{ marginBottom: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                {[
                    ["Location", job.location || "Remote"],
                    ["Type", job.type || "Full-time"],
                    [
                        "Salary",
                        <SalaryDisplay
                            key="s"
                            min={job.salary_min ?? job.min_salary}
                            max={job.salary_max ?? job.max_salary}
                            currency={job.currency}
                        />,
                    ],
                    ["Applicants", loading ? "…" : list.length],
                ].map(([k, v]) => (
                    <div key={k}>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            {k}
                        </div>
                        <div style={{ fontWeight: 500, marginTop: "0.2rem" }}>{v}</div>
                    </div>
                ))}
            </div>

            {error && <Alert type="danger">{error}</Alert>}
            {rankError && <Alert type="warn">AI ranking unavailable: {rankError}</Alert>}
            {loading && <LoadingPage />}

            {!loading && list.length === 0 && <EmptyState icon="👥" title="No applicants yet" desc="Share your posting to attract candidates." />}

            {!loading && list.length > 0 && (
                <>
                    {rankLoading && (
                        <div
                            className="card-flat"
                            style={{
                                marginBottom: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                background: "var(--accent-soft)",
                                border: "1px solid var(--accent-muted)",
                            }}
                        >
                            <Spinner size="sm" gold />
                            <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>AI is ranking candidates…</span>
                        </div>
                    )}

                    {rankData && (
                        <div
                            className="card-flat"
                            style={{
                                marginBottom: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                background: "var(--success-bg)",
                                border: "1px solid rgba(21,128,61,0.2)",
                            }}
                        >
                            <span>🤖</span>
                            <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--success)" }}>
                                AI ranking complete — candidates sorted by match score
                            </span>
                        </div>
                    )}

                    <div className="card tbl-wrap" style={{ padding: 0, overflow: "hidden" }}>
                        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: "left", minWidth: 200, borderRight: "0.25px solid rgba(24, 24, 27, 0.09)" }}>
                                            Candidate
                                        </th>
                                        <th style={{ minWidth: 110 }}>Applied</th>
                                        <th style={{ minWidth: 90 }}>CV</th>
                                        <th style={{ minWidth: 100 }}>AI Score</th>
                                        <th style={{ minWidth: 130 }}>Status</th>
                                        <th style={{ minWidth: 180, textAlign: "center" }}>Update Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((app) => (
                                        <tr key={app.id}>
                                            <td
                                                style={{ textAlign: "left", cursor: "pointer", borderRight: "0.25px solid rgba(24, 24, 27, 0.09)" }}
                                                onClick={async () => {
                                                    const candidate = await candidateProfile.getById(app.profile_id)
                                                    const { status, cv_url, created_at } = app
                                                    setSelectedApplicant({ ...candidate, status, cv_url, applied_at: created_at, email: app.email })
                                                }}
                                            >
                                                <div style={{ fontWeight: 500 }}>{app.email || "—"}</div>
                                                {app.aiSkills?.length > 0 && (
                                                    <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginTop: "0.3rem" }}>
                                                        {app.aiSkills.slice(0, 4).map((s) => (
                                                            <span key={s} className="badge badge-ink" style={{ fontSize: "0.65rem" }}>
                                                                {s}
                                                            </span>
                                                        ))}
                                                        {app.aiSkills.length > 4 && (
                                                            <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
                                                                +{app.aiSkills.length - 4}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ color: "var(--muted)" }}>
                                                <DateDisplay date={app.created_at} />
                                            </td>
                                            <td>
                                                {app.cv_url ? (
                                                    <a
                                                        className="btn btn-secondary btn-sm"
                                                        href={fileUrl(app.cv_url)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        View CV
                                                    </a>
                                                ) : (
                                                    <span style={{ color: "var(--muted)", fontSize: "var(--text-sm)" }}>—</span>
                                                )}
                                            </td>
                                            <td>
                                                {app.aiScore !== null ? (
                                                    <span
                                                        style={{
                                                            fontWeight: 700,
                                                            fontSize: "var(--text-md)",
                                                            color:
                                                                app.aiScore > 0.75
                                                                    ? "var(--success)"
                                                                    : app.aiScore > 0.4
                                                                      ? "var(--warn)"
                                                                      : "var(--muted)",
                                                        }}
                                                    >
                                                        {app.aiScore.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: "var(--muted)", fontSize: "var(--text-sm)" }}>
                                                        {rankLoading ? <Spinner size="sm" /> : "—"}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <StatusBadge status={app.status} />
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
                                                    <select
                                                        className="field-select"
                                                        style={{
                                                            padding: "0.3rem 1.8rem 0.3rem 0.5rem",
                                                            fontSize: "var(--text-sm)",
                                                            width: "100%",
                                                            maxWidth: 160,
                                                            textAlign: "center",
                                                        }}
                                                        value={app.status}
                                                        disabled={updatingId === app.id}
                                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                    >
                                                        {STATUS_OPTIONS.map((o) => (
                                                            <option key={o.value} value={o.value}>
                                                                {o.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {updatingId === app.id && <Spinner size="sm" />}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {selectedApplicant && (
                        <DetailModal
                            mode="applicant"
                            applicant={selectedApplicant}
                            onClose={() => setSelectedApplicant(null)}
                            initialView="applicant"
                        />
                    )}
                </>
            )}
        </div>
    )
}
