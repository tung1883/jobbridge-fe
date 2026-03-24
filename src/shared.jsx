import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"

import { BrandLogo } from "./BrandLogo.jsx"

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

export function Modal({ title, sub, onClose, children, footer, wide }) {
    useEffect(() => {
        const h = (e) => {
            if (e.key === "Escape" && onClose) onClose()
        }
        document.addEventListener("keydown", h)
        // Lock body scroll while modal is open
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.removeEventListener("keydown", h)
            document.body.style.overflow = prev
        }
    }, [onClose])

    return createPortal(
        <div
            className="modal-backdrop"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && onClose) onClose()
            }}
            style={{zIndex: 10000}}
        >
            <div className={`modal${wide ? " modal-lg" : ""}`} role="dialog" aria-modal="true">
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
        </div>,
        document.body,
    )
}

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

// -- top navigation --
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

// -- sidebar --
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

export function SalaryDisplay({ min, max, currency = "USD" }) {
    const fmt = (n) => Number(n).toLocaleString()
    if ((!min && !max) || (min == 0 && max == 0)) {
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

export function ImageViewer({ src, alt, className, style }) {
    const [isOpen, setIsOpen] = useState(false)
    const [scale, setScale] = useState(1) // zoom level
    const startYRef = useRef(null)
    const overlayRef = useRef(null)

    // Close on Esc key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") {
                setIsOpen(false)
                setScale(1) // reset zoom
            }
        }
        if (isOpen) window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [isOpen])

    // Touch/mouse drag to dismiss
    const handleDragStart = (e) => {
        startYRef.current = e.touches ? e.touches[0].clientY : e.clientY
    }

    const handleDragMove = (e) => {
        if (!startYRef.current) return
        const currentY = e.touches ? e.touches[0].clientY : e.clientY
        const diff = currentY - startYRef.current
        if (Math.abs(diff) > 100) {
            setIsOpen(false)
            setScale(1)
        }
    }

    // Toggle zoom on image click
    const toggleZoom = (e) => {
        e.stopPropagation() // prevent closing overlay
        setScale((prev) => (prev === 1 ? 2 : 1)) // zoom in/out
    }

    return (
        <>
            {/* Thumbnail */}
            <img src={src} alt={alt} className={className} style={{ cursor: "pointer", ...style }} onClick={() => setIsOpen(true)} />

            {/* Overlay */}
            {isOpen &&
                createPortal(
                    <div
                        ref={overlayRef}
                        onClick={() => {
                            setIsOpen(false)
                            setScale(1)
                        }}
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onTouchStart={handleDragStart}
                        onTouchMove={handleDragMove}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.85)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 9999,
                            animation: "fadeIn 0.25s ease",
                            cursor: scale === 1 ? "zoom-in" : "zoom-out",
                        }}
                    >
                        <img
                            src={src}
                            alt={alt}
                            onClick={toggleZoom}
                            style={{
                                maxWidth: "90%",
                                maxHeight: "90%",
                                borderRadius: 12,
                                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                                transform: `scale(${scale})`,
                                transition: "transform 0.25s ease",
                            }}
                        />
                    </div>,
                    document.body,
                )}

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
      `}</style>
        </>
    )
}

// PDF Preview
export function PdfViewerModal({ pdfPath, pdfName, onClose, onDelete }) {
    const [pdfUrl, setPdfUrl] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const res = await fetch(pdfPath, { method: "GET" })
                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                setPdfUrl(url)
            } catch (err) {
                console.error("Failed to load PDF", err)
            } finally {
                setLoading(false)
            }
        }

        fetchPdf()

        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl)
        }
    }, [pdfPath])

    const handleDownload = () => {
        if (!pdfUrl) return
        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = pdfName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (loading) return null

    return createPortal(
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "90%",
                    maxWidth: "800px",
                    height: "90%",
                    background: "#fff",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "90%",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.75rem 1rem",
                        borderBottom: "1px solid #ccc",
                    }}
                >
                    <h3 style={{ margin: 0, color: "#2563eb" }}>PDF Viewer</h3>
                    <button
                        onClick={onClose}
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: "bold",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* PDF Content */}
                <div style={{ flex: 1, overflow: "auto" }}>
                    <iframe src={pdfUrl} type="application/pdf" style={{ width: "100%", height: "100%" }} title="PDF Preview" />
                </div>

                {/* Actions */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "0.5rem",
                        padding: "0.75rem 1rem",
                        borderTop: "1px solid #ccc",
                    }}
                >
                    <button className="btn btn-primary" style={{ width: "6rem" }} onClick={handleDownload}>
                        Download
                    </button>
                    <button onClick={onDelete} className="btn btn-danger">
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    )
}
