import { BrandLogo } from "../BrandLogo"

import "../styles/LandingPage.css"

export function LandingPage({ navigate }) {
    return (
        <div className="lp page-enter">
            <nav className="lp-nav">
                <div className="lp-nav-inner">
                    <BrandLogo className="lp-logo" variant="dark" onClick={() => navigate("landing")} />
                    <ul className="lp-navlinks">
                        <li>
                            <a href="#how">How it works</a>
                        </li>
                        <li>
                            <a href="#features">Features</a>
                        </li>
                        <li>
                            <a href="#recruiters">For recruiters</a>
                        </li>
                        <li>
                            <a className="cta" onClick={() => navigate("register")}>
                                Get started
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <section className="lp-hero">
                <div className="lp-hero-left">
                    <p className="lp-eyebrow">Job seekers · Employers</p>
                    <h1 className="lp-h1">
                        Find work
                        <br />
                        that actually
                        <br />
                        <em>fits.</em>
                    </h1>
                    <p className="lp-sub">
                        Search roles, track applications, and work with teams that verify their company profile before they post. Fewer surprises,
                        clearer next steps.
                    </p>
                    <div className="lp-btns">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate("register")}>
                            Browse jobs →
                        </button>
                        <a href="#how" className="btn btn-secondary btn-lg">
                            See how it works
                        </a>
                    </div>
                    <div className="lp-stats">
                        {[
                            ["12,400+", "Active listings"],
                            ["3,200", "Verified companies"],
                            ["89%", "Placement rate"],
                        ].map(([v, l]) => (
                            <div key={l}>
                                <div className="lp-stat-val">{v}</div>
                                <div className="lp-stat-label">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lp-hero-right">
                    <div className="lp-hero-grid" />
                    <div
                        className="lp-orb"
                        style={{ bottom: "-7rem", right: "-7rem", width: 300, height: 300, border: "1px solid rgba(148,163,184,0.15)" }}
                    />
                    <div
                        className="lp-orb"
                        style={{ top: "-4rem", left: "-4rem", width: 180, height: 180, border: "1px solid rgba(148,163,184,0.1)" }}
                    />
                    <span className="lp-floater lp-f1">Remote · Full-time</span>
                    <span className="lp-floater lp-f2">AI / Machine Learning</span>
                    <span className="lp-floater lp-f3">Verified employer ✓</span>
                    <span className="lp-floater lp-f4">$120k – $160k</span>
                    <div className="lp-stack">
                        <div className="lp-jcard">
                            <div className="lp-jc-pill">Design</div>
                            <div className="lp-jc-title">UI Designer</div>
                            <div className="lp-jc-co">Forma Studio · Ho Chi Minh City</div>
                        </div>
                        <div className="lp-jcard">
                            <div className="lp-jc-pill">Engineering</div>
                            <div className="lp-jc-title">Backend Engineer</div>
                            <div className="lp-jc-co">Vinhomes Tech · Hanoi</div>
                        </div>
                        <div className="lp-jcard">
                            <div className="lp-jc-pill">Product</div>
                            <div className="lp-jc-title">Product Manager</div>
                            <div className="lp-jc-co">NovaPay · Remote</div>
                            <div className="lp-jc-tags">
                                <span className="lp-jc-tag">Full-time</span>
                                <span className="lp-jc-tag">5+ yrs</span>
                                <span className="lp-jc-tag">Remote</span>
                            </div>
                            <div className="lp-jc-foot">
                                <span className="lp-jc-sal">$90k – $120k / yr</span>
                                <button className="lp-jc-btn" onClick={() => navigate("login")}>
                                    Apply now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="lp-marquee">
                <div className="lp-mtrack">
                    {MARQUEE_ITEMS.map((m, i) => (
                        <span key={i} className="lp-mitem">
                            {m}
                        </span>
                    ))}
                </div>
            </div>
            
            <section className="lp-section lp-how" id="how">
                <div className="lp-container">
                    <div className="lp-how-inner">
                        <div>
                            <p className="lp-slabel">How it works</p>
                            <h2 className="lp-sh">From profile to placement in four steps</h2>
                            <div className="lp-steps-list">
                                {STEPS.map((s) => (
                                    <div key={s.n} className="lp-step">
                                        <div className="lp-step-n">{s.n}</div>
                                        <div>
                                            <div className="lp-step-t">{s.t}</div>
                                            <div className="lp-step-d">{s.d}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <div className="lp-pm">
                                <div className="lp-pm-head">
                                    <div className="lp-pm-av">AT</div>
                                    <div>
                                        <div className="lp-pm-name">Anh Tran</div>
                                        <div className="lp-pm-role">Product Designer · Hanoi</div>
                                    </div>
                                </div>
                                <div className="lp-pm-tags">
                                    {["Figma", "UX Research", "React", "Design Systems", "Prototyping"].map((t) => (
                                        <span key={t} className="lp-pm-tag">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                {[
                                    ["Profile strength", "86%", 86, "var(--accent)"],
                                    ["Applications sent", "4 active", 60, "var(--sage)"],
                                ].map(([l, v, w, c]) => (
                                    <div key={l} className="lp-pm-bar-wrap">
                                        <div className="lp-pm-bar-row">
                                            <span>{l}</span>
                                            <span>{v}</span>
                                        </div>
                                        <div className="lp-pm-bar">
                                            <div className="lp-pm-fill" style={{ width: `${w}%`, background: c }} />
                                        </div>
                                    </div>
                                ))}
                                <div className="lp-pm-status">
                                    <span className="lp-pm-dot" />
                                    Active and visible to recruiters
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="lp-section lp-features" id="features">
                <div className="lp-container">
                    <p className="lp-slabel">Platform capabilities</p>
                    <h2 className="lp-sh">Everything you need — nothing you don't.</h2>
                    <div className="lp-feat-grid">
                        {FEATURES.map((f) => (
                            <div key={f.t} className="lp-feat-card">
                                <div className="lp-feat-icon">{f.i}</div>
                                <div className="lp-feat-title">{f.t}</div>
                                <div className="lp-feat-desc">{f.d}</div>
                                <span className="lp-feat-tag">{f.tag}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dual CTA */}
            <div className="lp-cta" id="recruiters">
                <div className="lp-cta-panel lp-cta-seeker">
                    <p className="lp-slabel">For job seekers</p>
                    <h2 className="lp-sh">Land your next great role.</h2>
                    <p className="lp-cta-body">A modern platform built for candidates who refuse to settle.</p>
                    <ul className="lp-cta-list">
                        {[
                            "Rich profile with CV upload and preview",
                            "Filters for role, location, salary, and type",
                            "Application status you can follow end to end",
                            "Saved jobs synced to your account",
                            "Email alerts for new matches (coming soon)",
                        ].map((item) => (
                            <li key={item}>
                                <span className="lp-arr">→</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => navigate("register")}>
                        Create free account →
                    </button>
                </div>
                <div className="lp-cta-panel lp-cta-recruiter">
                    <p className="lp-slabel">For recruiters</p>
                    <h2 className="lp-sh">Hire smarter, faster.</h2>
                    <p className="lp-cta-body">Post jobs, manage applicants, and close roles with AI on your side.</p>
                    <ul className="lp-cta-list">
                        {[
                            "One-click job posting with rich descriptions",
                            "Applicant filtering by experience, skills, location",
                            "AI candidate ranking and scoring",
                            "In-platform status management and notifications",
                            "Real-time analytics on every posting",
                        ].map((item) => (
                            <li key={item}>
                                <span className="lp-arr">→</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-sage" style={{ alignSelf: "flex-start" }} onClick={() => navigate("register")}>
                        Start hiring today →
                    </button>
                </div>
            </div>

            {/* Testimonials */}
            <section className="lp-section lp-social">
                <div className="lp-container">
                    <p className="lp-slabel">What people say</p>
                    <h2 className="lp-sh">Trusted by professionals and teams.</h2>
                    <div className="lp-tgrid">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.n} className="lp-tcard">
                                <p className="lp-tq">"{t.q}"</p>
                                <div className="lp-tauthor">
                                    <div className="lp-tav" style={{ background: t.bg, color: t.c }}>
                                        {t.i}
                                    </div>
                                    <div>
                                        <div className="lp-tname">{t.n}</div>
                                        <div className="lp-trole">{t.r}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="lp-footer">
                <div className="lp-container">
                    <div className="lp-fgrid">
                        <div>
                            <BrandLogo className="lp-fbrand" variant="inverse" compact />
                            <p className="lp-ftagline">Connecting ambitious professionals with companies that see beyond the résumé.</p>
                        </div>
                        {[
                            { h: "Platform", links: ["Browse jobs", "Post a job", "Company profiles", "Pricing"] },
                            { h: "Company", links: ["About us", "Blog", "Careers", "Press"] },
                            { h: "Legal", links: ["Privacy policy", "Terms of service", "Cookie settings"] },
                        ].map((col) => (
                            <div key={col.h}>
                                <div className="lp-fhead">{col.h}</div>
                                <ul className="lp-flinks">
                                    {col.links.map((l) => (
                                        <li key={l}>
                                            <a href="#">{l}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="lp-fbot">
                        <span>© 2026 JobBridge. All rights reserved.</span>
                        <span>Made with care in Vietnam</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

const MARQUEE_ITEMS = [
    "Roles across Vietnam and beyond",
    "Find your next move",
    "Hire with a clear process",
    "Filters that stay out of your way",
    "Verified employer accounts",
    "Status updates on every application",
].flatMap((x) => [x, x])

const STEPS = [
    { n: "01", t: "Create your profile", d: "Build a rich profile with your resume, skills, and experience. Upload your CV in PDF or DOCX." },
    { n: "02", t: "Search and filter", d: "Smart keyword search — filter by role, location, salary range, type, and experience level." },
    { n: "03", t: "Apply in seconds", d: "Select a job, choose your CV, and submit. No redundant forms — your profile does the talking." },
    { n: "04", t: "Track your journey", d: "Watch your application status move in real time: submitted → shortlisted → interview scheduled." },
]

const FEATURES = [
    { i: "🔍", t: "Smart search & filters", d: "Search by title, skill, location, salary range, and experience level.", tag: "Seekers" },
    { i: "📄", t: "CV upload & preview", d: "Upload PDF or DOCX. Preview before submitting. Choose a different CV per application.", tag: "Seekers" },
    { i: "📍", t: "Application tracker", d: "See exactly where every application stands — from submitted to interview scheduled.", tag: "Seekers" },
    { i: "🏢", t: "Verified companies", d: "Employers go through document verification and manual admin review before posting.", tag: "Recruiters" },
    {
        i: "📑",
        t: "Applicant shortlists",
        d: "Compare candidates against role requirements in one view—notes and status in the same place.",
        tag: "Recruiters",
    },
    { i: "📊", t: "Recruitment analytics", d: "Track views, applicant counts, conversion rates, and time-to-hire metrics.", tag: "Recruiters" },
]

const TESTIMONIALS = [
    {
        q: "I applied to seven jobs in one afternoon. The tracker made the whole process feel manageable for the first time.",
        n: "Minh Le",
        r: "Frontend Engineer · Hired at NovaPay",
        i: "ML",
        bg: "#e0e7ff",
        c: "#3730a3",
    },
    {
        q: "We cut review time sharply. One hundred twenty applicants down to a shortlist of eight took less than a day.",
        n: "Phuong Hoang",
        r: "Head of Talent · Vinhomes Tech",
        i: "PH",
        bg: "#f1f5f9",
        c: "#475569",
    },
    {
        q: "Seeing my application move to 'interview scheduled' in real time was genuinely exciting. No more guessing.",
        n: "Nguyen Thao",
        r: "Product Designer · Forma Studio",
        i: "NT",
        bg: "#dbeafe",
        c: "#1d4ed8",
    },
]