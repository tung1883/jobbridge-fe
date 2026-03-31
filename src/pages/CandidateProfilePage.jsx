import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"

import { candidateProfile } from "../api.js"
import { Alert, Field, LoadingPage, ErrorPage, Spinner, ImageViewer } from "../shared.jsx"
import { useAsync } from "../useAsync.js"
import { useForm, useSubmit } from "../utils/hooks.js"
import { fileUrl } from "../utils/utils.js"

export function CandidateProfilePage() {
    const { data: profile, loading, error, refetch } = useAsync(() => candidateProfile.getOwn(), [])
    const form = useForm({ full_name: "", location: "", summary: "" })
    const { patch } = form
    const {
        loading: saving,
        error: saveErr,
        success: saved,
        submit,
    } = useSubmit(async () => {
        const { full_name, location, summary } = form.values
        if (!full_name.trim()) {
            form.setErrors({ full_name: "Full name is required." })
            throw new Error("Validation failed.")
        }
        await candidateProfile.update({ full_name, location, summary })
        refetch()
        return "Profile saved."
    })
    
    const avatarRef = useRef(null)
    const [avatarUploading, setAvatarUploading] = useState(false)
    const [avatarErr, setAvatarErr] = useState('')
    const [ avatarEditing, setAvatarEditing ] = useState(false)

    async function handleAvatarUpload(e) {
        const file = e.target.files?.[0]

        if (!file) return
        
        setAvatarUploading(true)
        setAvatarErr("")
        
        try {
            await candidateProfile.uploadAvatar(file)
            refetch()
        } catch (err) {
            setAvatarErr(err.message)
            setTimeout(() => {
                setAvatarErr('')
            }, 10 * 1000) // 10 sec
        } finally {
            setAvatarUploading(false)
            e.target.value = ""
        }
    }

    useEffect(() => {
        if (profile) patch({ full_name: profile.full_name || "", location: profile.location || "", summary: profile.summary || "" })
    }, [profile, patch])

    if (loading) return <LoadingPage />
    if (error) return <ErrorPage message={error} onRetry={refetch} />

    return (
        <div className="page-enter">
            <div className="page-header">
                <div className="page-title">My Profile</div>
                <div className="page-sub">Visible to recruiters who view your applications</div>
            </div>

            {saveErr && <Alert type="danger">{saveErr}</Alert>}
            {saved && <Alert type="success">{saved}</Alert>}

            <div className="card profile-card" style={{ maxWidth: 600, margin: "0 auto" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "1.75rem",
                        paddingBottom: "1.25rem",
                        borderBottom: "1px solid var(--border)",
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            background: "var(--accent-soft)",
                            border: "1px solid var(--accent-muted)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-sans)",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "var(--accent)",
                            flexShrink: 0,
                        }}
                    >
                        {profile?.avatar_url ? (
                            <ImageViewer
                                src={fileUrl(profile.avatar_url)}
                                alt="logo"
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                            />
                        ) : (
                            (form.values.full_name || "?").slice(0, 2).toUpperCase()
                        )}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>{form.values.full_name || "Your name"}</div>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--muted)" }}>{form.values.location || "Location not set"}</div>
                        {avatarErr && (
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.3rem" }}>
                                {/* Spinner */}
                                <div
                                    style={{
                                        width: "10px", // smaller width
                                        height: "10px", // smaller height
                                        border: "1.5px solid var(--danger)", // thinner border
                                        borderTop: "1.5px solid transparent",
                                        borderRadius: "50%",
                                        animation: "spin 0.5s linear infinite",
                                    }}
                                />

                                {/* Error message */}
                                <div style={{ fontSize: "var(--text-xs)", color: "var(--danger)" }}>Error when uploading avatar</div>
                            </div>
                        )}
                        {avatarEditing &&
                            createPortal(
                                <div
                                    style={{
                                        position: "fixed",
                                        inset: 0,
                                        background: "rgba(0,0,0,0.6)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        zIndex: 9999,
                                    }}
                                    onClick={() => setAvatarEditing(false)} // close if click outside card
                                >
                                    <div
                                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking card
                                        style={{
                                            width: "280px",
                                            borderRadius: "12px",
                                            background: "var(--chalk)",
                                            padding: "1.5rem",
                                            position: "relative",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "1rem",
                                            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                                        }}
                                    >
                                        {/* Avatar Preview */}
                                        <div
                                            style={{
                                                width: "72px",
                                                height: "72px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                margin: "0 auto",
                                                border: "1px solid var(--border)",
                                            }}
                                        >
                                            <img
                                                src={fileUrl(profile?.avatar_url)}
                                                alt="avatar"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </div>

                                        {/* Upload Button */}
                                        <button className="btn btn-primary" type="button" onClick={() => avatarRef.current?.click()}>
                                            Upload New Avatar
                                        </button>
                                        <input
                                            type="file"
                                            ref={avatarRef}
                                            accept="image/png, image/jpg, image/jpeg"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    handleAvatarUpload(e)
                                                }

                                                setAvatarEditing(false)
                                            }}
                                        />

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={async () => {
                                                await candidateProfile.deleteAvatar()
                                                refetch()
                                                setAvatarEditing(false)
                                            }}
                                        >
                                            Delete Avatar
                                        </button>
                                    </div>
                                </div>,
                                document.body,
                            )}
                    </div>
                    {profile?.avatar_url ? (
                        <>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    setAvatarEditing(true)
                                }}
                                style={{
                                    marginLeft: "auto",
                                }}
                                disabled={avatarUploading}
                            >
                                Edit Avatar
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    avatarRef?.current.click()
                                }}
                                style={{
                                    marginLeft: "auto",
                                }}
                                disabled={avatarUploading}
                            >
                                Upload Avatar
                            </button>
                            <input type="file" ref={avatarRef} style={{ display: "none" }} accept=".png, .jpg, .jpeg" onChange={handleAvatarUpload} />
                        </>
                    )}
                </div>

                <Field label="Full name" error={form.errors.full_name}>
                    <input
                        className={`field-input${form.errors.full_name ? " err" : ""}`}
                        value={form.values.full_name}
                        onChange={(e) => form.set("full_name", e.target.value)}
                        placeholder="Your full name"
                    />
                </Field>
                <Field label="Location" optional>
                    <input
                        className="field-input"
                        value={form.values.location}
                        onChange={(e) => form.set("location", e.target.value)}
                        placeholder="City, Country"
                    />
                </Field>
                <Field label="Professional summary" optional hint="Tell recruiters about your experience and what you're looking for.">
                    <textarea
                        className="field-textarea"
                        rows={5}
                        value={form.values.summary}
                        onChange={(e) => form.set("summary", e.target.value)}
                        placeholder="I'm a product designer with 4 years of experience…"
                    />
                </Field>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                    <button type="button" className="btn btn-primary" onClick={submit} disabled={saving}>
                        {saving ? (
                            <>
                                <Spinner size="sm" white />
                                Saving…
                            </>
                        ) : (
                            "Save changes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
