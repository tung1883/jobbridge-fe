import { fileUrl } from "../../utils/utils.js"

export function ApplicantPanel({ applicant }) {
    if (!applicant) return null

    const appliedDate = applicant.applied_at
        ? new Date(applicant.applied_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : null

    return (
        <>
            {/* Header */}
            <div
                style={{
                    borderRadius: "var(--r-lg)",
                    background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--chalk) 100%)",
                    border: "1px solid var(--border)",
                    padding: "1.25rem",
                    marginBottom: "1.25rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                }}
            >
                {/* Avatar */}
                <div
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "var(--accent-soft)",
                        border: "2px solid var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: "var(--accent)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    {applicant.full_name?.charAt(0)?.toUpperCase() ?? applicant.email?.charAt(0)?.toUpperCase() ?? "?"}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                        <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--ink)" }}>
                            {applicant.full_name ?? applicant?.email ?? "-"}
                        </h2>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                        {applicant.location && <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>📍 {applicant.location}</span>}
                        {appliedDate && <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>🗓 Applied {appliedDate}</span>}
                    </div>
                </div>
            </div>

            {/* Summary */}
            {applicant.summary && (
                <div style={{ marginBottom: "1.25rem" }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-base)", marginBottom: "0.5rem", color: "var(--ink)" }}>
                        Professional summary
                    </div>
                    <div
                        style={{
                            fontSize: "var(--text-base)",
                            lineHeight: 1.75,
                            color: "var(--muted)",
                            whiteSpace: "pre-line",
                            textAlign: "justify",
                            maxHeight: "180px",
                            overflowY: "auto",
                        }}
                    >
                        {applicant.summary}
                    </div>
                </div>
            )}

            {/* CV */}
            {applicant.cv_url ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        padding: "0.9rem 1rem",
                        borderRadius: "var(--r-md)",
                        border: "1px solid var(--border)",
                        background: "var(--chalk)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", minWidth: 0 }}>
                        <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>📄</span>
                        <div style={{ minWidth: 0 }}>
                            <div
                                style={{
                                    fontWeight: 600,
                                    fontSize: "var(--text-sm)",
                                    color: "var(--ink)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                Submitted CV
                            </div>
                        </div>
                    </div>
                    <a
                        href={fileUrl(applicant.cv_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ flexShrink: 0, textDecoration: "none" }}
                    >
                        View CV →
                    </a>
                </div>
            ) : (
                <div
                    style={{
                        padding: "0.9rem 1rem",
                        borderRadius: "var(--r-md)",
                        border: "1px dashed var(--border)",
                        background: "var(--chalk)",
                        fontSize: "var(--text-sm)",
                        color: "var(--muted)",
                        textAlign: "center",
                    }}
                >
                    No CV attached
                </div>
            )}
        </>
    )
}