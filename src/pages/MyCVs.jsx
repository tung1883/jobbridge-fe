import { useState, useRef } from "react"

import { cvs, downloads } from "../api.js"
import { Spinner, Alert, EmptyState, LoadingPage, DateDisplay, ConfirmModal, PdfViewerModal } from "../shared.jsx"
import { useAsync } from "../useAsync.js"
import { fileUrl } from "./utils.js"

export function MyCVs() {
    const { data, loading, error, refetch } = useAsync(() => cvs.list(), [])
    const [uploading, setUploading] = useState(false)
    const [uploadErr, setUploadErr] = useState("")
    const [deleteId, setDeleteId] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const [previewing, setPreviewing] = useState(null)
    const fileRef = useRef()
    const list = data || []

    async function handleUpload(e) {
        const file = e.target.files?.[0]

        if (!file) return

        if (file.size > 10 * 1024 * 1024) {
            setUploadErr("File must be under 10 MB.")
            return
        }

        const ext = file.name.split(".").pop()?.toLowerCase()

        if (!["pdf", "docx"].includes(ext)) {
            setUploadErr("Only PDF and DOCX files are accepted.")
            return
        }

        setUploading(true)
        setUploadErr("")

        try {
            await cvs.upload(file)
            refetch()
        } catch (err) {
            setUploadErr(err.message)
        } finally {
            setUploading(false)
            e.target.value = ""
        }
    }

    async function handleDelete(id) {
        setDeletingId(id)
        setDeleteId(null)

        try {
            await cvs.delete(id)
            setPreviewing(null)
            refetch()
        } catch {
            // handle error
        } finally {
            setDeletingId(null)
        }
    }


    return (
        <div className="page-enter">
            <div className="page-header-row">
                <div>
                    <div className="page-title">My CVs</div>
                    <div className="page-sub">Accept PDF, DOC or DOCX · Max 10 MB</div>
                </div>
                <div>
                    <input type="file" ref={fileRef} accept=".pdf,.docx" style={{ display: "none" }} onChange={handleUpload} />
                    <button type="button" className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                        {uploading ? (
                            <>
                                <Spinner size="sm" white />
                                Uploading…
                            </>
                        ) : (
                            "+ Upload CV"
                        )}
                    </button>
                </div>
            </div>

            {uploadErr && (
                <Alert type="danger" onClose={() => setUploadErr("")}>
                    {uploadErr}
                </Alert>
            )}

            {previewing && (
                <PdfViewerModal
                    pdfPath={fileUrl(previewing.file_path)}
                    pdfName={previewing.file_name}
                    onClose={() => setPreviewing(false)}
                    onDelete={async () => {
                        setDeleteId(previewing.id)
                        refetch()
                    }}
                />
            )}

            {loading && <LoadingPage />}

            {error && <Alert type="danger">{error}</Alert>}

            {!loading && list.length === 0 && (
                <EmptyState
                    icon="📄"
                    title="No CVs uploaded"
                    desc="Upload your resume to start applying for jobs."
                    action={
                        <button type="button" className="btn btn-primary" onClick={() => fileRef.current?.click()}>
                            Upload first CV
                        </button>
                    }
                />
            )}

            {!loading && list.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {list.map((cv) => (
                        <div key={cv.id} className="card-flat" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    background: "var(--cream)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.25rem",
                                    flexShrink: 0,
                                }}
                            >
                                📄
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        fontWeight: 500,
                                        marginBottom: "0.2rem",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {cv.file_name || `CV #${cv.id}`}
                                </div>
                                <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>
                                    Uploaded at <DateDisplay date={cv.uploaded_at} />
                                    {cv.size_bytes && ` · ${(cv.size_bytes / 1024).toFixed(0)} KB`}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                                {cv.file_path && (
                                    <button
                                        className="btn btn-secondary"
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={async (e) => {
                                            e.stopPropagation()
                                            downloads.cv(cv.id, cv.file_name)
                                        }}
                                    >
                                        Download
                                    </button>
                                )}
                                {cv.file_path && cv.file_path.endsWith(".pdf") && (
                                    <button
                                        className="btn btn-secondary"
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={async (e) => {
                                            e.stopPropagation()
                                            setPreviewing(cv)
                                        }}
                                    >
                                        Preview
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => setDeleteId(cv.id)}
                                    disabled={deletingId === cv.id}
                                >
                                    {deletingId === cv.id ? <Spinner size="sm" /> : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteId && (
                <ConfirmModal
                    title="Delete CV?"
                    desc="This CV will be permanently removed. Any active applications using this CV will not be affected."
                    danger
                    onConfirm={() => handleDelete(deleteId)}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    )
}
