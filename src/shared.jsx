// ─────────────────────────────────────────────────────────────
//  shared.jsx — global styles and UI primitives
// ─────────────────────────────────────────────────────────────
import { useEffect } from "react";
import { BrandLogo, BRAND_LOGO_STYLES } from "./BrandLogo.jsx";

// ── Global CSS ────────────────────────────────────────────────
export const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --font-sans: "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  /* Core palette — minimal, neutral + single accent */
  --ink:          #18181b;
  --ink-60:       rgba(24,24,27,0.55);
  --ink-20:       rgba(24,24,27,0.12);
  --ink-10:       rgba(24,24,27,0.06);
  --chalk:        #ffffff;
  --cream:        #f4f4f5;
  --cream-dark:   #e4e4e7;
  --accent:       #2563eb;
  --accent-hover: #1d4ed8;
  --accent-muted: rgba(37,99,235,0.12);
  --accent-soft:  #eff6ff;
  /* Legacy token names (used across pages) — mapped to new system */
  --gold:         var(--accent);
  --gold-light:   #93c5fd;
  --gold-dim:     var(--accent-muted);
  --copper:       #1d4ed8;
  --sage:         #475569;
  --sage-light:   #e2e8f0;
  --sage-dim:     rgba(71,85,105,0.1);
  --muted:        #71717a;
  --danger:       #dc2626;
  --danger-bg:    #fef2f2;
  --success:      #15803d;
  --success-bg:   #f0fdf4;
  --warn:         #a16207;
  --warn-bg:      #fefce8;
  --info:         #1d4ed8;
  --info-bg:      #eff6ff;

  /* Borders */
  --border:       rgba(24,24,27,0.09);
  --border-md:    rgba(24,24,27,0.14);
  --border-dark:  rgba(24,24,27,0.22);

  /* Geometry */
  --r-sm:   4px;
  --r-md:   6px;
  --r-lg:   10px;
  --r-xl:   14px;
  --r-full: 9999px;

  /* Elevation — subtle */
  --shadow-sm: 0 1px 2px rgba(24,24,27,0.04);
  --shadow:    0 1px 3px rgba(24,24,27,0.06), 0 1px 2px rgba(24,24,27,0.04);
  --shadow-lg: 0 4px 12px rgba(24,24,27,0.06);
  --shadow-xl: 0 8px 24px rgba(24,24,27,0.08);

  /* Typography scale */
  --text-xs:   0.70rem;
  --text-sm:   0.80rem;
  --text-base: 0.875rem;
  --text-md:   1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.35rem;
  --text-2xl:  1.75rem;
  --text-3xl:  2.25rem;

  /* Spacing */
  --sp-xs:  0.25rem;
  --sp-sm:  0.5rem;
  --sp-md:  1rem;
  --sp-lg:  1.5rem;
  --sp-xl:  2rem;
  --sp-2xl: 3rem;
}

${BRAND_LOGO_STYLES}

html { scroll-behavior: smooth; }
body {
  font-family: var(--font-sans);
  background: var(--cream);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "kern" 1, "liga" 1;
}

/* ── Transitions ── */
.page-enter { animation: pageIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }
@keyframes pageIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }

/* ── App Shell ── */
.app-shell { display: flex; flex-direction: column; min-height: 100vh; }

/* ── Top Nav ── */
.topnav {
  position: sticky; top: 0; z-index: 300;
  height: 56px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.topnav-logo { cursor: pointer; user-select: none; }
.topnav-logo .brand-logo__wordmark { font-size: 1.02rem; }
.topnav-right { display: flex; align-items: center; gap: 0.75rem; }
.topnav-user-pill {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.3rem 0.75rem 0.3rem 0.4rem;
  background: var(--cream); border: 1px solid var(--border);
  border-radius: var(--r-full); font-size: var(--text-sm);
}
.topnav-user-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--accent-soft);
  border: 1px solid var(--accent-muted);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 700; color: var(--accent);
  flex-shrink: 0;
}
.topnav-role-badge {
  font-size: 0.65rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
  padding: 0.15rem 0.5rem; border-radius: var(--r-full);
  background: var(--ink-10); color: var(--muted);
}

/* ── Dashboard Layout ── */
.dash-layout { display: grid; grid-template-columns: 200px 1fr; flex: 1; min-height: 0; }

