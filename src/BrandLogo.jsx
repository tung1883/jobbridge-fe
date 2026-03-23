export function BrandLogo({ variant = "dark", className = "", onClick, compact = false, showWordmark = true }) {
    const size = compact ? 22 : 26
    const rootClass = ["brand-logo", `brand-logo--${variant}`, compact && "brand-logo--compact", className].filter(Boolean).join(" ")

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
                <path d="M8 26V8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
                <path d="M24 26V8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
                <path d="M8 12.5c4.2-4.2 11.8-4.2 16 0" stroke="var(--brand-logo-accent, var(--accent))" strokeWidth="2.25" strokeLinecap="round" />
            </svg>
            {showWordmark && (
                <span className="brand-logo__wordmark">
                    Job<span className="brand-logo__suffix">Bridge</span>
                </span>
            )}
        </span>
    )
}
