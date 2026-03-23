import { useEffect } from "react"
import { BrandLogo } from "./BrandLogo.jsx"

// ── Spinner ────────────────────────────────────────────────
export function Spinner({ size, white, gold } = {}) {
    return (
        <span
            className={[
                "spinner",
                size === "sm" ? "spinner-sm" : size === "lg" ? "spinner-lg" : "",
                white ? "spinner-white" : "",
                gold ? "spinner-gold" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        />
    )
}

// ── Alert ──────────────────────────────────────────────────
export function Alert({ type = "danger", children, onClose }) {
    const icons = { danger: "⚠", success: "✓", warn: "⚠", info: "ℹ" }
    return (
        <div className={`alert alert-${type}`} role="alert">
            <span className="alert-icon">{icons[type]}</span>
            <span style={{ flex: 1 }}>{children}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "inherit",
                        padding: "0 0.2rem",
                        fontSize: "0.9rem",
                        lineHeight: 1,
                    }}
                >
                    ✕
                </button>
            )}
        </div>
    )
}

// ── StatusBadge ────────────────────────────────────────────
const STATUS_LABELS = {
    submitted: "Submitted",
    under_review: "Under Review",
    shortlisted: "Shortlisted",
    interview_scheduled: "Interview Scheduled",
    rejected: "Rejected",
    pending: "Pending",
    approved: "Approved",
}

export function StatusBadge({ status }) {
    return <span className={`badge status-${status}`}>{STATUS_LABELS[status] || status}</span>
}

// ── Field wrapper ──────────────────────────────────────────
export function Field({ label, optional, error, hint, children, style }) {
    return (
        <div className="field" style={style}>
            {label && (
                <label className="field-label">
                    {label}
                    {optional && <span className="opt"> (optional)</span>}
                </label>
            )}
            {children}
            {error && (
                <div className="field-error">
                    <span>⚠</span>
                    {error}
                </div>
            )}
            {hint && <div className="field-hint">{hint}</div>}
        </div>
    )
}

// ── Modal ──────────────────────────────────────────────────
export function Modal({ title, sub, onClose, children, footer, wide }) {
    useEffect(() => {
        const h = (e) => {
            if (e.key === "Escape" && onClose) onClose()
        }
        document.addEventListener("keydown", h)
        return () => document.removeEventListener("keydown", h)
    }, [onClose])

    return (
        <div
            className="modal-backdrop"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && onClose) onClose()
            }}
        >
            <div className={`modal${wide ? " modal-lg" : ""}`} role="dialog">
                <div className="modal-header">
                    <div>
                        <div className="modal-title">{title}</div>
                        {sub && <div className="modal-sub">{sub}</div>}
                    </div>
                    {onClose && (
                        <button className="btn btn-ghost btn-sm btn-icon-only" onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    )}
                </div>
                {children}
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    )
}

// ── EmptyState ─────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }) {
    return (
        <div className="empty-state">
            <span className="empty-icon">{icon || "📭"}</span>
            <div className="empty-title">{title}</div>
            {desc && <p className="empty-desc">{desc}</p>}
            {action}
        </div>
    )
}

