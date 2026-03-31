import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"

import { BrandLogo } from "./BrandLogo.jsx"
import { candidateProfile, companyProfile } from "./api.js"
import { fileUrl } from "./utils/utils.js"

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
    const modalRef = useRef(null)
    const [needsTopMargin, setNeedsTopMargin] = useState(false)

    useEffect(() => {
        const el = modalRef.current
        if (!el) return
        const check = () => {
            const rect = el.getBoundingClientRect()
            setNeedsTopMargin(rect.top < 50) // 48px ≈ 3rem
        }

        check()

        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

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
            style={{ zIndex: 10000 }}
        >
            <div
                className={`modal${wide ? " modal-lg" : ""}`}
                role="dialog"
                aria-modal="true"
                ref={modalRef}
                style={{
                    marginTop: needsTopMargin ? "10em" : 0,
                }}
            >
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
    const [avatar, setAvatar] = useState(null)

    useEffect(() => {
        getAvatar()
    }, [user])

    const getAvatar = async () => {
        if (!user) return

        if (user?.role === "job_seeker") {
            const res = await candidateProfile.getOwn()
            setAvatar(res.avatar_url)
        } else if (user?.role === "recruiter") {
            const res = await companyProfile.getOwn()
            setAvatar(res.logo_url)
        }
    }

    return (
        <header className="topnav">
            <BrandLogo className="topnav-logo" variant="dark" onClick={() => navigate("landing")} />
            <div className="topnav-right">
                {user ? (
                    <>
                        <div className="topnav-user-pill">
                            {avatar ? (
                                <ImageViewer
                                    src={fileUrl(avatar)}
                                    alt="logo"
                                    style={{ width: "24px", height: "24px", objectFit: "cover", borderRadius: "50%" }}
                                />
                            ) : (
                                <div className="topnav-user-avatar">{initials}</div>
                            )}
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
    { id: "saved", icon: "🏷️", label: "Saved Jobs" },
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
    const [scale, setScale] = useState(1)
    const startYRef = useRef(null)
    const isDraggingRef = useRef(false) // ← track if mouse is held
    const overlayRef = useRef(null)

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") {
                setIsOpen(false)
                setScale(1)
            }
        }
        if (isOpen) window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [isOpen])

    const handleDragStart = (e) => {
        startYRef.current = e.touches ? e.touches[0].clientY : e.clientY
        isDraggingRef.current = true
    }

    const handleDragEnd = () => {
        startYRef.current = null
        isDraggingRef.current = false
    }

    const handleDragMove = (e) => {
        if (!isDraggingRef.current || startYRef.current === null) return // ← guard
        const currentY = e.touches ? e.touches[0].clientY : e.clientY
        const diff = currentY - startYRef.current
        if (Math.abs(diff) > 100) {
            setIsOpen(false)
            setScale(1)
            handleDragEnd()
        }
    }

    const toggleZoom = (e) => {
        e.stopPropagation()
        setScale((prev) => (prev === 1 ? 2 : 1))
    }

    return (
        <>
            <img src={src} alt={alt} className={className} style={{ cursor: "pointer", ...style }} onClick={() => setIsOpen(true)} />
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
                        onMouseUp={handleDragEnd} // ← clear on release
                        onMouseLeave={handleDragEnd} // ← clear if mouse leaves overlay
                        onTouchStart={handleDragStart}
                        onTouchMove={handleDragMove}
                        onTouchEnd={handleDragEnd} // ← clear on touch end
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
            <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
        </>
    )
}

export function PdfViewerModal({ pdfPath, pdfName, onClose, onDelete }) {
    const [pdfUrl, setPdfUrl] = useState(null)
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
        let interval
        // Animate progress bar while loading
        interval = setInterval(() => {
            setProgress((p) => {
                if (p >= 85) {
                    clearInterval(interval)
                    return 85
                }
                return p + Math.random() * 12
            })
        }, 300)

        const fetchPdf = async () => {
            try {
                const res = await fetch(pdfPath, { method: "GET" })
                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                setPdfUrl(url)
                setProgress(100)
            } catch (err) {
                console.error("Failed to load PDF", err)
            } finally {
                clearInterval(interval)
                setTimeout(() => setLoading(false), 400)
            }
        }
        fetchPdf()
        return () => {
            clearInterval(interval)
            if (pdfUrl) URL.revokeObjectURL(pdfUrl)
        }
    }, [pdfPath])

    const handleClose = () => {
        setVisible(false)
        onClose()
    }

    const handleDownload = () => {
        if (!pdfUrl) return
        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = pdfName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const styles = {
        overlay: {
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.25s ease",
        },
        modal: {
            width: "90%",
            maxWidth: 860,
            height: "90%",
            maxHeight: "90%",
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #e5e7eb",
            background: "#f9fafb",
            flexShrink: 0,
        },
        fileName: {
            margin: 0,
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#111827",
            maxWidth: "70%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        closeBtn: {
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "#e5e7eb",
            cursor: "pointer",
            fontSize: "1.1rem",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
            flexShrink: 0,
        },
        progressBar: {
            height: 3,
            background: "#e5e7eb",
            flexShrink: 0,
            overflow: "hidden",
        },
        progressFill: {
            height: "100%",
            background: "linear-gradient(90deg, #2563eb, #60a5fa)",
            width: `${progress}%`,
            transition: "width 0.4s ease",
            opacity: loading ? 1 : 0,
            transitionProperty: "width, opacity",
        },
        content: {
            flex: 1,
            overflow: "hidden",
            position: "relative",
        },
        skeleton: {
            position: "absolute",
            inset: 0,
            background: "#f3f4f6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: 32,
            opacity: loading ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: loading ? "auto" : "none",
        },
        skeletonIcon: {
            width: 56,
            height: 56,
            borderRadius: 12,
            background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
        },
        skeletonLabel: {
            fontSize: "0.9rem",
            color: "#6b7280",
            fontWeight: 500,
        },
        skeletonLines: {
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "100%",
            maxWidth: 480,
            marginTop: 24,
        },
        iframe: {
            width: "100%",
            height: "100%",
            border: "none",
            opacity: loading ? 0 : 1,
            transition: "opacity 0.4s ease",
        },
        footer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.875rem 1.25rem",
            borderTop: "1px solid #e5e7eb",
            background: "#f9fafb",
            flexShrink: 0,
            gap: "0.5rem",
        },
        badge: {
            fontSize: "0.75rem",
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            gap: 6,
        },
        btnDownload: {
            padding: "0.5rem 1.1rem",
            borderRadius: 8,
            border: "1.5px solid #2563eb",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "background 0.15s",
        },
        btnDelete: {
            padding: "0.5rem 1.1rem",
            borderRadius: 8,
            border: "1.5px solid #fca5a5",
            background: "#fff",
            color: "#dc2626",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "background 0.15s",
        },
    }

    const shimmer = `
        @keyframes shimmer {
            0% { background-position: -600px 0 }
            100% { background-position: 600px 0 }
        }
        .sk-line {
            border-radius: 6px; height: 12px;
            background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
            background-size: 600px 100%;
            animation: shimmer 1.4s infinite;
        }
    `

    return createPortal(
        <>
            <style>{shimmer}</style>
            <div style={styles.overlay} onClick={handleClose}>
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                                <path
                                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                    stroke="#2563eb"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <polyline points="14,2 14,8 20,8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h3 style={styles.fileName}>{pdfName ?? "Document"}</h3>
                        </div>
                        <button style={styles.closeBtn} onClick={handleClose} title="Close">
                            ✕
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div style={styles.progressBar}>
                        <div style={styles.progressFill} />
                    </div>

                    {/* Content */}
                    <div style={styles.content}>
                        {/* Loading skeleton */}
                        <div style={styles.skeleton}>
                            <div style={styles.skeletonIcon}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                        stroke="#2563eb"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <polyline points="14,2 14,8 20,8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span style={styles.skeletonLabel}>Loading document…</span>
                            <div style={styles.skeletonLines}>
                                {[100, 90, 95, 70, 85, 60].map((w, i) => (
                                    <div key={i} className="sk-line" style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                        </div>

                        {/* PDF iframe */}
                        {pdfUrl && <iframe src={pdfUrl} style={styles.iframe} title={pdfName ?? "PDF Preview"} />}
                    </div>

                    {/* Footer */}
                    <div style={styles.footer}>
                        <span style={styles.badge}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2" />
                                <path d="M12 8v4l3 3" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            {loading ? "Loading…" : "Ready"}
                        </span>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn btn-primary" onClick={handleDownload} disabled={loading}>
                                Download
                            </button>
                            <button className="btn btn-danger" onClick={onDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body,
    )
}

// for detail modals
export function DetailCard({ icon, label, value }) {
    return (
        <div style={{ padding: "0.75rem 1rem", borderRadius: "var(--r-md)", border: "1px solid var(--border)", background: "var(--chalk)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginBottom: "0.25rem" }}>
                {icon} {label}
            </div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--ink)" }}>{value}</div>
        </div>
    )
}

export function Section({ title, children, style }) {
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
