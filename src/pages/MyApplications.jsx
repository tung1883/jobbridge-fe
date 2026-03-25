import { useState } from "react"

import { applications, jobs } from "../api.js"
import { StatusBadge, EmptyState, LoadingPage, ErrorPage, DateDisplay } from "../shared.jsx"
import { JobDetailModal } from "./JobDetailModal.jsx"
import { useAsync } from "../useAsync.js"

export function MyApplications({ user }) {
    const { data, loading, error, refetch } = useAsync(() => applications.getMine(), [])
    const [ selected, setSelected ] = useState(null)

    if (loading) return <LoadingPage />
    if (error) return <ErrorPage message={error} onRetry={refetch} />

    const list = data || []

    return (
        <div className="page-enter">
            <div className="page-header">
                <div className="page-title">My Applications</div>
                <div className="page-sub">Track every application you&apos;ve submitted</div>
            </div>

            {list.length === 0 ? (
                <EmptyState icon="📋" title="No applications yet" desc="Find a job you love and apply — you will see all your applications here." />
            ) : (
                <div className="card tbl-wrap" style={{ padding: 0, overflow: "hidden" }}>
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Location</th>
                                <th>Applied</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((app) => (
                                <tr 
                                    key={app.id}
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={async () => {
                                        const job = await jobs.getById(app.job_id)
   
                                        const updatedJob = {
                                            ...job,
                                            submitted: {
                                                status: app.status,
                                                cv_id: app?.cv_id,
                                                cv_url: app.cv_url,
                                                cv_name: app.cv_name,
                                                application_id: app.id
                                            },
                                        }

                                        setSelected(updatedJob)
                                    }}
                                >
                                    <td style={{ fontWeight: 500 }}>{app.title || "—"}</td>
                                    <td style={{ color: "var(--muted)" }}>{app.company_name || "—"}</td>
                                    <td style={{ color: "var(--muted)" }}>{app.location || "—"}</td>
                                    <td style={{ color: "var(--muted)" }}>
                                        <DateDisplay date={app.created_at} />
                                    </td>
                                    <td>
                                        <StatusBadge status={app.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selected && <JobDetailModal job={selected} user={user} 
                onClose={() => setSelected(null)} onUpdate={() => refetch()}/>}
        </div>
    )
}
