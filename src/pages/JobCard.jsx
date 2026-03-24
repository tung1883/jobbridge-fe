import { SalaryDisplay } from "../shared.jsx"

export function JobCard({ job, onView, savedIds, onToggleSave }) {
    const isSaved = savedIds?.has(String(job.id))

    return (
        <div className="card card-hover" style={{ cursor: "pointer", display: "flex", flexDirection: "column" }} 
            onClick={onView}>
            <div className="flex-between" style={{ marginBottom: "0.75rem" }}>
                <span className="badge badge-gold">{job.type || "Full-time"}</span>
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    {job.is_verified && <span className="badge badge-sage">✓ Verified</span>}
                    {onToggleSave && (
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm btn-icon-only"
                            onClick={(e) => {
                                e.stopPropagation()
                                onToggleSave(job)
                            }}
                            title={isSaved ? "Remove from saved" : "Save job"}
                            style={{ fontSize: "1rem" }}
                        >
                            {isSaved ? "🔖" : "🏷️"}
                        </button>
                    )}
                </div>
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "var(--text-md)", marginBottom: "0.25rem", lineHeight: 1.25 }}>
                {job.title}
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--muted)", marginBottom: "0.6rem" }}>
                {job.company_name || "Company"} · {job.location || "Location not specified"}
            </div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--ink)", marginBottom: "auto" }}>
                <SalaryDisplay min={job.min_salary} max={job.max_salary} currency={job.currency} />
            </div>
            <div className="divider" style={{ margin: "0.85rem 0 0.75rem" }} />
            
            {job?.submittedStatus ? (
                <span 
                    className="btn btn-secondary btn-sm"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={(e) => {
                        e.stopPropagation()
                        onView(e)
                    }}
                >
                    Submitted
                </span>
            ) : (
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={(e) => {
                        e.stopPropagation()
                        onView(e)
                    }}
                >
                    View & Apply →
                </button>
            )}
        </div>
    )
}
