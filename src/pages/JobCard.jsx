import { SalaryDisplay } from "../shared.jsx"

export function JobCard({ job, onView, savedIds, onToggleSave }) {
    const isSaved = savedIds?.has(String(job.id))

    return (
        <div className="card card-hover" style={{ cursor: "pointer", display: "flex", flexDirection: "column" }} onClick={onView}>
            <div className="flex-between" style={{ marginBottom: "0.75rem" }}>
                <span className="badge badge-gold">{job.type || "Full-time"}</span>
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
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
                            {isSaved ? "🏷️" : "🔖"}
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
                <SalaryDisplay min={job.salary_min} max={job.salary_max} currency={job.currency} />
            </div>
            <div className="divider" style={{ margin: "0.85rem 0 0.75rem" }} />

            {job?.submitted ? (
                <span
                    className="btn btn-sm"
                    style={getStatusStyle(job.submitted?.status)}
                    onClick={(e) => {
                        e.stopPropagation()
                        onView(e)
                    }}
                    onMouseEnter={(e) => {
                        const status = job.submitted?.status
                        const color = status === "submitted" ? "#1d4ed8" : status === "rejected" ? "#dc2626" : status === "under_review" ? "#a16207" : "#16a34a" 

                        e.currentTarget.style.borderColor = color
                        e.currentTarget.style.background = "#ffffff"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(24, 24, 27, 0.14)"
                        e.currentTarget.style.background = "transparent"
                    }}
                >
                    {job.submitted?.status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
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

// styling application status button based on status (submitted/rejected/under_review/shortlisted/interview_scheduled)
const getStatusStyle = (status) => {
    let color;

    if (status === "submitted") color = "#1d4ed8";      // blue
    else if (status === "rejected") color = "#dc2626";  // red
    else if (status === "under_review") color = "#a16207"
    else color = "#16a34a";                             // green

    return {
        background: "transparent",
        color: color,
        border: "1px solid rgba(24, 24, 27, 0.14)",
        width: "100%",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
    };
};