/* ── Sidebar ── */
.sidebar {
  background: #0f172a;
  display: flex; flex-direction: column;
  padding: 1.25rem 0;
  overflow-y: auto;
  position: sticky; top: 56px; height: calc(100vh - 56px);
}
.sidebar-section {
  padding: 0.4rem 1.25rem 0.3rem;
  font-size: 0.62rem; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: rgba(255,255,255,0.22);
  margin-top: 0.75rem;
}
.sidebar-section:first-child { margin-top: 0; }
.nav-item {
  display: flex; align-items: center; gap: 0.65rem;
  padding: 0.6rem 1.25rem;
  font-size: var(--text-base); color: rgba(255,255,255,0.45);
  cursor: pointer; border: none; background: none;
  font-family: var(--font-sans);
  width: 100%; text-align: left;
  transition: background 0.15s, color 0.15s;
  border-left: 2px solid transparent;
}
.nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
.nav-item.active {
  background: rgba(255,255,255,0.08);
  color: #fff;
  border-left-color: var(--accent);
}
.nav-item .nav-icon { font-size: 0.95rem; width: 1.1rem; text-align: center; flex-shrink: 0; }
.sidebar-spacer { flex: 1; }
.sidebar-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(255,255,255,0.06);
  margin-top: 0.5rem;
}

/* ── Page Content ── */
.dash-content { padding: 1.5rem 1.25rem; background: var(--cream); overflow-y: auto; }
.page-header { margin-bottom: 1.75rem; }
.page-title { font-size: var(--text-2xl); font-weight: 600; letter-spacing: -0.03em; line-height: 1.15; }
.page-sub { font-size: var(--text-base); color: var(--muted); margin-top: 0.3rem; }
.page-header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.75rem; }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  border-radius: var(--r-md);
  font-size: var(--text-base); font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer; border: 1.5px solid transparent;
  transition: background 0.18s, border-color 0.18s, transform 0.15s, opacity 0.18s;
  line-height: 1.2; white-space: nowrap;
}
.btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }
.btn-primary   { background: var(--ink);     color: var(--chalk);   border-color: var(--ink); }
.btn-primary:hover:not(:disabled)   { background: var(--ink-60); border-color: var(--ink-60); }
.btn-secondary { background: transparent;   color: var(--ink);    border-color: var(--border-md); }
.btn-secondary:hover:not(:disabled) { border-color: var(--ink);    background: var(--chalk); }
.btn-sage      { background: var(--sage);    color: var(--chalk);   border-color: var(--sage); }
.btn-sage:hover:not(:disabled)      { background: #334155; }
.btn-gold      { background: var(--accent); color: #fff;           border-color: var(--accent); }
.btn-gold:hover:not(:disabled)      { background: var(--accent-hover); border-color: var(--accent-hover); }
.btn-danger    { background: transparent;   color: var(--danger);  border-color: rgba(192,57,43,0.3); }
.btn-danger:hover:not(:disabled)    { background: var(--danger-bg); }
.btn-ghost     { background: transparent;   color: var(--muted);   border-color: transparent; }
.btn-ghost:hover:not(:disabled)     { color: var(--ink); background: var(--cream); }
.btn-sm { padding: 0.35rem 0.8rem;  font-size: var(--text-sm);  border-radius: var(--r-sm); }
.btn-lg { padding: 0.85rem 1.75rem; font-size: var(--text-md);  }
.btn-icon-only { padding: 0.5rem; border-radius: var(--r-md); }

/* ── Cards ── */
.card        { background: var(--chalk); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 1.25rem; box-shadow: var(--shadow-sm); }
.card-hover  { transition: box-shadow 0.2s, border-color 0.2s; }
.card-hover:hover { box-shadow: var(--shadow); border-color: var(--border-md); }
.card-flat   { background: var(--chalk); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 1.25rem; }
.card-dark   { background: #0f172a; border: 1px solid rgba(255,255,255,0.08); border-radius: var(--r-lg); padding: 1.5rem; }
.card-title  { font-size: var(--text-lg); font-weight: 600; margin-bottom: 0.25rem; }
.card-sub    { font-size: var(--text-sm); color: var(--muted); }

/* ── Form Fields ── */
.field { margin-bottom: 1rem; }
.field:last-child { margin-bottom: 0; }
.field-label { display: block; font-size: var(--text-sm); font-weight: 500; margin-bottom: 0.4rem; color: var(--ink); }
.field-label .opt { font-weight: 400; color: var(--muted); }
.field-input, .field-select, .field-textarea {
  width: 100%; padding: 0.68rem 0.9rem;
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  font-size: var(--text-base); font-family: var(--font-sans);
  background: var(--chalk); color: var(--ink);
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
}
.field-input:focus, .field-select:focus, .field-textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-muted);
}
.field-input.err, .field-select.err, .field-textarea.err { border-color: var(--danger); }
.field-input:disabled, .field-select:disabled { opacity: 0.55; cursor: not-allowed; }
.field-textarea { resize: vertical; min-height: 96px; line-height: 1.6; }
.field-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236e6b64' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.8rem center; padding-right: 2.2rem; }
.field-error { font-size: var(--text-xs); color: var(--danger); margin-top: 0.3rem; display: flex; align-items: center; gap: 0.3rem; }
.field-hint  { font-size: var(--text-xs); color: var(--muted);  margin-top: 0.3rem; }
.field-wrap  { position: relative; }
.field-addon-right { position: absolute; right: 0.7rem; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: var(--text-sm); }
.field-input.has-right { padding-right: 2.5rem; }
.field-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.field-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }

