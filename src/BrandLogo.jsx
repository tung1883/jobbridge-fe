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
            <img src="../public/jobbridge.svg" className="brand-logo__mark" width={size} height={size} aria-hidden />
            {showWordmark && (
                <span className="brand-logo__wordmark">
                    Job<span className="brand-logo__suffix">Bridge</span>
                </span>
            )}
        </span>
    )
}
