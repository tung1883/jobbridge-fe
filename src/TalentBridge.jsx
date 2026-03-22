import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #18181b;
    --chalk: #ffffff;
    --cream: #f4f4f5;
    --accent: #2563eb;
    --accent-soft: #eff6ff;
    --gold: var(--accent);
    --gold-light: #93c5fd;
    --copper: #1d4ed8;
    --sage: #475569;
    --sage-light: #e2e8f0;
    --muted: #71717a;
    --border: rgba(24,24,27,0.09);
    --radius: 6px;
  }

  html { scroll-behavior: smooth; }

  .tb-body {
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    background: var(--chalk);
    color: var(--ink);
    overflow-x: hidden;
  }

  /* NAV */
  .tb-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 4rem;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .tb-nav-logo {
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    font-size: 1.5rem; font-weight: 700;
    letter-spacing: -0.02em; color: var(--ink); text-decoration: none;
  }
  .tb-nav-logo span { color: var(--accent); }
  .tb-nav-links { display: flex; align-items: center; gap: 2.5rem; list-style: none; }
  .tb-nav-links a {
    font-size: 0.875rem; font-weight: 400; color: var(--muted);
    text-decoration: none; letter-spacing: 0.02em; transition: color 0.2s; cursor: pointer;
  }
  .tb-nav-links a:hover { color: var(--ink); }
  .tb-nav-cta {
    background: var(--ink) !important; color: var(--chalk) !important;
    padding: 0.55rem 1.4rem; border-radius: var(--radius); font-weight: 500;
    transition: background 0.2s, transform 0.15s !important;
  }
  .tb-nav-cta:hover { background: var(--sage) !important; transform: translateY(-1px); }

  /* HERO */
  .tb-hero {
    min-height: 100vh;
    display: grid; grid-template-columns: 1fr 1fr;
    padding-top: 5rem; overflow: hidden;
  }
  .tb-hero-left {
    display: flex; flex-direction: column; justify-content: center;
    padding: 6rem 4rem; position: relative; z-index: 2;
  }
  .tb-eyebrow {
    display: inline-flex; align-items: center; gap: 0.6rem;
    font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
    margin-bottom: 1.75rem;
    opacity: 0; animation: tb-fadeUp 0.7s 0.2s forwards;
  }
  .tb-eyebrow::before { content: ''; width: 1.5rem; height: 1px; background: var(--border); }
  .tb-headline {
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    font-size: clamp(3rem, 5vw, 4.75rem);
    font-weight: 700; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 1.5rem;
    opacity: 0; animation: tb-fadeUp 0.7s 0.35s forwards;
  }
  .tb-headline em { font-style: normal; color: var(--accent); }
  .tb-sub {
    font-size: 1.1rem; font-weight: 300; color: var(--muted);
    line-height: 1.7; max-width: 38ch; margin-bottom: 3rem;
    opacity: 0; animation: tb-fadeUp 0.7s 0.5s forwards;
  }
  .tb-hero-actions {
    display: flex; align-items: center; gap: 1rem;
    opacity: 0; animation: tb-fadeUp 0.7s 0.65s forwards;
  }
  .tb-btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--ink); color: var(--chalk);
    padding: 0.9rem 2rem; border-radius: var(--radius);
    font-size: 0.95rem; font-weight: 500; text-decoration: none; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    border: 1.5px solid var(--ink); font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  }
  .tb-btn-primary:hover { background: var(--sage); border-color: var(--sage); transform: translateY(-2px); }
  .tb-btn-outline {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: transparent; color: var(--ink);
    padding: 0.9rem 2rem; border-radius: var(--radius);
    font-size: 0.95rem; font-weight: 500; text-decoration: none; cursor: pointer;
    border: 1.5px solid var(--border);
    transition: border-color 0.2s, transform 0.15s;
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  }
  .tb-btn-outline:hover { border-color: var(--ink); transform: translateY(-2px); }
  .tb-hero-stats {
    display: flex; gap: 3rem; margin-top: 4rem;
    opacity: 0; animation: tb-fadeUp 0.7s 0.8s forwards;
  }
  .tb-stat-val {
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    font-size: 2rem; font-weight: 700; letter-spacing: -0.02em;
  }
  .tb-stat-label { font-size: 0.8rem; color: var(--muted); margin-top: 0.2rem; letter-spacing: 0.04em; }

  /* HERO RIGHT */
  .tb-hero-right {
    background: var(--ink); position: relative;
    overflow: hidden; display: flex; align-items: center; justify-content: center;
    opacity: 0; animation: tb-fadeIn 1s 0.4s forwards;
  }
  .tb-hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0);
    background-size: 24px 24px;
  }
  .tb-ornament {
    position: absolute; bottom: -6rem; right: -6rem;
    width: 280px; height: 280px; border-radius: 50%;
    border: 1px solid rgba(148,163,184,0.15); opacity: 0.5;
  }
  .tb-ornament-2 {
    position: absolute; top: -4rem; left: -4rem;
    width: 180px; height: 180px; border-radius: 50%;
    border: 1px solid rgba(148,163,184,0.1); opacity: 0.5;
  }
  .tb-float-tag {
    position: absolute;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.5); font-size: 0.72rem;
    padding: 0.35rem 0.8rem; border-radius: 100px; white-space: nowrap;
  }
  .tb-ft1 { top: 8%; left: 5%; animation: tb-float 4s ease-in-out infinite; }
  .tb-ft2 { top: 18%; right: 4%; animation: tb-float 4s 1s ease-in-out infinite; }
  .tb-ft3 { bottom: 22%; left: 3%; animation: tb-float 4s 2s ease-in-out infinite; }
  .tb-ft4 { bottom: 10%; right: 6%; animation: tb-float 4s 0.5s ease-in-out infinite; }

  .tb-card-stack { position: relative; width: 340px; height: 420px; display: flex; align-items: center; justify-content: center; }
  .tb-job-card {
    position: absolute;
    background: #1a1917; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 1.5rem; width: 300px; color: var(--chalk);
  }
  .tb-job-card:nth-child(1) { transform: rotate(-5deg) translateY(20px); opacity: 0.45; }
  .tb-job-card:nth-child(2) { transform: rotate(2deg) translateY(8px); opacity: 0.7; z-index: 1; }
  .tb-job-card:nth-child(3) { transform: rotate(0deg); opacity: 1; z-index: 2; }
  .tb-jc-tag {
    display: inline-block;
    background: rgba(37,99,235,0.2); color: var(--gold-light);
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.08em;
    padding: 0.3rem 0.75rem; border-radius: 100px; margin-bottom: 1rem;
  }
  .tb-jc-title {
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    font-size: 1.15rem; font-weight: 700; margin-bottom: 0.4rem;
  }
  .tb-jc-company { font-size: 0.8rem; color: rgba(255,255,255,0.45); margin-bottom: 1.25rem; }
  .tb-jc-meta { display: flex; gap: 0.6rem; flex-wrap: wrap; }
  .tb-jc-badge {
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
    font-size: 0.72rem; padding: 0.3rem 0.7rem; border-radius: 4px;
    color: rgba(255,255,255,0.6);
  }
  .tb-jc-apply { margin-top: 1.25rem; display: flex; align-items: center; justify-content: space-between; }
  .tb-jc-salary { font-size: 0.85rem; color: rgba(255,255,255,0.6); }
  .tb-jc-btn {
    background: var(--accent); color: #fff;
    font-size: 0.75rem; font-weight: 500;
    padding: 0.45rem 1rem; border-radius: var(--radius); cursor: pointer;
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif; border: none;
  }

  /* MARQUEE */
  .tb-marquee { background: #e4e4e7; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 0.75rem 0; overflow: hidden; display: flex; }
  .tb-marquee-track {
    display: flex; gap: 3rem;
    animation: tb-marquee 28s linear infinite; white-space: nowrap;
  }
  .tb-marquee-item {
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    font-size: 0.78rem; font-weight: 600; font-style: normal;
    color: var(--muted); letter-spacing: 0.02em;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .tb-marquee-item::after { content: '·'; font-style: normal; font-size: 0.65rem; color: #a1a1aa; }

  /* SECTION COMMONS */
  .tb-section { padding: 6rem 4rem; }
  .tb-section-label {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .tb-section-label::before { content: ''; width: 1.5rem; height: 1px; background: #d4d4d8; }
  .tb-section-heading {
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 700;
    line-height: 1.1; letter-spacing: -0.02em; max-width: 22ch;
  }

  /* HOW */
  .tb-how {
    background: var(--cream);
    display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center;
    padding: 6rem 4rem;
  }
  .tb-steps { display: flex; flex-direction: column; margin-top: 3rem; }
  .tb-step {
    display: flex; gap: 1.5rem; align-items: flex-start;
    padding: 2rem 0; border-bottom: 1px solid var(--border);
    opacity: 0; transform: translateX(-20px);
    transition: opacity 0.5s, transform 0.5s;
  }
  .tb-step.visible { opacity: 1; transform: translateX(0); }
  .tb-step:first-child { padding-top: 0; }
  .tb-step-num {
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    font-size: 2.5rem; font-weight: 700; color: rgba(15,14,12,0.08);
    line-height: 1; min-width: 3rem; user-select: none;
  }
  .tb-step-title { font-weight: 500; margin-bottom: 0.4rem; }
  .tb-step-desc { font-size: 0.9rem; color: var(--muted); line-height: 1.6; }

  /* profile mock */
  .tb-profile-mock {
    background: var(--chalk); border: 1px solid var(--border);
    border-radius: 16px; padding: 2rem; width: 100%; max-width: 340px;
    box-shadow: 0 24px 80px rgba(15,14,12,0.1);
  }
  .tb-pm-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
  .tb-pm-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, var(--sage), var(--sage-light));
    display: flex; align-items: center; justify-content: center;
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif; font-size: 1.2rem; font-weight: 700; color: var(--chalk);
  }
  .tb-pm-name { font-weight: 500; }
  .tb-pm-role { font-size: 0.8rem; color: var(--muted); }
  .tb-pm-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
  .tb-pm-tag {
    background: var(--cream); border: 1px solid var(--border);
    font-size: 0.72rem; padding: 0.3rem 0.75rem; border-radius: 100px; color: var(--muted);
  }
  .tb-pm-progress { margin-bottom: 0.75rem; }
  .tb-pm-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--muted); margin-bottom: 0.4rem; }
  .tb-pm-bar { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .tb-pm-fill { height: 100%; background: var(--sage); border-radius: 2px; }
  .tb-pm-status {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.75rem; color: #3d5a4c; font-weight: 500;
    background: rgba(205,221,213,0.3); padding: 0.4rem 0.9rem;
    border-radius: 100px; border: 1px solid rgba(61,90,76,0.2); margin-top: 1rem;
  }
  .tb-pm-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sage); display: inline-block; }

  /* FEATURES */
  .tb-features { background: var(--ink); color: var(--chalk); padding: 6rem 4rem; }
  .tb-features .tb-section-label { color: rgba(255,255,255,0.45); }
  .tb-features .tb-section-label::before { background: rgba(255,255,255,0.2); }
  .tb-features .tb-section-heading { color: var(--chalk); }
  .tb-features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; overflow: hidden; margin-top: 4rem;
  }
  .tb-feature-card {
    background: var(--ink); padding: 2.5rem 2rem;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.5s, transform 0.5s, background 0.2s;
  }
  .tb-feature-card.visible { opacity: 1; transform: translateY(0); }
  .tb-feature-card:hover { background: #1a1917; }
  .tb-feature-icon {
    width: 44px; height: 44px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem; font-size: 1.2rem;
  }
  .tb-feature-title { font-weight: 500; margin-bottom: 0.6rem; color: var(--chalk); }
  .tb-feature-desc { font-size: 0.875rem; color: rgba(255,255,255,0.4); line-height: 1.65; }
  .tb-feature-tag {
    display: inline-block; margin-top: 1rem;
    background: rgba(37,99,235,0.15); color: var(--gold-light);
    font-size: 0.68rem; letter-spacing: 0.08em; font-weight: 500;
    padding: 0.25rem 0.7rem; border-radius: 4px;
  }

  /* DUAL CTA */
  .tb-dual-cta { display: grid; grid-template-columns: 1fr 1fr; }
  .tb-cta-panel { padding: 7rem 5rem; display: flex; flex-direction: column; justify-content: center; }
  .tb-cta-seeker { background: var(--chalk); }
  .tb-cta-recruiter { background: var(--sage); }
  .tb-cta-recruiter .tb-section-label { color: var(--sage-light); }
  .tb-cta-recruiter .tb-section-label::before { background: var(--sage-light); }
  .tb-cta-recruiter .tb-section-heading { color: var(--chalk); }
  .tb-cta-sub { font-size: 1rem; color: var(--muted); line-height: 1.7; margin: 1.25rem 0 2.5rem; max-width: 34ch; }
  .tb-cta-recruiter .tb-cta-sub { color: rgba(255,255,255,0.65); }
  .tb-cta-list { list-style: none; margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 0.65rem; }
  .tb-cta-list li { font-size: 0.875rem; color: var(--muted); display: flex; align-items: flex-start; gap: 0.75rem; }
  .tb-cta-recruiter .tb-cta-list li { color: rgba(255,255,255,0.6); }
  .tb-cta-arrow { color: var(--accent); flex-shrink: 0; }
  .tb-cta-recruiter .tb-cta-arrow { color: #93c5fd; }
  .tb-btn-sage {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--chalk); color: var(--sage);
    padding: 0.9rem 2rem; border-radius: var(--radius);
    font-size: 0.95rem; font-weight: 500; text-decoration: none; cursor: pointer;
    border: 1.5px solid var(--chalk); align-self: flex-start;
    transition: background 0.2s, transform 0.15s; font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  }
  .tb-btn-sage:hover { background: var(--sage-light); transform: translateY(-2px); }

  /* TESTIMONIALS */
  .tb-social { background: var(--cream); padding: 6rem 4rem; }
  .tb-sp-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3.5rem; }
  .tb-testimonials { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .tb-testimonial {
    background: var(--chalk); border: 1px solid var(--border);
    border-radius: 12px; padding: 2rem;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.5s, transform 0.5s;
  }
  .tb-testimonial.visible { opacity: 1; transform: translateY(0); }
  .tb-t-quote {
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    font-size: 1rem; font-style: normal; font-weight: 500; line-height: 1.6; margin-bottom: 1.5rem;
  }
  .tb-t-author { display: flex; align-items: center; gap: 0.75rem; }
  .tb-t-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 500; flex-shrink: 0;
  }
  .tb-t-name { font-size: 0.85rem; font-weight: 500; }
  .tb-t-role { font-size: 0.75rem; color: var(--muted); }

  /* FOOTER */
  .tb-footer { background: var(--ink); color: rgba(255,255,255,0.45); padding: 4rem 4rem 2rem; }
  .tb-footer-top {
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem;
    padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 2rem;
  }
  .tb-footer-brand {
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    font-size: 1.35rem; font-weight: 700; color: var(--chalk); margin-bottom: 0.75rem;
  }
  .tb-footer-brand span { color: #93c5fd; }
  .tb-footer-tagline { font-size: 0.85rem; line-height: 1.6; max-width: 28ch; }
  .tb-footer-col-title {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.6); margin-bottom: 1.25rem;
  }
  .tb-footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; }
  .tb-footer-links a { font-size: 0.85rem; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; cursor: pointer; }
  .tb-footer-links a:hover { color: rgba(255,255,255,0.8); }
  .tb-footer-bottom { display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; }

  /* KEYFRAMES */
  @keyframes tb-fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes tb-fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes tb-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes tb-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  @media (max-width: 900px) {
    .tb-nav { padding: 1rem 1.5rem; }
    .tb-nav-links { display: none; }
    .tb-hero { grid-template-columns: 1fr; }
    .tb-hero-right { display: none; }
    .tb-hero-left { padding: 7rem 1.5rem 4rem; }
    .tb-how { grid-template-columns: 1fr; padding: 4rem 1.5rem; }
    .tb-how-visual { display: none; }
    .tb-section { padding: 4rem 1.5rem; }
    .tb-features { padding: 4rem 1.5rem; }
    .tb-features-grid { grid-template-columns: 1fr; }
    .tb-dual-cta { grid-template-columns: 1fr; }
    .tb-cta-panel { padding: 4rem 1.5rem; }
    .tb-testimonials { grid-template-columns: 1fr; }
    .tb-social { padding: 4rem 1.5rem; }
    .tb-footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .tb-footer { padding: 3rem 1.5rem 2rem; }
    .tb-sp-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
  }
