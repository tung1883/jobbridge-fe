import { useState, useEffect, useCallback } from "react"
import { savedJobs, applications } from "../api.js"
import { EmptyState, LoadingPage, Alert } from "../shared.jsx"
import { JobCard } from "./JobCard.jsx"
import { DetailModal } from "./DetailModal/DetailModal.jsx"

export function SavedJobs({ navigateTo, user }) {
    const [saved, setSaved] = useState([])
    const [savedIds, setSavedIds] = useState(() => new Set())
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(!!user)
    const [error, setError] = useState("")

    const loadLocal = useCallback(() => {
        try {
            const list = JSON.parse(localStorage.getItem("tb_saved_jobs") || "[]")
            setSaved(list)
            setSavedIds(new Set(list.map((j) => String(j.id))))
        } catch {
            setSaved([])
            setSavedIds(new Set())
        }
        setLoading(false)
    }, [])

    const loadFromApi = useCallback(async () => {
        setLoading(true)
        setError("")

        try {
            const bookmarkList = await savedJobs.list()
            const myApplications = await applications.getMine()
            const appMap = new Map(
                myApplications.map((app) => [
                    app.job_id,
                    {
                        status: app.status,
                        application_id: app.id,
                        cv_id: app.cv_id,
                        cv_url: app.cv_url,
                        cv_name: app.cv_name,
                    },
                ]),
            )

            const updatedBookmarkList = bookmarkList.map((job) => ({
                ...job,
                submitted: appMap.get(job.id) || null, // null if no match
            }))
            setSaved(updatedBookmarkList)
            setSavedIds(new Set(updatedBookmarkList.map((j) => String(j.id))))
        } catch (e) {
            setError(e.message || "Could not load saved jobs.")
            setSaved([])
            setSavedIds(new Set())
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (user) {
            loadFromApi()
        } else loadLocal()
    }, [user, loadFromApi, loadLocal])

    async function toggleSave(job) {
        const id = String(job.id)
        if (user) {
            setError("")
            try {
                await savedJobs.unsave(job.id)
                setSaved((prev) => prev.filter((j) => String(j.id) !== id))
                setSavedIds((prev) => {
                    const n = new Set(prev)
                    n.delete(id)
                    return n
                })
            } catch (e) {
                setError(e.message || "Could not remove saved job.")
            }
            return
        }
        const next = saved.filter((j) => String(j.id) !== id)

        setSaved(next)
        setSavedIds(new Set(next.map((j) => String(j.id))))

        localStorage.setItem("tb_saved_jobs", JSON.stringify(next))
        const ids = JSON.parse(localStorage.getItem("tb_saved_ids") || "[]").filter((x) => String(x) !== id)
        localStorage.setItem("tb_saved_ids", JSON.stringify(ids))
    }

    if (user && loading) return <LoadingPage />

    if (saved.length === 0) {
        return (
            <div className="page-enter">
                <div className="page-header">
                    <div className="page-title">Saved Jobs</div>
                </div>
                {error && <Alert type="danger">{error}</Alert>}
                <EmptyState
                    icon="🔖"
                    title="No favorite jobs found :("
                    desc="Bookmark your favorite jobs while browsing to keep track of them here."
                    action={
                        <button type="button" className="btn btn-primary" onClick={() => navigateTo("jobs")}>
                            Browse Jobs
                        </button>
                    }
                />
            </div>
        )
    }

    return (
        <div className="page-enter">
            <div className="page-header">
                <div className="page-title">Saved Jobs</div>
                <div className="page-sub">
                    {
                        saved?.length &&
                            saved?.length > 0 &&
                            `You have ${saved.length} job${saved.length !== 1 ? "s" : ""} bookmarked, check ${saved.length === 1 ? "it" : "them"} out!`
                        // {saved.length} Job{saved.length !== 1 ? "s" : ""} Bookmarked
                    }
                </div>
            </div>
            {error && (
                <Alert type="danger" onClose={() => setError("")}>
                    {error}
                </Alert>
            )}
            <div className="grid-auto-280">
                {saved.map((job) => (
                    <JobCard key={job.id} job={job} onView={() => setSelected(job)} savedIds={savedIds} onToggleSave={toggleSave} />
                ))}
            </div>
            {selected && <DetailModal job={selected} onClose={() => setSelected(null)} user={user} />}
        </div>
    )
}
