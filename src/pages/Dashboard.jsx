import { useState } from "react"
import { TopNav, Sidebar, EmptyState } from "../shared.jsx"
import { JobsBrowse } from "./JobsBrowse.jsx"
import { MyApplications } from ".//MyApplications.jsx"
import { MyCVs } from "./MyCVs.jsx"
import { CandidateProfilePage } from "./CandidateProfilePage.jsx"
import { SavedJobs } from "./SavedJobs.jsx"
import { RecruiterJobs } from "./RecruiterJobs.jsx"
import { JobForm } from "./JobForm.jsx"
import { JobApplicants } from "./JobApplicants.jsx"
import { CompanyProfilePage } from "./CompanyProfilePage.jsx"

export function Dashboard({ user, navigate, onLogout }) {
    // Normalize role — handle "recruiter" from BE
    const isRecruiter = user?.role === "recruiter"

    const [page, setPage] = useState(isRecruiter ? "jobs-mine" : "jobs")
    const [editJob, setEditJob] = useState(null)
    const [viewJob, setViewJob] = useState(null)

    function navTo(pageId, data = null) {
        setPage(pageId)
        if (pageId === "job-create" || pageId === "job-edit") setEditJob(data)
        if (pageId === "applicants") setViewJob(data)
    }

    return (
        <div className="app-shell">
            <TopNav user={user} navigate={navigate} onLogout={onLogout} />
            <div className="dash-layout">
                <Sidebar role={user?.role} active={page} onNavigate={navTo} onLogout={onLogout} />
                <main className="dash-content">
                    {/* job-seeker pages */}
                    {!isRecruiter && page === "jobs" && <JobsBrowse user={user} />}
                    {!isRecruiter && page === "applications" && <MyApplications />}
                    {!isRecruiter && page === "cvs" && <MyCVs />}
                    {!isRecruiter && page === "profile" && <CandidateProfilePage />}
                    {!isRecruiter && page === "saved" && <SavedJobs navigateTo={navTo} user={user} />}

                    {/* recruiter pages */}
                    {isRecruiter && page === "jobs-mine" && (
                        <RecruiterJobs
                            onEditJob={(j) => navTo("job-create", j)}
                            onViewApplicants={(j) => navTo("applicants", j)}
                            navigateTo={navTo}
                        />
                    )}
                    {isRecruiter && page === "job-create" && <JobForm key={editJob?.id ?? "new"} editJob={editJob} navigateTo={navTo} />}
                    {isRecruiter && page === "applicants" && viewJob && <JobApplicants job={viewJob} onBack={() => navTo("jobs-mine")} />}
                    {isRecruiter && page === "applicants" && !viewJob && (
                        <EmptyState icon="👥" title="Select a job posting" desc="Go to My Postings and click Applicants on any listing." />
                    )}
                    {isRecruiter && page === "company" && <CompanyProfilePage />}
                    {isRecruiter && page === "company-verify" && <CompanyVerificationPage />}

                    {/* fallback pages */}
                    {!isRecruiter && !["jobs", "applications", "cvs", "profile", "saved"].includes(page) && <JobsBrowse user={user} />}
                    {isRecruiter && !["jobs-mine", "job-create", "applicants", "company"].includes(page) && (
                        <RecruiterJobs
                            onEditJob={(j) => navTo("job-create", j)}
                            onViewApplicants={(j) => navTo("applicants", j)}
                            navigateTo={navTo}
                        />
                    )}
                </main>
            </div>
        </div>
    )
}