/* ── Badges ── */
.badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.2rem 0.6rem; border-radius: var(--r-full); font-size: var(--text-xs); font-weight: 500; line-height: 1.4; }
.badge-gold    { background: var(--ink-10);     color: var(--muted); }
.badge-sage    { background: var(--sage-dim);    color: var(--sage); }
.badge-ink     { background: var(--ink-10);      color: var(--ink); }
.badge-danger  { background: var(--danger-bg);   color: var(--danger); }
.badge-success { background: var(--success-bg);  color: var(--success); }
.badge-warn    { background: var(--warn-bg);      color: var(--warn); }
.badge-info    { background: var(--info-bg);      color: var(--info); }

/* Status badges */
.status-submitted          { background: #eef2ff; color: #3730a3; }
.status-under_review       { background: var(--warn-bg); color: var(--warn); }
.status-shortlisted        { background: var(--success-bg); color: var(--success); }
.status-interview_scheduled{ background: var(--sage-dim); color: var(--sage); }
.status-rejected           { background: var(--danger-bg); color: var(--danger); }
.status-pending            { background: var(--warn-bg); color: var(--warn); }
.status-approved           { background: var(--success-bg); color: var(--success); }

/* ── Alerts ── */
.alert { padding: 0.7rem 1rem; border-radius: var(--r-md); font-size: var(--text-sm); display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 1rem; border: 1px solid transparent; }
.alert-icon { flex-shrink: 0; font-size: 0.9rem; line-height: 1.4; }
.alert-danger  { background: var(--danger-bg);  border-color: rgba(192,57,43,0.2);  color: var(--danger); }
.alert-success { background: var(--success-bg); border-color: rgba(30,126,74,0.2);  color: var(--success); }
.alert-warn    { background: var(--warn-bg);     border-color: rgba(146,96,10,0.2);  color: var(--warn); }
.alert-info    { background: var(--info-bg);     border-color: rgba(26,92,142,0.2);  color: var(--info); }

/* ── Spinner ── */
.spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid var(--ink-20); border-top-color: var(--ink); border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
.spinner-sm    { width: 14px; height: 14px; }
.spinner-lg    { width: 28px; height: 28px; border-width: 3px; }
.spinner-white { border-color: rgba(255,255,255,0.25); border-top-color: #fff; }
.spinner-gold  { border-color: var(--accent-muted); border-top-color: var(--accent); }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Table ── */
.tbl { width: 100%; border-collapse: collapse; font-size: var(--text-base); }
.tbl th { text-align: center; padding: 0.6rem 1rem; font-size: var(--text-xs); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); border-bottom: 1.5px solid var(--border); white-space: nowrap; vertical-align: middle; }
.tbl th:first-child { text-align: left; }
.tbl td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); vertical-align: middle; text-align: center; }
.tbl td:first-child { text-align: left; }
.tbl tr:last-child td { border-bottom: none; }
.tbl tbody tr:hover td { background: var(--cream); }
.tbl-action-col { width: 180px; white-space: nowrap; }