`;

function useIntersect(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return [ref, visible];
}

const MARQUEE_ITEMS = [
  "Job search reimagined", "Find your next role", "Hire with confidence",
  "AI-powered matching", "Verified employers", "Real-time tracking",
  "Job search reimagined", "Find your next role", "Hire with confidence",
  "AI-powered matching", "Verified employers", "Real-time tracking",
];

const STEPS = [
  { num: "01", title: "Create your profile", desc: "Build a rich profile with your resume, skills, and experience. Upload your CV in PDF or DOCX and preview it before applying." },
  { num: "02", title: "Search and filter", desc: "Find opportunities using smart keyword search — filter by role, company, location, salary range, job type, and more." },
  { num: "03", title: "Apply in seconds", desc: "Select a job, choose your CV, and submit. No redundant forms — your profile does the talking." },
  { num: "04", title: "Track your journey", desc: "Watch your application status move from submitted → under review → interview scheduled, all in one dashboard." },
];

const FEATURES = [
  { icon: "🔍", title: "Smart search & filters", desc: "Search by title, skill, industry, location, salary range, and experience level. Results that actually match what you mean.", tag: "Job seekers" },
  { icon: "📄", title: "CV upload & preview", desc: "Upload PDF or DOCX resumes, preview them before submitting, and choose the right CV for each application.", tag: "Job seekers" },
  { icon: "📍", title: "Application tracker", desc: "See exactly where your applications stand — submitted, under review, shortlisted, interview scheduled — in real time.", tag: "Job seekers" },
  { icon: "🏢", title: "Verified company profiles", desc: "Employers go through a rigorous verification process — business documents, official email domains, and manual review.", tag: "Recruiters" },
  { icon: "🤖", title: "AI candidate ranking", desc: "Our AI model scores and ranks applicants against job requirements, surfacing the strongest candidates instantly.", tag: "Recruiters" },
  { icon: "📊", title: "Recruitment analytics", desc: "Track views, applicant counts, conversion rates, response rates, and hiring timelines — all in a clear dashboard.", tag: "Recruiters" },
];

const TESTIMONIALS = [
  { quote: "I applied to seven jobs in one afternoon. The application tracker made the whole process feel manageable for the first time.", name: "Minh Le", role: "Frontend Engineer · Hired at NovaPay", initials: "ML", bg: "#e0e7ff", color: "#3730a3" },
  { quote: "The AI ranking saved our team hours of screening. We went from 120 applicants to a shortlist of 8 in under a day.", name: "Phuong Hoang", role: "Head of Talent · Vinhomes Tech", initials: "PH", bg: "#f1f5f9", color: "#475569" },
  { quote: "Seeing my application move from 'under review' to 'interview scheduled' in real time was genuinely exciting. No more guessing.", name: "Nguyen Thao", role: "Product Designer · Forma Studio", initials: "NT", bg: "#dbeafe", color: "#1d4ed8" },
];

function Step({ num, title, desc, delay }) {
  const [ref, visible] = useIntersect(delay);
  return (
    <div ref={ref} className={`tb-step${visible ? " visible" : ""}`}>
      <div className="tb-step-num">{num}</div>
      <div>
        <div className="tb-step-title">{title}</div>
        <div className="tb-step-desc">{desc}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, tag, delay }) {
  const [ref, visible] = useIntersect(delay);
  return (
    <div ref={ref} className={`tb-feature-card${visible ? " visible" : ""}`}>
      <div className="tb-feature-icon">{icon}</div>
      <div className="tb-feature-title">{title}</div>
      <div className="tb-feature-desc">{desc}</div>
      <span className="tb-feature-tag">{tag}</span>
    </div>
  );
}

function Testimonial({ quote, name, role, initials, bg, color, delay }) {
  const [ref, visible] = useIntersect(delay);
  return (
    <div ref={ref} className={`tb-testimonial${visible ? " visible" : ""}`}>
      <p className="tb-t-quote">"{quote}"</p>
      <div className="tb-t-author">
        <div className="tb-t-avatar" style={{ background: bg, color }}>{initials}</div>
        <div>
          <div className="tb-t-name">{name}</div>
          <div className="tb-t-role">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function TalentBridge() {
  return (
    <div className="tb-body">
      <style>{styles}</style>

      {/* NAV */}
      <nav className="tb-nav">
        <a className="tb-nav-logo" href="#">Talent<span>Bridge</span></a>
        <ul className="tb-nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#recruiters">For recruiters</a></li>
          <li><a href="#" className="tb-nav-cta">Get started</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="tb-hero" id="hero">
        <div className="tb-hero-left">
          <p className="tb-eyebrow">The modern job platform</p>
          <h1 className="tb-headline">
            Find work<br />that truly<br /><em>fits.</em>
          </h1>
          <p className="tb-sub">
            Precision-matched careers for ambitious professionals. Connect with companies that see beyond the résumé.
          </p>
          <div className="tb-hero-actions">
            <a href="#" className="tb-btn-primary">Browse jobs →</a>
            <a href="#how" className="tb-btn-outline">See how it works</a>
          </div>
          <div className="tb-hero-stats">
            {[["12,400+", "Active listings"], ["3,200", "Verified companies"], ["89%", "Placement rate"]].map(([v, l]) => (
              <div key={l}>
                <div className="tb-stat-val">{v}</div>
                <div className="tb-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="tb-hero-right">
          <div className="tb-hero-bg" />
          <div className="tb-ornament" />
          <div className="tb-ornament-2" />
          <span className="tb-float-tag tb-ft1">Remote · Full-time</span>
          <span className="tb-float-tag tb-ft2">AI / Machine Learning</span>
          <span className="tb-float-tag tb-ft3">Verified employer ✓</span>
          <span className="tb-float-tag tb-ft4">$120k – $160k</span>
          <div className="tb-card-stack">
            <div className="tb-job-card">
              <div className="tb-jc-tag">Design</div>
              <div className="tb-jc-title">UI Designer</div>
              <div className="tb-jc-company">Forma Studio · Ho Chi Minh City</div>
            </div>
            <div className="tb-job-card">
              <div className="tb-jc-tag">Engineering</div>
              <div className="tb-jc-title">Backend Engineer</div>
              <div className="tb-jc-company">Vinhomes Tech · Hanoi</div>
            </div>
            <div className="tb-job-card">
              <div className="tb-jc-tag">Product</div>
              <div className="tb-jc-title">Product Manager</div>
              <div className="tb-jc-company">NovaPay · Remote</div>
              <div className="tb-jc-meta">
                <span className="tb-jc-badge">Full-time</span>
                <span className="tb-jc-badge">5+ yrs</span>
                <span className="tb-jc-badge">Remote</span>
              </div>
              <div className="tb-jc-apply">
                <span className="tb-jc-salary">$90k – $120k / yr</span>
                <button className="tb-jc-btn">Apply now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="tb-marquee">
        <div className="tb-marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="tb-marquee-item">{item}</span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="tb-how" id="how">
        <div>
          <p className="tb-section-label">How it works</p>
          <h2 className="tb-section-heading">From profile to placement in four steps</h2>
          <div className="tb-steps">
            {STEPS.map((s, i) => <Step key={s.num} {...s} delay={i * 100} />)}
          </div>
        </div>
        <div className="tb-how-visual">
          <div className="tb-profile-mock">
            <div className="tb-pm-header">
              <div className="tb-pm-avatar">AT</div>
              <div>
                <div className="tb-pm-name">Anh Tran</div>
                <div className="tb-pm-role">Product Designer · Hanoi, VN</div>
              </div>
            </div>
            <div className="tb-pm-tags">
              {["Figma", "UX Research", "React", "Design Systems", "Prototyping"].map(t => (
                <span key={t} className="tb-pm-tag">{t}</span>
              ))}
            </div>
            <div className="tb-pm-progress">
              <div className="tb-pm-progress-label"><span>Profile strength</span><span>86%</span></div>
              <div className="tb-pm-bar"><div className="tb-pm-fill" style={{ width: "86%" }} /></div>
            </div>
            <div className="tb-pm-progress">
              <div className="tb-pm-progress-label"><span>Applications sent</span><span>4 active</span></div>
              <div className="tb-pm-bar"><div className="tb-pm-fill" style={{ width: "60%", background: "var(--sage)" }} /></div>
            </div>
            <div className="tb-pm-status">
              <span className="tb-pm-dot" />
              Active and visible to recruiters
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="tb-features" id="features">
        <p className="tb-section-label">Platform capabilities</p>
        <h2 className="tb-section-heading">Everything you need — nothing you don't.</h2>
        <div className="tb-features-grid">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} delay={i * 80} />)}
        </div>
      </section>

      {/* DUAL CTA */}
      <div className="tb-dual-cta" id="recruiters">
        <div className="tb-cta-panel tb-cta-seeker">
          <p className="tb-section-label">For job seekers</p>
          <h2 className="tb-section-heading" style={{ fontSize: "2.2rem" }}>Land your next great role.</h2>
          <p className="tb-cta-sub">A modern platform built for candidates who refuse to settle.</p>
          <ul className="tb-cta-list">
            {["Rich profile with CV upload and preview", "Advanced filters across thousands of listings", "Real-time application status tracking", "Saved jobs and application history", "AI-powered job recommendations (coming soon)"].map(item => (
              <li key={item}><span className="tb-cta-arrow">→</span>{item}</li>
            ))}
          </ul>
          <a href="#" className="tb-btn-primary" style={{ alignSelf: "flex-start" }}>Create free account →</a>
        </div>
        <div className="tb-cta-panel tb-cta-recruiter">
          <p className="tb-section-label">For recruiters</p>
          <h2 className="tb-section-heading" style={{ fontSize: "2.2rem", color: "var(--chalk)" }}>Hire smarter, faster.</h2>
          <p className="tb-cta-sub">Post jobs, manage applicants, and close roles with AI on your side.</p>
          <ul className="tb-cta-list">
            {["One-click job posting with rich descriptions", "Applicant filtering by experience, skills, location", "AI candidate ranking and scoring", "In-platform messaging and email notifications", "Real-time analytics on every posting"].map(item => (
              <li key={item}><span className="tb-cta-arrow">→</span>{item}</li>
            ))}
          </ul>
          <button className="tb-btn-sage">Start hiring today →</button>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section className="tb-social">
        <div className="tb-sp-header">
          <div>
            <p className="tb-section-label">What people say</p>
            <h2 className="tb-section-heading">Trusted by professionals and teams.</h2>
          </div>
        </div>
        <div className="tb-testimonials">
          {TESTIMONIALS.map((t, i) => <Testimonial key={t.name} {...t} delay={i * 120} />)}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="tb-footer">
        <div className="tb-footer-top">
          <div>
            <div className="tb-footer-brand">Talent<span>Bridge</span></div>
            <p className="tb-footer-tagline">Connecting ambitious professionals with companies that see beyond the résumé.</p>
          </div>
          {[
            { title: "Platform", links: ["Browse jobs", "Post a job", "Company profiles", "Pricing"] },
            { title: "Company", links: ["About us", "Blog", "Careers", "Press"] },
            { title: "Legal", links: ["Privacy policy", "Terms of service", "Cookie settings"] },
          ].map(col => (
            <div key={col.title}>
              <div className="tb-footer-col-title">{col.title}</div>
              <ul className="tb-footer-links">
                {col.links.map(link => <li key={link}><a href="#">{link}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="tb-footer-bottom">
          <span>© 2026 TalentBridge. All rights reserved.</span>
          <span>Made with care in Vietnam 🇻🇳</span>
        </div>
      </footer>
    </div>
  );
}