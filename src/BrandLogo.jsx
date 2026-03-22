/** Styles for `.brand-logo` — keep in sync anywhere this component ships without GlobalStyles. */
export const BRAND_LOGO_STYLES = `
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1;
  text-decoration: none;
  color: inherit;
}
.brand-logo:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 4px; }
.brand-logo--compact { gap: 0.35rem; }
.brand-logo--compact .brand-logo__mark { width: 22px; height: 22px; }
.brand-logo__wordmark {
  font-family: var(--font-sans, "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif);
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: -0.03em;
  color: var(--ink, #18181b);
}
.brand-logo__suffix { font-weight: 500; color: var(--accent, #2563eb); }
.brand-logo--dark { color: #475569; }
.brand-logo--dark .brand-logo__wordmark { color: var(--ink, #18181b); }
.brand-logo--inverse {
  color: rgba(248, 250, 252, 0.88);
  --brand-logo-accent: #93c5fd;
}
.brand-logo--inverse .brand-logo__wordmark { color: rgba(248, 250, 252, 0.96); }
.brand-logo--inverse .brand-logo__suffix { color: #bfdbfe; font-weight: 600; }
`;

/**
 * Wordmark + simple bridge mark (not a generic “AI” sparkle mark).
 */
export function BrandLogo({
  variant = "dark",
  className = "",
  onClick,
  compact = false,
  showWordmark = true,
}) {
  const size = compact ? 22 : 26;
  const rootClass = [
    "brand-logo",
    `brand-logo--${variant}`,
    compact && "brand-logo--compact",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={rootClass}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <svg
        className="brand-logo__mark"
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M8 26V8"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        <path
          d="M24 26V8"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        <path
          d="M8 12.5c4.2-4.2 11.8-4.2 16 0"
          stroke="var(--brand-logo-accent, var(--accent))"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark && (
        <span className="brand-logo__wordmark">
          Talent<span className="brand-logo__suffix">Bridge</span>
        </span>
      )}
    </span>
  );
}