// ── TopNav ─────────────────────────────────────────────────
export function TopNav({ user, navigate, onLogout }) {
    const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "?"
    return (
        <header className="topnav">
            <BrandLogo className="topnav-logo" variant="dark" onClick={() => navigate("landing")} />
            <div className="topnav-right">
                {user ? (
                    <>
                        <div className="topnav-user-pill">
                            <div className="topnav-user-avatar">{initials}</div>
                            <span className="text-sm truncate" style={{ maxWidth: 180 }}>
                                {user.email}
                            </span>
                            <span className="topnav-role-badge">{user.role}</span>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={onLogout}>
                            Sign out
                        </button>
                    </>
                ) : (
                    <>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate("login")}>
                            Sign in
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate("register")}>
                            Get started
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}

// ── Sidebar ────────────────────────────────────────────────
const SEEKER_NAV = [
    { section: "Discover" },
    { id: "jobs", icon: "🔍", label: "Browse Jobs" },
    { id: "saved", icon: "🔖", label: "Saved Jobs" },
    { section: "My Activity" },
    { id: "applications", icon: "📋", label: "My Applications" },
    { id: "cvs", icon: "📄", label: "My CVs" },
    { section: "Account" },
    { id: "profile", icon: "👤", label: "Profile" },
]

const RECRUITER_NAV = [
    { section: "Jobs" },
    { id: "jobs-mine", icon: "📢", label: "My Postings" },
    { id: "job-create", icon: "➕", label: "Post a Job" },
    { section: "Applications" },
    { id: "applicants", icon: "👥", label: "Applicants" },
    { section: "Account" },
    { id: "company", icon: "🏢", label: "Company Profile" },
    { id: "company-verify", icon: "🥇", label: "Verifications" },
]

export function Sidebar({ role, active, onNavigate, onLogout }) {
    const items = role === "recruiter" ? RECRUITER_NAV : SEEKER_NAV
    return (
        <aside className="sidebar">
            {items.map((item, i) =>
                item.section ? (
                    <div key={`s-${i}`} className="sidebar-section">
                        {item.section}
                    </div>
                ) : (
                    <button key={item.id} className={`nav-item${active === item.id ? " active" : ""}`} onClick={() => onNavigate(item.id)}>
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ),
            )}
            <div className="sidebar-spacer" />
            <div className="sidebar-footer">
                <button className="nav-item" style={{ color: "rgba(255,255,255,0.3)", width: "100%", padding: "0.5rem 0" }} onClick={onLogout}>
                    <span className="nav-icon">↩</span>
                    Sign out
                </button>
            </div>
        </aside>
    )
}

// ── ConfirmModal ───────────────────────────────────────────
export function ConfirmModal({ title, desc, onConfirm, onCancel, danger }) {
    return (
        <Modal
            title={title}
            sub={desc}
            onClose={onCancel}
            footer={
                <>
                    <button className="btn btn-ghost" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>
                        {danger ? "Delete" : "Confirm"}
                    </button>
                </>
            }
        />
    )
}

// ── LoadingPage ────────────────────────────────────────────
export function LoadingPage() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh",
                flexDirection: "column",
                gap: "1rem",
                color: "var(--muted)",
            }}
        >
            <Spinner size="lg" gold />
            <span style={{ fontSize: "var(--text-sm)" }}>Loading…</span>
        </div>
    )
}

// ── ErrorPage ──────────────────────────────────────────────
export function ErrorPage({ message, onRetry }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
            <div style={{ textAlign: "center", maxWidth: 360 }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Something went wrong
                </div>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--muted)", marginBottom: "1.5rem" }}>{message}</p>
                {onRetry && (
                    <button className="btn btn-primary" onClick={onRetry}>
                        Try again
                    </button>
                )}
            </div>
        </div>
    )
}

// ── SalaryDisplay ──────────────────────────────────────────
export function SalaryDisplay({ min, max, currency = "USD" }) {
    const fmt = (n) => Number(n).toLocaleString()
    if ((!min && !max) || (min == 0 && !max) || (!min && max == 0 && min == 0 && max == 0)) {
        return <span style={{ color: "var(--muted)" }}>Salary Negotiable</span>
    }
    if (min && max)
        return (
            <span>
                {currency} {fmt(min)} – {fmt(max)}
            </span>
        )
    if (min && min > 0)
        return (
            <span>
                From {currency} {fmt(min)}
            </span>
        )
    if (max)
        return (
            <span>
                Up to {currency} {fmt(max)}
            </span>
        )
}

// ── DateDisplay ────────────────────────────────────────────
export function DateDisplay({ date }) {
    if (!date) return <span>—</span>
    return (
        <span>
            {new Date(date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            })}
        </span>
    )
}
