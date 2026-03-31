import { useState, useEffect, useRef } from "react"
import { Modal } from "../../shared.jsx"
import { JobPanel } from "./JobPanel.jsx"
import { CompanyPanel } from "./CompanyPanel.jsx"
import { ApplicantPanel } from "./ApplicantPanel.jsx"

export function DetailModal({ onClose, user, onUpdate, mode = "job", ...props }) {
    // mode: "job" | "company" | "applicant"
    // props passed through to the relevant panel

    const [view, setView] = useState(mode)
    const [panelHeight, setPanelHeight] = useState("auto")
    const jobRef = useRef(null)
    const companyRef = useRef(null)
    const applicantRef = useRef(null)
    const [companyInfo, setCompanyInfo] = useState(null)

    const refs = { job: jobRef, company: companyRef, applicant: applicantRef }

    useEffect(() => {
        requestAnimationFrame(() => {
            const el = refs[view]?.current
            if (!el) return
            setPanelHeight(el.scrollHeight + "px")
        })
    }, [view, props.jobInfo, props.companyInfo, props.applicant])

    const VIEWS = [
        mode === "applicant" ? "applicant" : "job", // first panel is always the entry point
        "company",
        mode !== "applicant" ? "applicant" : null,
    ].filter(Boolean)

    const viewIndex = VIEWS.indexOf(view)
    const canGoBack = view !== VIEWS[0]

    const titles = {
        job: props.job?.title ?? props.jobInfo?.title ?? "Job",
        company: "Company Profile",
        applicant: "Applicant Profile",
    }

    return (
        <Modal
            title={
                canGoBack ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                            onClick={() => setView(VIEWS[0])}
                            style={{
                                all: "unset",
                                cursor: "pointer",
                                color: "var(--accent)",
                                fontSize: "var(--text-sm)",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                            }}
                        >
                            ← Back
                        </button>
                        <span style={{ color: "var(--border)" }}>|</span>
                        <span>{titles[view]}</span>
                    </div>
                ) : (
                    titles[view]
                )
            }
            onClose={onClose}
            wide
        >
            <div
                style={{
                    overflow: "hidden",
                    position: "relative",
                    minHeight: panelHeight,
                    transition: "min-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: `translateX(-${viewIndex * (100 / VIEWS.length)}%)`,
                        width: `${VIEWS.length * 100}%`,
                        alignItems: "flex-start",
                    }}
                >
                    {VIEWS.map((v) => (
                        <div
                            key={v}
                            ref={refs[v]}
                            style={{
                                width: `${100 / VIEWS.length}%`,
                                minWidth: 0,
                                paddingRight: "16px",
                                boxSizing: "border-box",
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                            }}
                        >
                            {v === "job" && (
                                <JobPanel
                                    {...props}
                                    companyInfo={companyInfo}
                                    setCompanyInfo={setCompanyInfo}
                                    user={user}
                                    onClose={onClose}
                                    onUpdate={onUpdate}
                                    onViewCompany={() => setView("company")}
                                    onViewApplicant={() => setView("applicant")}
                                />
                            )}
                            {v === "company" && <CompanyPanel {...props} companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />}
                            {v === "applicant" && <ApplicantPanel {...props} onBack={() => setView(VIEWS[0])} />}
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}