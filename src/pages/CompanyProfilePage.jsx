import { useState, useEffect, useRef } from "react"
import { companyProfile } from "../api.js"
import { Alert, Field, ErrorPage, Spinner, ImageViewer } from "../shared.jsx"
import { useAsync } from "../useAsync.js"
import { useForm, useSubmit } from "../utils/hooks.js"
import { fileUrl } from "../utils/utils.js"

const INDUSTRY_OPTIONS = [
    "Energy",
    "Materials",
    "Industrials",
    "Consumer Discretionary",
    "Consumer Staples",
    "Health Care",
    "Financials",
    "Information Technology",
    "Communication Services",
    "Utilities",
    "Real Estate",
]

const COMPANY_SIZE_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "500+"]

function FieldShimmer({ wide = false }) {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <div
                style={{
                    width: wide ? "6rem" : "4rem",
                    height: "0.65rem",
                    borderRadius: 6,
                    background: "linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.4s infinite",
                    marginBottom: "0.5rem",
                }}
            />
            <div
                style={{
                    width: "100%",
                    height: "2.25rem",
                    borderRadius: "var(--r-md)",
                    background: "linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.4s infinite",
                }}
            />
        </div>
    )
}

function ProfileShimmer() {
    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
            {/* Identity card shimmer */}
            <div
                className="card-flat"
                style={{
                    marginBottom: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    maxWidth: 640,
                    margin: "0 auto 1.25rem",
                    flexWrap: "wrap",
                    padding: "1.25rem",
                }}
            >
                <div
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: 14,
                        flexShrink: 0,
                        background: "linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.4s infinite",
                    }}
                />
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            width: "9rem",
                            height: "1rem",
                            borderRadius: 6,
                            marginBottom: "0.6rem",
                            background: "linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.4s infinite",
                        }}
                    />
                    <div
                        style={{
                            width: "5rem",
                            height: "1.4rem",
                            borderRadius: 20,
                            background: "linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.4s infinite",
                        }}
                    />
                </div>
                <div
                    style={{
                        width: "6.5rem",
                        height: "2rem",
                        borderRadius: "var(--r-md)",
                        background: "linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.4s infinite",
                    }}
                />
            </div>

            {/* Form card shimmer */}
            <div className="card" style={{ maxWidth: 640, margin: "0 auto 1.25rem", padding: "1.25rem" }}>
                <FieldShimmer wide />
                <FieldShimmer />
                <div style={{ marginBottom: "1rem" }}>
                    <div
                        style={{
                            width: "5rem",
                            height: "0.65rem",
                            borderRadius: 6,
                            marginBottom: "0.5rem",
                            background: "linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.4s infinite",
                        }}
                    />
                    <div
                        style={{
                            width: "100%",
                            height: "5.5rem",
                            borderRadius: "var(--r-md)",
                            background: "linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.4s infinite",
                        }}
                    />
                </div>
                <div className="field-row-2">
                    <FieldShimmer />
                    <FieldShimmer wide />
                </div>
                <div className="field-row-2">
                    <FieldShimmer wide />
                    <FieldShimmer />
                </div>
                <FieldShimmer />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div
                        style={{
                            width: "7rem",
                            height: "2.25rem",
                            borderRadius: "var(--r-md)",
                            background: "linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.4s infinite",
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export function CompanyProfilePage() {
    const { data: profile, loading, error, refetch } = useAsync(() => companyProfile.getOwn(), [])
    const form = useForm({
        name: "",
        description: "",
        website: "",
        location: "",
        industry: "",
        company_size: "",
        founded_year: "",
    })
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
                industry: profile.industry || "",
                company_size: profile.company_size || "",
                founded_year: profile.founded_year?.toString() || "",
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

    if (error) return <ErrorPage message={error} onRetry={refetch} />

    return (
        <div className="page-enter">
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            <div className="page-header">
                <div className="page-title">Company Profile</div>
                <div className="page-sub">Shown to candidates who view your job postings</div>
            </div>

            {saveErr && <Alert type="danger">{saveErr}</Alert>}
            {saved && <Alert type="success">{saved}</Alert>}

            {loading ? (
                <ProfileShimmer />
            ) : (
                <>
                    {/* Identity card */}
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
                                    <ImageViewer
                                        src={fileUrl(profile.logo_url)}
                                        alt="logo"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
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
                                    <div
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            border: "1.5px solid var(--danger)",
                                            borderTop: "1.5px solid transparent",
                                            borderRadius: "50%",
                                            animation: "spin 0.5s linear infinite",
                                        }}
                                    />
                                    <div style={{ fontSize: "var(--text-xs)", color: "var(--danger)" }}>Error when uploading logo</div>
                                </div>
                            )}
                        </div>
                        <>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => logoRef.current?.click()}
                                disabled={logoUploading}
                            >
                                {logoUploading ? (
                                    <>
                                        <Spinner size="sm" /> Uploading…
                                    </>
                                ) : (
                                    "Change logo"
                                )}
                            </button>
                            <input type="file" ref={logoRef} style={{ display: "none" }} accept=".png, .jpg, .jpeg" onChange={handleLogoUpload} />
                        </>
                    </div>

                    {/* Form card */}
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
                            <Field label="Industry">
                                <select className="field-input" value={form.values.industry} onChange={(e) => form.set("industry", e.target.value)}>
                                    <option value="">Select industry…</option>
                                    {INDUSTRY_OPTIONS.map((o) => (
                                        <option key={o} value={o}>
                                            {o}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <div className="field-row-2">
                            <Field label="Company size">
                                <select
                                    className="field-input"
                                    value={form.values.company_size || ""}
                                    onChange={(e) => {
                                        form.set("company_size", e.target.value)
                                    }}
                                >
                                    <option value="">Select size…</option>
                                    {COMPANY_SIZE_OPTIONS.map((o) => (
                                        <option key={o} value={o}>
                                            {o} employees
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Founded year" optional>
                                <input
                                    className="field-input"
                                    type="number"
                                    min="1800"
                                    max={new Date().getFullYear()}
                                    value={form.values.founded_year}
                                    onChange={(e) => form.set("founded_year", e.target.value)}
                                    placeholder="e.g. 2015"
                                />
                            </Field>
                        </div>

                        <div className="field-row-2">
                            <Field label="Website" optional>
                                <input
                                    className="field-input"
                                    value={form.values.website}
                                    onChange={(e) => form.set("website", e.target.value)}
                                    placeholder="https://yourcompany.com"
                                />
                            </Field>
                            <Field label="Phone" optional>
                                <input
                                    className="field-input"
                                    value={form.values.phone}
                                    onChange={(e) => form.set("phone", e.target.value)}
                                    placeholder="+1 234 567 890"
                                    type="tel"
                                />
                            </Field>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                            <button type="button" className="btn btn-primary" onClick={submit} disabled={saving}>
                                {saving ? (
                                    <>
                                        <Spinner size="sm" white /> Saving…
                                    </>
                                ) : (
                                    "Save changes"
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