/* ── Modal ── */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(15,23,42,0.45);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease;
}
.modal {
  background: var(--chalk);
  border-radius: var(--r-xl);
  padding: 1.5rem;
  width: 100%; max-width: 520px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: pageIn 0.28s cubic-bezier(0.22,1,0.36,1);
}
.modal-lg { max-width: 700px; }
.modal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; gap: 1rem; }
.modal-title { font-size: var(--text-xl); font-weight: 600; line-height: 1.25; }
.modal-sub { font-size: var(--text-sm); color: var(--muted); margin-top: 0.3rem; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border); }

/* ── Empty state ── */
.empty-state { text-align: center; padding: 4rem 2rem; color: var(--muted); }
.empty-icon  { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
.empty-title { font-size: var(--text-lg); font-weight: 600; color: var(--ink); margin-bottom: 0.5rem; }
.empty-desc  { font-size: var(--text-base); line-height: 1.65; max-width: 30ch; margin: 0 auto 1.5rem; }

/* ── Divider ── */
.divider { height: 1px; background: var(--border); margin: 1.25rem 0; }
.divider-text { display: flex; align-items: center; gap: 1rem; color: var(--muted); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.1em; margin: 1.25rem 0; }
.divider-text::before, .divider-text::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* ── Utility ── */
.flex          { display: flex; }
.flex-center   { display: flex; align-items: center; }
.flex-between  { display: flex; align-items: center; justify-content: space-between; }
.flex-col      { display: flex; flex-direction: column; }
.gap-xs  { gap: 0.25rem; }
.gap-sm  { gap: 0.5rem; }
.gap-md  { gap: 1rem; }
.gap-lg  { gap: 1.5rem; }
.grid-2  { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.grid-3  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
.grid-auto-280 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
.mt-sm { margin-top: 0.5rem; }
.mt-md { margin-top: 1rem; }
.mt-lg { margin-top: 1.5rem; }
.mb-md { margin-bottom: 1rem; }
.text-muted { color: var(--muted); }
.text-sm    { font-size: var(--text-sm); }
.text-xs    { font-size: var(--text-xs); }
.fw-500     { font-weight: 500; }
.truncate   { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── Filter bar (jobs search) ── */
.filter-bar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 0.75rem;
  align-items: flex-end;
}
.filter-bar-actions { min-width: 7rem; }
.tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .dash-layout { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .dash-content { padding: 1rem; }
  .field-row-2, .field-row-3, .grid-2, .grid-3 { grid-template-columns: 1fr; }
  .topnav { padding: 0 1rem; }
  .page-header-row { flex-direction: column; }
  .filter-bar-actions { min-width: 100%; }
  .filter-bar-actions .btn { width: 100%; }
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

// ── GlobalStyles ───────────────────────────────────────────
export function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />;
}

// ── Spinner ────────────────────────────────────────────────
export function Spinner({ size, white, gold } = {}) {
  return (
    <span
      className={[
        "spinner",
        size === "sm" ? "spinner-sm" : size === "lg" ? "spinner-lg" : "",
        white ? "spinner-white" : "",
        gold  ? "spinner-gold"  : "",
      ].filter(Boolean).join(" ")}
    />
  );
}

// ── Alert ──────────────────────────────────────────────────
export function Alert({ type = "danger", children, onClose }) {
  const icons = { danger: "⚠", success: "✓", warn: "⚠", info: "ℹ" };
  return (
    <div className={`alert alert-${type}`} role="alert">
      <span className="alert-icon">{icons[type]}</span>
      <span style={{ flex: 1 }}>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: "0 0.2rem", fontSize: "0.9rem", lineHeight: 1 }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ── StatusBadge ────────────────────────────────────────────
const STATUS_LABELS = {
  submitted:           "Submitted",
  under_review:        "Under Review",
  shortlisted:         "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  rejected:            "Rejected",
  pending:             "Pending",
  approved:            "Approved",
};
export function StatusBadge({ status }) {
  return (
    <span className={`badge status-${status}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
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
      {error && <div className="field-error"><span>⚠</span>{error}</div>}
      {hint  && <div className="field-hint">{hint}</div>}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────
export function Modal({ title, sub, onClose, children, footer, wide }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >
      <div className={`modal${wide ? " modal-lg" : ""}`} role="dialog">
        <div className="modal-header">
          <div>
            <div className="modal-title">{title}</div>
            {sub && <div className="modal-sub">{sub}</div>}
          </div>
          {onClose && (
            <button className="btn btn-ghost btn-sm btn-icon-only" onClick={onClose} aria-label="Close">✕</button>
          )}
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
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
  );
}

// ── TopNav ─────────────────────────────────────────────────
export function TopNav({ user, navigate, onLogout }) {
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "?";
  return (
    <header className="topnav">
      <BrandLogo
        className="topnav-logo"
        variant="dark"
        onClick={() => navigate("landing")}
      />
      <div className="topnav-right">
        {user ? (
          <>
            <div className="topnav-user-pill">
              <div className="topnav-user-avatar">{initials}</div>
              <span className="text-sm truncate" style={{ maxWidth: 180 }}>{user.email}</span>
              <span className="topnav-role-badge">{user.role}</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={onLogout}>Sign out</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("login")}>Sign in</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("register")}>Get started</button>
          </>
        )}
      </div>
    </header>
  );
}

// ── Sidebar ────────────────────────────────────────────────
const SEEKER_NAV = [
  { section: "Discover" },
  { id: "jobs",         icon: "🔍", label: "Browse Jobs" },
  { id: "saved",        icon: "🔖", label: "Saved Jobs" },
  { section: "My Activity" },
  { id: "applications", icon: "📋", label: "My Applications" },
  { id: "cvs",          icon: "📄", label: "My CVs" },
  { section: "Account" },
  { id: "profile",      icon: "👤", label: "Profile" },
];

const RECRUITER_NAV = [
  { section: "Jobs" },
  { id: "jobs-mine",  icon: "📢", label: "My Postings" },
  { id: "job-create", icon: "➕", label: "Post a Job" },
  { section: "Applications" },
  { id: "applicants", icon: "👥", label: "Applicants" },
  { section: "Account" },
  { id: "company",    icon: "🏢", label: "Company Profile" },
];

export function Sidebar({ role, active, onNavigate, onLogout }) {
  const items = role === "recruiter" ? RECRUITER_NAV : SEEKER_NAV;
  return (
    <aside className="sidebar">
      {items.map((item, i) =>
        item.section ? (
          <div key={`s-${i}`} className="sidebar-section">{item.section}</div>
        ) : (
          <button
            key={item.id}
            className={`nav-item${active === item.id ? " active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        )
      )}
      <div className="sidebar-spacer" />
      <div className="sidebar-footer">
        <button
          className="nav-item"
          style={{ color: "rgba(255,255,255,0.3)", width: "100%", padding: "0.5rem 0" }}
          onClick={onLogout}
        >
          <span className="nav-icon">↩</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}

// ── ConfirmModal ───────────────────────────────────────────
export function ConfirmModal({ title, desc, onConfirm, onCancel, danger }) {
  return (
    <Modal title={title} sub={desc} onClose={onCancel}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>
            {danger ? "Delete" : "Confirm"}
          </button>
        </>
      }
    />
  );
}

// ── LoadingPage ────────────────────────────────────────────
export function LoadingPage() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: "1rem", color: "var(--muted)" }}>
      <Spinner size="lg" gold />
      <span style={{ fontSize: "var(--text-sm)" }}>Loading…</span>
    </div>
  );
}

// ── ErrorPage ──────────────────────────────────────────────
export function ErrorPage({ message, onRetry }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "0.5rem" }}>Something went wrong</div>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--muted)", marginBottom: "1.5rem" }}>{message}</p>
        {onRetry && <button className="btn btn-primary" onClick={onRetry}>Try again</button>}
      </div>
    </div>
  );
}

// ── SalaryDisplay ──────────────────────────────────────────
export function SalaryDisplay({ min, max, currency = "USD" }) {
  const fmt = (n) => Number(n).toLocaleString();
    if ((!min && !max) || (min == 0 && !max) || (!min && max == 0) && (min == 0 && max == 0)) {
      return <span style={{ color: "var(--muted)" }}>Salary Negotiable</span>
    }
    if (min && max) return <span>{currency} {fmt(min)} – {fmt(max)}</span>;
    if (min && min > 0)        return <span>From {currency} {fmt(min)}</span>;
    if (max) return            <span>Up to {currency} {fmt(max)}</span>;
  }

// ── DateDisplay ────────────────────────────────────────────
export function DateDisplay({ date }) {
  if (!date) return <span>—</span>;
  return (
    <span>
      {new Date(date).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      })}
    </span>
  );
}
