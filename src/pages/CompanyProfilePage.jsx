import { useState, useEffect, useRef } from "react"
import { companyProfile } from "../api.js"
import { Alert, Field, LoadingPage, ErrorPage, Spinner, ImageViewer } from "../shared.jsx"
import { useAsync } from "../useAsync.js"
import { useForm, useSubmit } from "./hooks.js"
import { fileUrl } from "./utils.js"

export function CompanyProfilePage() {
    const { data: profile, loading, error, refetch } = useAsync(() => companyProfile.getOwn(), [])
    const form = useForm({ name: "", description: "", website: "", location: "" })
    const { patch } = form
    const {
        loading: saving,
        error: saveErr,
        success: saved,
        submit,
    } = useSubmit(async () => {
        await companyProfile.update(form.values)
        refetch()
        return "Company profile updated."
    })

    const [logoUploading, setLogoUploading] = useState(false)
    const [logoErr, setLogoErr] = useState("")
    const logoRef = useRef()

    useEffect(() => {
        if (profile) {
            patch({
                name: profile.name || "",
                description: profile.description || "",
                website: profile.website || "",
                location: profile.location || "",
            })
        }
    }, [profile, patch])

    async function handleLogoUpload(e) {
        const file = e.target.files?.[0]
        if (!file) return
        setLogoUploading(true)
        setLogoErr("")
        try {
            await companyProfile.uploadLogo(file)
            refetch()
        } catch (err) {
            setLogoErr(err.message)
        } finally {
            setLogoUploading(false)
            e.target.value = ""
        }
    }

    if (loading) return <LoadingPage />
    if (error) return <ErrorPage message={error} onRetry={refetch} />

    return (
        <div className="page-enter">
            <div className="page-header">
                <div className="page-title">Company Profile</div>
                <div className="page-sub">Shown to candidates who view your job postings</div>
            </div>

            {saveErr && <Alert type="danger">{saveErr}</Alert>}
            {saved && <Alert type="success">{saved}</Alert>}

            <div
                className="card-flat company-identity"
                style={{
                    marginBottom: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    maxWidth: 640,
                    margin: "0 auto 1.25rem",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ position: "relative" }}>
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: 14,
                            background: "var(--cream)",
                            border: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.75rem",
                            overflow: "hidden",
                            cursor: "pointer",
                        }}
                        tabIndex={0}
                    >
                        {profile?.logo_url ? (
                            <ImageViewer src={fileUrl(profile.logo_url)} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            "🏢"
                        )}
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: "12rem" }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-lg)", fontFamily: "var(--font-sans)" }}>
                        {form.values.name || profile?.name || "Your Company"}
                    </div>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--muted)", marginTop: "0.2rem" }}>
                        {profile?.verification_status === "verified" ? (
                            <span className="badge badge-sage">✓ Verified employer</span>
                        ) : (
                            <span className="badge badge-warn">⏳ Pending verification</span>
                        )}
                    </div>
                    {logoErr && (
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.3rem", marginTop: "0.5rem" }}>
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
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--danger)" }}>Error when uploading logo</div>
                        </div>
                    )}
                    </div>
                <>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => logoRef.current?.click()} disabled={logoUploading}>
                        {logoUploading ? (
                            <>
                                <Spinner size="sm" />
                                Uploading…
                            </>
                        ) : (
                            "Change logo"
                        )}
                    </button>
                    <input type="file" ref={logoRef} style={{ display: "none" }} accept=".png, .jpg, .jpeg" onChange={handleLogoUpload} />
                </>
            </div>

            <div className="card" style={{ maxWidth: 640, margin: "0 auto 1.25rem" }}>
                <Field label="Company name">
                    <input
                        className="field-input"
                        value={form.values.name}
                        onChange={(e) => form.set("name", e.target.value)}
                        placeholder="Acme Corp"
                    />
                </Field>
                <Field label="Description">
                    <textarea
                        className="field-textarea"
                        rows={4}
                        value={form.values.description}
                        onChange={(e) => form.set("description", e.target.value)}
                        placeholder="What does your company do, and what's your culture like?"
                    />
                </Field>
                <div className="field-row-2">
                    <Field label="Location">
                        <input
                            className="field-input"
                            value={form.values.location}
                            onChange={(e) => form.set("location", e.target.value)}
                            placeholder="City, Country"
                        />
                    </Field>
                    <Field label="Website" optional>
                        <input
                            className="field-input"
                            value={form.values.website}
                            onChange={(e) => form.set("website", e.target.value)}
                            placeholder="https://yourcompany.com"
                        />
                    </Field>
                </div>
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
