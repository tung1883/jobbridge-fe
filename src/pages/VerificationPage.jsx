import { useState, useEffect, useRef } from "react"
import { companyProfile, downloads } from "../api.js"
import { Alert, LoadingPage, ErrorPage, Spinner } from "../shared.jsx"
import { useAsync } from "../useAsync.js"

function docIcon(documentType) {
    if (!documentType) return "📎"
    const t = documentType.toLowerCase()
    if (t === "pdf") return "📄"
    if (t === "jpg" || t === "jpeg" || t === "png") return "🖼️"
    return "📎"
}

export function VerificationPage() {
    const { data: profile, loading, error, refetch } = useAsync(() => companyProfile.getOwn(), [])
    const [verifying, setVerifying] = useState(false)
    const [verifyMsg, setVerifyMsg] = useState({ type: "", text: "" })
    const [verificationDocs, setVerificationDocs] = useState([])
    const [loadingDocs, setLoadingDocs] = useState(false)
    const [docActionMsg, setDocActionMsg] = useState({ type: "", text: "" })
    const [editingDoc, setEditingDoc] = useState(null)
    const [downloadingDoc, setDownloadingDoc] = useState(null)
    const verifyRef = useRef()

    useEffect(() => {
        if (profile) loadVerificationDocuments()
    }, [profile])

    async function loadVerificationDocuments() {
        setLoadingDocs(true)
        try {
            const docs = await companyProfile.getVerificationDocuments()
            setVerificationDocs(docs || [])
        } catch (err) {
            console.error("Failed to load verification documents:", err)
        } finally {
            setLoadingDocs(false)
        }
    }

    async function handleVerify(e) {
        const file = e.target.files?.[0]
        if (!file) return

        setVerifying(true)
        setVerifyMsg({ type: "", text: "" })
        
        try {
            await companyProfile.submitVerification(file)
            setVerifyMsg({ type: "success", text: "Verification document submitted successfully." })
            loadVerificationDocuments()
            refetch()
        } catch (err) {
            setVerifyMsg({ type: "danger", text: err.message })
        } finally {
            setVerifying(false)
            e.target.value = ""
        }
    }

    async function handleDeleteDocument(docId) {
        if (!confirm("Delete this verification document? If it's your last document, your verification status will be reset.")) return
        try {
            await companyProfile.deleteVerificationDocuments([docId])
            setDocActionMsg({ type: "success", text: "Document deleted successfully." })
            await loadVerificationDocuments()
            refetch()
        } catch (err) {
            setDocActionMsg({ type: "danger", text: err.message })
        } finally {
            setTimeout(() => setDocActionMsg({ type: "", text: "" }), 3000)
        }
    }

    async function handleEditDocument(docId, e) {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            await companyProfile.editVerificationDocument(docId, file)
            setDocActionMsg({ type: "success", text: "Document updated successfully." })
            loadVerificationDocuments()
            setEditingDoc(null)
        } catch (err) {
            setDocActionMsg({ type: "danger", text: err.message })
        } finally {
            e.target.value = ""
            setTimeout(() => setDocActionMsg({ type: "", text: "" }), 3000)
        }
    }

    async function handleDownloadDocument(doc) {
        setDownloadingDoc(doc.id)
        try {
            await downloads.verificationDoc(doc.id, doc.file_name)
        } catch (err) {
            setDocActionMsg({ type: "danger", text: `Download failed: ${err.message}` })
            setTimeout(() => setDocActionMsg({ type: "", text: "" }), 3000)
        } finally {
            setDownloadingDoc(null)
        }
    }

    if (loading) return <LoadingPage />
    if (error) return <ErrorPage message={error} onRetry={refetch} />

    // Treat as unverified if the DB says verified but all docs have been removed locally
    const isVerified = profile?.verification_status === "verified" && !loadingDocs && verificationDocs.length > 0

    return (
        <div className="page-enter">
            <div className="page-header">
                <div className="page-title">Company Verification</div>
                <div className="page-sub">Getting verified is the sure way to attract more talents</div>
            </div>

            {/* Status Card */}
            <div className="card" style={{ maxWidth: 640, margin: "0 auto 1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ fontSize: "2rem" }}>{isVerified ? "✅" : "⏳"}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "var(--text-lg)", marginBottom: "0.25rem" }}>
                            Verification Status: {isVerified ? "Verified" : verificationDocs.length === 0 && !loadingDocs ? "Unverified" : "Pending"}
                        </div>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--muted)" }}>
                            {isVerified
                                ? "Your company is verified. This badge appears on all your job postings."
                                : verificationDocs.length === 0 && !loadingDocs
                                  ? "You have no verification documents. Upload one to start the verification process."
                                  : "Upload verification documents to get verified and build trust with candidates."}
                        </div>
                    </div>
                    <div>
                        {isVerified ? (
                            <span className="badge badge-sage">✓ Verified employer</span>
                        ) : verificationDocs.length === 0 && !loadingDocs ? (
                            <span className="badge badge-danger">✗ Unverified</span>
                        ) : (
                            <span className="badge badge-warn">⏳ Pending verification</span>
                        )}
                    </div>
                </div>
            </div>

            {verifyMsg.text && <Alert type={verifyMsg.type}>{verifyMsg.text}</Alert>}
            {docActionMsg.text && <Alert type={docActionMsg.type}>{docActionMsg.text}</Alert>}

            {/* Upload new document */}
            <div className="card-flat" style={{ maxWidth: 640, margin: "0 auto 1.25rem", borderLeft: "3px solid var(--accent)" }}>
                <div style={{ fontWeight: 600, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {isVerified ? "Upload Additional Document" : "Submit Verification Documents"}
                    <span className="badge badge-gold">+Trust</span>
                </div>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--muted)", lineHeight: 1.65, marginBottom: "1rem" }}>
                    Upload your business registration document (PDF, JPG, or PNG). Our admin team reviews within 2–3 business days. Verified companies
                    get a badge on all their job postings.
                </p>
                <input type="file" ref={verifyRef} accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={handleVerify} />
                <button type="button" className="btn btn-primary" onClick={() => verifyRef.current?.click()} disabled={verifying}>
                    {verifying ? (
                        <>
                            <Spinner size="sm" white /> Uploading…
                        </>
                    ) : isVerified ? (
                        "Upload Additional Document"
                    ) : (
                        "Submit Verification Document"
                    )}
                </button>
            </div>

            {/* Document list */}
            <div className="card" style={{ maxWidth: 640, margin: "0 auto" }}>
                <div style={{ fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    Verification Documents <span className="badge badge-sage">Manage</span>
                </div>

                {loadingDocs ? (
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <Spinner size="sm" />
                        <div style={{ marginTop: "0.5rem", fontSize: "var(--text-sm)", color: "var(--muted)" }}>Loading documents…</div>
                    </div>
                ) : verificationDocs.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {verificationDocs.map((doc) => (
                            <div
                                key={doc.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "1rem",
                                    background: "var(--bg)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    gap: "0.75rem",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                                    <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{docIcon(doc.document_type)}</div>
                                    <div style={{ minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontWeight: 500,
                                                fontSize: "var(--text-sm)",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: 200,
                                            }}
                                            title={doc.file_name}
                                        >
                                            {doc.file_name}
                                        </div>
                                        <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>
                                            {doc.document_type?.toUpperCase()} ·{" "}
                                            {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : "Unknown date"}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
                                    {editingDoc === doc.id ? (
                                        <>
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`edit-file-${doc.id}`}
                                                onChange={(e) => handleEditDocument(doc.id, e)}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-success btn-sm"
                                                onClick={() => document.getElementById(`edit-file-${doc.id}`).click()}
                                            >
                                                Choose File
                                            </button>
                                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingDoc(null)}>
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                disabled={downloadingDoc === doc.id}
                                                onClick={() => handleDownloadDocument(doc)}
                                            >
                                                {downloadingDoc === doc.id ? <Spinner size="sm" /> : "⬇ Download"}
                                            </button>
                                            <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditingDoc(doc.id)}>
                                                Replace
                                            </button>
                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteDocument(doc.id)}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>No verification documents uploaded yet.</div>
                )}
            </div>
        </div>
    )
}
