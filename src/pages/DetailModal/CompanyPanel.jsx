import { fileUrl } from "../../utils/utils.js"

export function CompanyPanel({ companyInfo }) {
    const memberSince = companyInfo?.created_at
        ? new Date(companyInfo.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })
        : null

    if (!companyInfo) return null

    return (
        <>
            {/* Header */}
            <div
                style={{
                    borderRadius: "var(--r-lg)",
                    background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--chalk) 100%)",
                    border: "1px solid var(--border)",
                    padding: "1.25rem",
                    marginBottom: "1.25rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 14,
                        flexShrink: 0,
                        background: "var(--cream)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.75rem",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    {companyInfo.logo_url ? (
                        <img src={fileUrl(companyInfo.logo_url)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        "🏢"
                    )}
                </div>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                        <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--ink)" }}>{companyInfo.name ?? "—"}</h2>
                        {companyInfo.verification_status === "verified" && <span className="badge badge-sage">✓ Verified</span>}
                        {companyInfo.verification_status === "pending" && <span className="badge badge-gold">⏳ Pending</span>}
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                        {companyInfo.industry && <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>🏭 {companyInfo.industry}</span>}
                        {companyInfo.location && <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>📍 {companyInfo.location}</span>}
                        {memberSince && <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>🗓 Since {memberSince}</span>}
                    </div>
                </div>
            </div>

            {companyInfo.description && (
                <Section title="About us" style={{ textAlign: "justify", paddingRight: "0.5rem" }}>
                    {companyInfo.description}
                </Section>
            )}

            {/* Detail grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: "0.65rem",
                    marginBottom: "1.25rem",
                }}
            >
                {companyInfo.industry && <DetailCard icon="🏭" label="Industry" value={companyInfo.industry} />}
                {companyInfo.location && <DetailCard icon="📍" label="Location" value={companyInfo.location} />}
                {companyInfo.company_size && <DetailCard icon="👥" label="Company size" value={companyInfo.company_size} />}
                {companyInfo.founded_year && <DetailCard icon="📅" label="Founded" value={companyInfo.founded_year} />}
                {companyInfo.verification_status && (
                    <DetailCard
                        icon="🔖"
                        label="Status"
                        value={companyInfo.verification_status.charAt(0).toUpperCase() + companyInfo.verification_status.slice(1)}
                    />
                )}
                {memberSince && <DetailCard icon="🗓" label="Member since" value={memberSince} />}
            </div>

            {companyInfo.website && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--r-md)",
                        border: "1px solid var(--border)",
                        background: "var(--chalk)",
                    }}
                >
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--muted)" }}>🔗 Website</span>
                    <a
                        href={companyInfo.website?.startsWith("http") ? companyInfo.website : `https://${companyInfo.website}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: "var(--text-sm)", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
                    >
                        {companyInfo.website}
                    </a>
                </div>
            )}
        </>
    )
}

function DetailCard({ icon, label, value }) {
    return (
        <div style={{ padding: "0.75rem 1rem", borderRadius: "var(--r-md)", border: "1px solid var(--border)", background: "var(--chalk)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginBottom: "0.25rem" }}>
                {icon} {label}
            </div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--ink)" }}>{value}</div>
        </div>
    )
}

function Section({ title, children, style }) {
    return (
        <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontWeight: 600, fontSize: "var(--text-base)", marginBottom: "0.5rem", color: "var(--ink)" }}>{title}</div>
            <div
                style={{
                    fontSize: "var(--text-base)",
                    lineHeight: 1.75,
                    color: "var(--muted)",
                    whiteSpace: "pre-line",
                    maxHeight: "150px",
                    overflowY: "auto",
                    ...style,
                }}
            >
                {children}
            </div>
        </div>
    )
}
