// ─────────────────────────────────────────────────────────────
//  App.jsx  ·  Root application  ·  Landing → Auth → Dashboard
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, createRef, useMemo } from "react";
import { auth, token, scheduleAccessTokenRefresh, clearAccessTokenRefreshSchedule } from "./api.js";
import { GlobalStyles, TopNav, Sidebar, Spinner, Alert, Field, EmptyState } from "./shared.jsx";
import { BrandLogo } from "./BrandLogo.jsx";
import {
  JobsBrowse, MyApplications, MyCVs, CandidateProfilePage, SavedJobs,
  RecruiterJobs, JobForm, JobApplicants, CompanyProfilePage,
} from "./pages/index.js";

// ──────────────────────────────────────────────────────────────
//  LANDING + AUTH STYLES
// ──────────────────────────────────────────────────────────────
const EXTRA_CSS = `
/* ─── Landing Page ─────────────────────────────────────── */
.lp       { font-family:var(--font-sans); background:var(--chalk); color:var(--ink); overflow-x:hidden; }
.lp-nav   { position:fixed;top:0;left:0;right:0;z-index:200;height:62px;background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border); }
.lp-nav-inner { width:100%;padding:0 3%;height:62px;display:flex;align-items:center;justify-content:space-between; }
.lp-logo.brand-logo { cursor:pointer; }
.lp-logo.brand-logo .brand-logo__wordmark { font-size:1.14rem; }
.lp-navlinks { display:flex;align-items:center;gap:2.5rem;list-style:none; }
.lp-navlinks a { font-size:0.875rem;color:var(--muted);text-decoration:none;cursor:pointer;transition:color 0.2s; }
.lp-navlinks a:hover { color:var(--ink); }
.lp-navlinks .cta { background:var(--ink);color:var(--chalk)!important;padding:0.45rem 1.1rem;border-radius:var(--r-md);font-weight:500;transition:background 0.2s!important; }
.lp-navlinks .cta:hover { background:#334155!important; }

/* Hero */
.lp-hero { min-height:100vh;display:grid;grid-template-columns:1fr 1fr;padding-top:62px;overflow:hidden;max-width:100%; }
.lp-hero-left  { display:flex;flex-direction:column;justify-content:center;padding:5.5rem 4% 5.5rem 5%;background:var(--chalk); }
.lp-hero-right { background:#0f172a;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center; }
.lp-hero-grid  { position:absolute;inset:0;background:radial-gradient(circle at 1px 1px,rgba(255,255,255,0.06) 1px,transparent 0);background-size:24px 24px;opacity:0.9; }
.lp-orb { position:absolute;border-radius:50%; }

.lp-eyebrow { display:inline-flex;align-items:center;gap:0.6rem;font-size:0.7rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:1.5rem;opacity:0;animation:lp-up 0.7s 0.1s both; }
.lp-eyebrow::before { content:'';width:1.5rem;height:1px;background:var(--border-md); }
.lp-h1    { font-size:clamp(2.25rem,4.5vw,3.5rem);font-weight:600;line-height:1.08;letter-spacing:-0.035em;margin-bottom:1.25rem;color:var(--ink);opacity:0;animation:lp-up 0.7s 0.25s both; }
.lp-h1 em { font-style:normal;color:var(--accent);font-weight:600; }
.lp-sub   { font-size:1.05rem;font-weight:400;color:var(--muted);line-height:1.7;max-width:38ch;margin-bottom:2.5rem;opacity:0;animation:lp-up 0.7s 0.4s both; }
.lp-btns  { display:flex;gap:0.85rem;flex-wrap:wrap;opacity:0;animation:lp-up 0.7s 0.55s both; }
.lp-stats { display:flex;gap:2.75rem;margin-top:3.5rem;opacity:0;animation:lp-up 0.7s 0.7s both; }
.lp-stat-val   { font-size:1.65rem;font-weight:700;color:var(--ink);letter-spacing:-0.02em; }
.lp-stat-label { font-size:0.78rem;color:var(--muted);margin-top:0.15rem; }

/* Card stack */
.lp-stack { position:relative;width:310px;height:380px;display:flex;align-items:center;justify-content:center;opacity:0;animation:lp-in 0.9s 0.35s both; }
.lp-jcard { position:absolute;background:#1e293b;border:1px solid rgba(255,255,255,0.08);border-radius:var(--r-lg);padding:1.35rem;width:284px;color:var(--chalk); }
.lp-jcard:nth-child(1){ transform:rotate(-5deg) translateY(18px);opacity:0.38; }
.lp-jcard:nth-child(2){ transform:rotate(2deg)  translateY(8px); opacity:0.65;z-index:1; }
.lp-jcard:nth-child(3){ z-index:2; }
.lp-jc-pill { display:inline-block;background:rgba(37,99,235,0.2);color:#93c5fd;font-size:0.67rem;font-weight:600;letter-spacing:0.04em;padding:0.22rem 0.65rem;border-radius:var(--r-sm);margin-bottom:0.85rem; }
.lp-jc-title { font-size:1rem;font-weight:600;margin-bottom:0.25rem; }
.lp-jc-co    { font-size:0.77rem;color:rgba(255,255,255,0.45);margin-bottom:1rem; }
.lp-jc-tags  { display:flex;gap:0.45rem;flex-wrap:wrap;margin-bottom:1rem; }
.lp-jc-tag   { background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);font-size:0.68rem;padding:0.22rem 0.6rem;border-radius:var(--r-sm);color:rgba(255,255,255,0.55); }
.lp-jc-foot  { display:flex;align-items:center;justify-content:space-between; }
.lp-jc-sal   { font-size:0.8rem;color:rgba(255,255,255,0.5); }
.lp-jc-btn   { background:var(--accent);color:#fff;font-size:0.7rem;font-weight:500;padding:0.38rem 0.85rem;border-radius:var(--r-sm);border:none;cursor:pointer; }
.lp-floater  { position:absolute;background:rgba(255,255,255,0.055);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.42);font-size:0.68rem;padding:0.28rem 0.7rem;border-radius:100px;white-space:nowrap; }
.lp-f1{top:9%;left:5%;animation:lp-float 4s ease-in-out infinite;}
.lp-f2{top:21%;right:4%;animation:lp-float 4s 1s ease-in-out infinite;}
.lp-f3{bottom:22%;left:4%;animation:lp-float 4s 2s ease-in-out infinite;}
.lp-f4{bottom:11%;right:5%;animation:lp-float 4s 0.5s ease-in-out infinite;}

/* Marquee */
.lp-marquee { background:var(--cream-dark);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:0.75rem 0;overflow:hidden;display:flex; }
.lp-mtrack  { display:flex;gap:3rem;animation:lp-marquee 28s linear infinite;white-space:nowrap; }
.lp-mitem   { font-size:0.78rem;font-weight:600;font-style:normal;color:var(--muted);display:flex;align-items:center;gap:0.75rem; }
.lp-mitem::after { content:'·';font-style:normal;font-size:0.65rem;color:var(--border-md); }

/* Section */
.lp-section { padding:4.5rem 3%; }
.lp-container { width:100%; }
.lp-slabel  { font-size:0.67rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:0.75rem;margin-bottom:0.9rem; }
.lp-slabel::before { content:'';width:1.5rem;height:1px;background:var(--border-md); }
.lp-sh { font-size:clamp(1.5rem,2.8vw,2.25rem);font-weight:700;line-height:1.15;letter-spacing:-0.02em;max-width:28ch;color:var(--ink); }

/* How it works */
.lp-how { background:var(--cream);padding:4.5rem 3%; }
.lp-how-inner { display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;width:100%; }
.lp-steps-list { display:flex;flex-direction:column;margin-top:2.25rem; }
.lp-step      { display:flex;gap:1.25rem;padding:1.75rem 0;border-bottom:1px solid var(--border); }
.lp-step:first-child { padding-top:0; }
.lp-step:last-child  { border-bottom:none; }
.lp-step-n    { font-size:1.75rem;font-weight:700;color:var(--ink-20);line-height:1;min-width:2.75rem; }
.lp-step-t    { font-weight:600;margin-bottom:0.3rem;color:var(--ink); }
.lp-step-d    { font-size:0.875rem;color:var(--muted);line-height:1.65; }
/* Profile mock */
.lp-pm { background:var(--chalk);border:1px solid var(--border);border-radius:var(--r-lg);padding:1.85rem;max-width:330px;box-shadow:var(--shadow); }
.lp-pm-head { display:flex;align-items:center;gap:0.9rem;margin-bottom:1.35rem; }
.lp-pm-av   { width:50px;height:50px;border-radius:50%;background:var(--accent-soft);border:1px solid var(--accent-muted);display:flex;align-items:center;justify-content:center;font-size:0.95rem;font-weight:700;color:var(--accent); }
.lp-pm-name { font-weight:600;font-size:0.9rem; }
.lp-pm-role { font-size:0.75rem;color:var(--muted); }
.lp-pm-tags { display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.25rem; }
.lp-pm-tag  { background:var(--cream);border:1px solid var(--border);font-size:0.7rem;padding:0.25rem 0.65rem;border-radius:var(--r-sm);color:var(--muted); }
.lp-pm-bar-wrap { margin-bottom:0.75rem; }
.lp-pm-bar-row  { display:flex;justify-content:space-between;font-size:0.72rem;color:var(--muted);margin-bottom:0.35rem; }
.lp-pm-bar  { height:4px;background:var(--border);border-radius:2px;overflow:hidden; }
.lp-pm-fill { height:100%;border-radius:2px;background:var(--accent); }
.lp-pm-dot  { width:6px;height:6px;border-radius:50%;background:var(--accent);display:inline-block;margin-right:0.4rem; }
.lp-pm-status { display:inline-flex;align-items:center;font-size:0.72rem;color:var(--accent);font-weight:500;background:var(--accent-soft);padding:0.35rem 0.85rem;border-radius:var(--r-sm);border:1px solid var(--accent-muted);margin-top:1rem; }

/* Features */
.lp-features { background:#0f172a;color:var(--chalk); }
.lp-features .lp-slabel { color:rgba(255,255,255,0.45); }
.lp-features .lp-slabel::before { background:rgba(255,255,255,0.2); }
.lp-features .lp-sh { color:var(--chalk); }
.lp-feat-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:var(--r-lg);overflow:hidden;margin-top:3.5rem; }
.lp-feat-card { background:#0f172a;padding:2.25rem 1.75rem;transition:background 0.2s; }
.lp-feat-card:hover { background:#1e293b; }
.lp-feat-icon  { width:42px;height:42px;border-radius:var(--r-md);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem;font-size:1.15rem;background:rgba(255,255,255,0.04); }
.lp-feat-title { font-weight:600;color:var(--chalk);margin-bottom:0.5rem; }
.lp-feat-desc  { font-size:0.85rem;color:rgba(255,255,255,0.55);line-height:1.65; }
.lp-feat-tag   { display:inline-block;margin-top:0.85rem;background:rgba(37,99,235,0.15);color:#93c5fd;font-size:0.64rem;letter-spacing:0.04em;font-weight:600;padding:0.2rem 0.6rem;border-radius:var(--r-sm); }

/* Dual CTA */
.lp-cta { display:grid;grid-template-columns:1fr 1fr; }
.lp-cta-panel { padding:4.5rem 5%;display:flex;flex-direction:column; }
.lp-cta-seeker    { background:var(--chalk); }
.lp-cta-recruiter { background:#1e293b; }
.lp-cta-recruiter .lp-slabel       { color:rgba(255,255,255,0.5); }
.lp-cta-recruiter .lp-slabel::before { background:rgba(255,255,255,0.25); }
.lp-cta-recruiter .lp-sh           { color:var(--chalk); }
.lp-cta-body { font-size:0.95rem;line-height:1.7;color:var(--muted);margin:1rem 0 2rem;max-width:34ch; }
.lp-cta-recruiter .lp-cta-body { color:rgba(255,255,255,0.7); }
.lp-cta-list { list-style:none;display:flex;flex-direction:column;gap:0.6rem;margin-bottom:2rem; }
.lp-cta-list li { font-size:0.85rem;color:var(--muted);display:flex;gap:0.65rem;align-items:flex-start; }
.lp-cta-recruiter .lp-cta-list li { color:rgba(255,255,255,0.7); }
.lp-arr { color:var(--accent);flex-shrink:0; }
.lp-cta-recruiter .lp-arr { color:#93c5fd; }

/* Testimonials */
.lp-social { background:var(--cream); }
.lp-tgrid  { display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;margin-top:3rem; }
.lp-tcard  { background:var(--chalk);border:1px solid var(--border);border-radius:14px;padding:1.75rem; }
.lp-tq     { font-size:0.95rem;font-style:normal;line-height:1.65;margin-bottom:1.25rem;color:var(--ink);font-weight:500; }
.lp-tauthor{ display:flex;align-items:center;gap:0.65rem; }
.lp-tav    { width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:500;flex-shrink:0; }
.lp-tname  { font-size:0.82rem;font-weight:600;color:var(--ink); }
.lp-trole  { font-size:0.72rem;color:var(--muted); }

/* Footer */
.lp-footer { background:#0f172a;color:rgba(255,255,255,0.45);padding:3.5rem 3% 2rem; }
.lp-fgrid  { display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2.5rem;padding-bottom:2.5rem;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:1.75rem; }
.lp-fbrand.brand-logo { margin-bottom:0.65rem; }
.lp-fbrand.brand-logo .brand-logo__wordmark { font-size:1.05rem; }
.lp-ftagline { font-size:0.82rem;line-height:1.65;max-width:28ch;color:rgba(255,255,255,0.55); }
.lp-fhead   { font-size:0.67rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:1rem; }
.lp-flinks  { list-style:none;display:flex;flex-direction:column;gap:0.55rem; }
.lp-flinks a { font-size:0.82rem;color:rgba(255,255,255,0.3);text-decoration:none;cursor:pointer;transition:color 0.2s; }
.lp-flinks a:hover { color:rgba(255,255,255,0.75); }
.lp-fbot { display:flex;justify-content:space-between;font-size:0.75rem; }

/* ─── Auth Page ───────────────────────────────────────── */
.auth-root  { min-height:100vh;display:grid;grid-template-columns:1fr 1fr; }
.auth-panel { background:#0f172a;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:3rem; }
.auth-panel-bg { position:absolute;inset:0;background:radial-gradient(circle at 1px 1px,rgba(255,255,255,0.05) 1px,transparent 0);background-size:20px 20px;opacity:0.85; }
.auth-logo.brand-logo { position:relative;z-index:1;cursor:pointer; }
.auth-logo.brand-logo .brand-logo__wordmark { font-size:1.12rem; }
.auth-panel-copy { position:relative;z-index:1; }
.auth-panel-ey { font-size:0.67rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:1rem;display:flex;align-items:center;gap:0.75rem; }
.auth-panel-ey::before { content:'';width:1.5rem;height:1px;background:rgba(255,255,255,0.25); }
.auth-panel-h  { font-size:2rem;font-weight:600;line-height:1.12;color:var(--chalk);margin-bottom:1rem; }
.auth-panel-h em { font-style:normal;color:#93c5fd;font-weight:600; }
.auth-panel-sub { font-size:0.9rem;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.7;max-width:32ch; }
.auth-panel-stats { display:flex;gap:2.25rem;position:relative;z-index:1;padding-top:1.75rem;border-top:1px solid rgba(255,255,255,0.08); }
.auth-stat-val   { font-size:1.35rem;font-weight:600;color:var(--chalk);letter-spacing:-0.02em; }
.auth-stat-label { font-size:0.7rem;color:rgba(255,255,255,0.4);margin-top:0.15rem; }

.auth-form-side { display:flex;align-items:center;justify-content:center;padding:2rem;overflow-y:auto;background:var(--cream); }
.auth-wrap { width:100%;max-width:420px; }
.auth-screen { animation:pageIn 0.32s cubic-bezier(0.22,1,0.36,1) both; }
.auth-title { font-size:1.65rem;font-weight:600;letter-spacing:-0.03em;margin-bottom:0.4rem; }
.auth-sub   { font-size:0.875rem;color:var(--muted);margin-bottom:1.75rem; }
.auth-sub .link { color:var(--accent);font-weight:500;text-decoration:underline;text-decoration-color:rgba(37,99,235,0.35);cursor:pointer; }

.oauth-group { display:flex;flex-direction:column;gap:0.6rem;margin-bottom:1.25rem; }
.oauth-btn   { display:flex;align-items:center;justify-content:center;gap:0.7rem;padding:0.7rem 1rem;border-radius:var(--r-md);border:1.5px solid var(--border);background:transparent;cursor:pointer;font-size:0.875rem;color:var(--ink);transition:border-color 0.2s,background 0.2s; }
.oauth-btn:hover { border-color:var(--border-md);background:var(--cream); }

.role-grid  { display:grid;grid-template-columns:1fr 1fr;gap:0.65rem;margin-bottom:1.5rem; }
.role-card  { border:1.5px solid var(--border);border-radius:var(--r-lg);padding:1rem;cursor:pointer;text-align:center;transition:border-color 0.2s,background 0.2s;background:transparent; }
.role-card:hover  { border-color:var(--accent); }
.role-card.active { border-color:var(--accent);background:var(--accent-soft); }
.role-em   { font-size:1.4rem;margin-bottom:0.35rem;display:block; }
.role-name { font-size:0.82rem;font-weight:500; }
.role-hint { font-size:0.7rem;color:var(--muted);margin-top:0.15rem; }

.pw-bars  { display:flex;gap:4px;margin-top:0.4rem;margin-bottom:0.25rem; }
.pw-bar   { flex:1;height:3px;border-radius:2px;background:var(--border);transition:background 0.3s; }
.pw-bar.s1{background:#e74c3c;}.pw-bar.s2{background:#f39c12;}.pw-bar.s3{background:#2ecc71;}.pw-bar.s4{background:var(--sage);}
.pw-label { font-size:0.7rem;color:var(--muted); }

.forgot-link { font-size:0.76rem;color:var(--muted);background:none;border:none;cursor:pointer;text-decoration:underline;text-decoration-color:transparent;transition:color 0.2s;padding:0; }
.forgot-link:hover { color:var(--ink);text-decoration-color:var(--accent); }

.auth-submit { width:100%;padding:0.85rem;background:var(--ink);color:var(--chalk);border:none;border-radius:var(--r-md);font-size:0.9rem;font-weight:500;cursor:pointer;transition:background 0.2s,transform 0.15s;display:flex;align-items:center;justify-content:center;gap:0.5rem; }
.auth-submit:hover:not(:disabled) { background:#334155; }
.auth-submit:disabled { opacity:0.45;cursor:not-allowed; }

.otp-row  { display:flex;gap:0.55rem;justify-content:center;margin:1.5rem 0; }
.otp-box  { width:50px;height:56px;text-align:center;font-size:1.2rem;font-weight:600;border:1.5px solid var(--border);border-radius:var(--r-md);background:var(--chalk);color:var(--ink);outline:none;transition:border-color 0.2s,box-shadow 0.2s; }
.otp-box:focus  { border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-muted); }
.otp-box.filled { border-color:var(--accent);background:var(--accent-soft); }
.otp-timer { text-align:center;font-size:0.8rem;color:var(--muted);margin-bottom:1.25rem; }
.otp-timer button { background:none;border:none;font-weight:500;color:var(--accent);cursor:pointer;text-decoration:underline;text-decoration-color:rgba(37,99,235,0.35);font-size:0.8rem; }
.otp-timer button:disabled { color:var(--muted);text-decoration:none;cursor:default; }

.step-dots  { display:flex;gap:0.4rem;margin-bottom:1.75rem; }
.step-dot   { width:7px;height:7px;border-radius:50%;background:var(--border);transition:all 0.3s; }
.step-dot.active { background:var(--accent);width:22px;border-radius:4px; }
.step-dot.done   { background:var(--sage); }

.auth-success-wrap { text-align:center;padding:1rem 0; }
.auth-success-icon { width:60px;height:60px;border-radius:50%;background:var(--accent-soft);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin:0 auto 1.25rem;color:var(--accent); }

/* Keyframes */
@keyframes lp-up      { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
@keyframes lp-in      { from{opacity:0;}to{opacity:1;} }
@keyframes lp-float   { 0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);} }
@keyframes lp-marquee { from{transform:translateX(0);}to{transform:translateX(-50%);} }

/* Responsive */
@media(max-width:960px){
  .lp-nav-inner { padding:0 1rem; }
  .lp-navlinks { display:none; }
  .lp-hero { grid-template-columns:1fr; }
  .lp-hero-right { display:none; }
  .lp-hero-left { padding:6.5rem 1rem 3rem!important; }
  .lp-section { padding:3rem 1rem; }
  .lp-how-inner { grid-template-columns:1fr; }
  .lp-pm  { display:none; }
  .lp-feat-grid { grid-template-columns:1fr; }
  .lp-cta { grid-template-columns:1fr; }
  .lp-cta-panel { padding:3rem 1rem!important; }
  .lp-tgrid { grid-template-columns:1fr; }
  .lp-fgrid { grid-template-columns:1fr 1fr; }
  .lp-footer { padding:2.5rem 1rem 1.5rem; }
  .auth-root  { grid-template-columns:1fr; }
  .auth-panel { display:none; }
  .auth-form-side { padding:2.5rem 1.25rem;align-items:flex-start; }
}
`;

// ──────────────────────────────────────────────────────────────
//  LANDING DATA
// ──────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "Roles across Vietnam and beyond",
  "Find your next move",
  "Hire with a clear process",
  "Filters that stay out of your way",
  "Verified employer accounts",
  "Status updates on every application",
].flatMap((x) => [x, x]);

const STEPS = [
  { n: "01", t: "Create your profile", d: "Build a rich profile with your resume, skills, and experience. Upload your CV in PDF or DOCX." },
  { n: "02", t: "Search and filter",   d: "Smart keyword search — filter by role, location, salary range, type, and experience level." },
  { n: "03", t: "Apply in seconds",    d: "Select a job, choose your CV, and submit. No redundant forms — your profile does the talking." },
  { n: "04", t: "Track your journey",  d: "Watch your application status move in real time: submitted → shortlisted → interview scheduled." },
];

const FEATURES = [
  { i:"🔍", t:"Smart search & filters", d:"Search by title, skill, location, salary range, and experience level.", tag:"Seekers" },
  { i:"📄", t:"CV upload & preview",    d:"Upload PDF or DOCX. Preview before submitting. Choose a different CV per application.", tag:"Seekers" },
  { i:"📍", t:"Application tracker",    d:"See exactly where every application stands — from submitted to interview scheduled.", tag:"Seekers" },
  { i:"🏢", t:"Verified companies",     d:"Employers go through document verification and manual admin review before posting.", tag:"Recruiters" },
  { i:"📑", t:"Applicant shortlists",   d:"Compare candidates against role requirements in one view—notes and status in the same place.", tag:"Recruiters" },
  { i:"📊", t:"Recruitment analytics",  d:"Track views, applicant counts, conversion rates, and time-to-hire metrics.", tag:"Recruiters" },
];

const TESTIMONIALS = [
  { q: "I applied to seven jobs in one afternoon. The tracker made the whole process feel manageable for the first time.", n: "Minh Le",     r: "Frontend Engineer · Hired at NovaPay",    i: "ML", bg: "#e0e7ff", c: "#3730a3" },
  { q: "We cut review time sharply. One hundred twenty applicants down to a shortlist of eight took less than a day.", n: "Phuong Hoang", r: "Head of Talent · Vinhomes Tech",           i: "PH", bg: "#f1f5f9", c: "#475569" },
  { q: "Seeing my application move to 'interview scheduled' in real time was genuinely exciting. No more guessing.",      n: "Nguyen Thao",  r: "Product Designer · Forma Studio",          i: "NT", bg: "#dbeafe", c: "#1d4ed8" },
];

// ──────────────────────────────────────────────────────────────
//  OAUTH ICONS
// ──────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0077B5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// ──────────────────────────────────────────────────────────────
//  PASSWORD STRENGTH
// ──────────────────────────────────────────────────────────────
function PwStrength({ pw }) {
  if (!pw) return null;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const label = ["Weak", "Fair", "Good", "Strong", "Strong"][s];
  const barScore = s === 0 ? 1 : s;
  return (
    <div>
      <div className="pw-bars">
        {[1, 2, 3, 4].map((i) => <div key={i} className={`pw-bar${i <= barScore ? ` s${barScore}` : ""}`} />)}
      </div>
      <span className="pw-label">{label} password</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
//  OTP INPUT
// ──────────────────────────────────────────────────────────────
function OTPInput({ value, onChange }) {
  const inputRefs = useMemo(() => Array.from({ length: 6 }, () => createRef()), []);
  const chars = (value + "      ").slice(0, 6).split("");

  function handleChange(i, e) {
    const v = e.target.value.replace(/\D/g, "").slice(-1);
    const next = chars.map((c, idx) => (idx === i ? v : c)).join("").trimEnd();
    onChange(next);
    if (v && i < 5) inputRefs[i + 1].current?.focus();
  }
  function handleKey(i, e) {
    if (e.key === "Backspace" && !chars[i]?.trim() && i > 0) inputRefs[i - 1].current?.focus();
  }
  function handlePaste(e) {
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(p);
    inputRefs[Math.min(p.length, 5)].current?.focus();
    e.preventDefault();
  }

  return (
    <div className="otp-row">
      {inputRefs.map((ref, i) => (
        <input
          key={i} ref={ref}
          className={`otp-box${chars[i]?.trim() ? " filled" : ""}`}
          maxLength={1}
          value={chars[i]?.trim() || ""}
          inputMode="numeric"
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
//  LANDING PAGE
// ──────────────────────────────────────────────────────────────
function LandingPage({ navigate }) {
  return (
    <div className="lp page-enter">
      {/* Nav */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
        <BrandLogo className="lp-logo" variant="dark" onClick={() => navigate("landing")} />
        <ul className="lp-navlinks">
          <li><a href="#how">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#recruiters">For recruiters</a></li>
          <li><a className="cta" onClick={() => navigate("register")}>Get started</a></li>
        </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-left">
          <p className="lp-eyebrow">Job seekers · Employers</p>
          <h1 className="lp-h1">Find work<br />that actually<br /><em>fits.</em></h1>
          <p className="lp-sub">Search roles, track applications, and work with teams that verify their company profile before they post. Fewer surprises, clearer next steps.</p>
          <div className="lp-btns">
            <button className="btn btn-primary btn-lg" onClick={() => navigate("register")}>Browse jobs →</button>
            <a href="#how" className="btn btn-secondary btn-lg">See how it works</a>
          </div>
          <div className="lp-stats">
            {[["12,400+", "Active listings"], ["3,200", "Verified companies"], ["89%", "Placement rate"]].map(([v, l]) => (
              <div key={l}><div className="lp-stat-val">{v}</div><div className="lp-stat-label">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="lp-hero-right">
          <div className="lp-hero-grid" />
          <div className="lp-orb" style={{ bottom: "-7rem", right: "-7rem", width: 300, height: 300, border: "1px solid rgba(148,163,184,0.15)" }} />
          <div className="lp-orb" style={{ top: "-4rem", left: "-4rem", width: 180, height: 180, border: "1px solid rgba(148,163,184,0.1)" }} />
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
                <button className="lp-jc-btn" onClick={() => navigate("login")}>Apply now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="lp-marquee">
        <div className="lp-mtrack">
          {MARQUEE_ITEMS.map((m, i) => <span key={i} className="lp-mitem">{m}</span>)}
        </div>
      </div>

      {/* How it works */}
      <section className="lp-section lp-how" id="how">
        <div className="lp-container"><div className="lp-how-inner">
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
              <div><div className="lp-pm-name">Anh Tran</div><div className="lp-pm-role">Product Designer · Hanoi</div></div>
            </div>
            <div className="lp-pm-tags">
              {["Figma", "UX Research", "React", "Design Systems", "Prototyping"].map((t) => (
                <span key={t} className="lp-pm-tag">{t}</span>
              ))}
            </div>
            {[["Profile strength", "86%", 86, "var(--accent)"], ["Applications sent", "4 active", 60, "var(--sage)"]].map(([l, v, w, c]) => (
              <div key={l} className="lp-pm-bar-wrap">
                <div className="lp-pm-bar-row"><span>{l}</span><span>{v}</span></div>
                <div className="lp-pm-bar"><div className="lp-pm-fill" style={{ width: `${w}%`, background: c }} /></div>
              </div>
            ))}
            <div className="lp-pm-status"><span className="lp-pm-dot" />Active and visible to recruiters</div>
          </div>
        </div>
        </div></div>
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
            {["Rich profile with CV upload and preview", "Filters for role, location, salary, and type", "Application status you can follow end to end", "Saved jobs synced to your account", "Email alerts for new matches (coming soon)"].map((item) => (
              <li key={item}><span className="lp-arr">→</span>{item}</li>
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
            {["One-click job posting with rich descriptions", "Applicant filtering by experience, skills, location", "AI candidate ranking and scoring", "In-platform status management and notifications", "Real-time analytics on every posting"].map((item) => (
              <li key={item}><span className="lp-arr">→</span>{item}</li>
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
                <div className="lp-tav" style={{ background: t.bg, color: t.c }}>{t.i}</div>
                <div><div className="lp-tname">{t.n}</div><div className="lp-trole">{t.r}</div></div>
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
            { h: "Company",  links: ["About us", "Blog", "Careers", "Press"] },
            { h: "Legal",    links: ["Privacy policy", "Terms of service", "Cookie settings"] },
          ].map((col) => (
            <div key={col.h}>
              <div className="lp-fhead">{col.h}</div>
              <ul className="lp-flinks">{col.links.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="lp-fbot">
          <span>© 2026 TalentBridge. All rights reserved.</span>
          <span>Made with care in Vietnam 🇻🇳</span>
        </div>
        </div>
      </footer>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
//  AUTH PAGE
// ──────────────────────────────────────────────────────────────
const AUTH_PANEL_COPY = {
  login:    { ey: "Welcome back",        h: <>Your next chapter<br />starts <em>here.</em></>,         s: "Sign in to access thousands of opportunities." },
  register: { ey: "Join TalentBridge",   h: <>Find work that truly <em>fits.</em></>,                  s: "Create your account and connect with verified employers." },
  otp:      { ey: "One last step",       h: <>Verify your <em>identity.</em></>,                       s: "We sent a 6-digit code to your email." },
  forgot:   { ey: "Password reset",      h: <>Let's get you back <em>in.</em></>,                     s: "Enter the email linked to your account." },
  reset:    { ey: "New password",        h: <>Almost <em>there.</em></>,                               s: "Create a strong new password for your account." },
  done:     { ey: "You're in!",          h: <>Welcome to <em>TalentBridge.</em></>,                    s: "Your account is ready." },
};

function AuthPage({ initialScreen, navigate, onLogin }) {
  const [screen,   setScreen]   = useState(initialScreen || "login");
  const [role,     setRole]     = useState("job_seeker");
  const [regStep,  setRegStep]  = useState(1);
  const [showPw,   setShowPw]   = useState(false);
  const [showCo,   setShowCo]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [otp,      setOtp]      = useState("");
  const [timer,    setTimer]    = useState(59);
  const [alertMsg, setAlertMsg] = useState("");
  const [form, setFormState]    = useState({
    firstName: "", lastName: "", email: "", password: "", confirm: "", phone: "", agree: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (screen !== "otp") return undefined;
    /* Reset countdown when entering OTP screen */
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset when screen becomes otp
    setTimer(59);
    const t = setInterval(() => setTimer((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [screen]);

  const setF = (k, v) => {
    setFormState((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
    setAlertMsg("");
  };

  function validate(fields) {
    const e = {};
    if (fields.includes("email")     && !/\S+@\S+\.\S+/.test(form.email))    e.email = "Enter a valid email address.";
    if (fields.includes("password")  && form.password.length < 8)             e.password = "Password must be at least 8 characters.";
    if (fields.includes("confirm")   && form.password !== form.confirm)       e.confirm = "Passwords do not match.";
    if (fields.includes("firstName") && !form.firstName.trim())               e.firstName = "This field is required.";
    if (fields.includes("agree")     && !form.agree)                          e.agree = "You must agree to the terms.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function fake(cb, ms = 1300) { setLoading(true); setTimeout(() => { setLoading(false); cb(); }, ms); }

  async function handleLogin() {
    if (!validate(["email", "password"])) return;
    setLoading(true);
    try {
      const data = await auth.login(form.email, form.password);
      console.log("[handleLogin] BE response:", data);
      token.set(data.access_token, data.refresh_token);
      const userData = { email: data.email || form.email, role: data.role || "job_seeker" };
      console.log("[handleLogin] calling onLogin with:", userData);
      onLogin(userData);
    } catch (e) {
      setLoading(false);
      setAlertMsg(e.message || "Login failed. Please check your credentials.");
      // OTP flow commented out:
      // setScreen("otp");
    }
  }

  async function handleRegister() {
    if (regStep === 1) { setRegStep(2); return; }
    if (!validate(["email", "password", "confirm", "agree"])) return;
    setLoading(true);
    try {
      // Step 1: register — BE returns { email, role }
      const registered = await auth.register(form.email, form.password, role);
      // Step 2: auto-login to get tokens — BE returns { access_token, refresh_token }
      const loginData = await auth.login(form.email, form.password);
      token.set(loginData.access_token, loginData.refresh_token);
      setLoading(false);
      onLogin({ email: registered.email || form.email, role: registered.role || role });
    } catch (e) {
      setLoading(false);
      setAlertMsg(e.message || "Registration failed. Please try again.");
    }
  }

  function handleOTP() {
    if (otp.length < 6) { setAlertMsg("Enter the 6-digit code."); return; }
    fake(() => onLogin({ email: form.email, role }));
  }

  function toScreen(s) {
    setShowPw(false);
    setShowCo(false);
    setScreen(s);
  }

  function handleForgot() {
    if (!validate(["email"])) return;
    fake(() => toScreen("reset"));
  }

  function handleReset() {
    if (!validate(["password", "confirm"])) return;
    fake(() => toScreen("done"));
  }

  function goTo(s) {
    setAlertMsg("");
    setErrors({});
    setOtp("");
    setRegStep(1);
    setFormState((p) => ({ ...p, password: "", confirm: "" }));
    toScreen(s);
  }

  const copy = AUTH_PANEL_COPY[screen] || AUTH_PANEL_COPY.login;

  // Shared inline toggle button
  const pwToggle = (show, set) => (
    <button
      type="button"
      style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "var(--text-sm)", color: "var(--muted)", fontFamily: "var(--font-sans)", padding: "0.2rem" }}
      onClick={() => set((p) => !p)}
    >
      {show ? "Hide" : "Show"}
    </button>
  );

  return (
    <div className="auth-root page-enter">
      {/* Left panel */}
      <div className="auth-panel">
        <div className="auth-panel-bg" />
        <div className="lp-orb" style={{ bottom: "-8rem", right: "-8rem", width: 320, height: 320, border: "1px solid rgba(148,163,184,0.12)" }} />
        <div className="lp-orb" style={{ top: "-5rem",  left:  "-5rem",  width: 200, height: 200, border: "1px solid rgba(148,163,184,0.08)" }} />
        <BrandLogo className="auth-logo" variant="inverse" onClick={() => navigate("landing")} />
        <div className="auth-panel-copy">
          <p className="auth-panel-ey">{copy.ey}</p>
          <h2 className="auth-panel-h">{copy.h}</h2>
          <p className="auth-panel-sub">{copy.s}</p>
        </div>
        <div className="auth-panel-stats">
          {[["12,400+", "Active listings"], ["3,200", "Verified employers"], ["89%", "Placement rate"]].map(([v, l]) => (
            <div key={l}><div className="auth-stat-val">{v}</div><div className="auth-stat-label">{l}</div></div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="auth-form-side">
        <div className="auth-wrap">

          {/* ── Login ── */}
          {screen === "login" && (
            <div className="auth-screen" key="login">
              <div className="auth-title">Sign in</div>
              <p className="auth-sub">New here? <span className="link" onClick={() => goTo("register")}>Create an account</span></p>
              <div className="oauth-group">
                <button className="oauth-btn"><GoogleIcon /> Continue with Google</button>
                <button className="oauth-btn"><LinkedInIcon /> Continue with LinkedIn</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.25rem 0", color: "var(--muted)", fontSize: "var(--text-xs)" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>or email</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>
              {alertMsg && <Alert type="danger">{alertMsg}</Alert>}
              <Field label="Email address" error={errors.email}>
                <input className={`field-input${errors.email ? " err" : ""}`} type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setF("email", e.target.value)} />
              </Field>
              <Field label="Password" error={errors.password}>
                <div style={{ position: "relative" }}>
                  <input className={`field-input has-right${errors.password ? " err" : ""}`} type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => setF("password", e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
                  {pwToggle(showPw, setShowPw)}
                </div>
              </Field>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-0.5rem", marginBottom: "1rem" }}>
                <button className="forgot-link" onClick={() => goTo("forgot")}>Forgot password?</button>
              </div>
              <button className="auth-submit" onClick={handleLogin} disabled={loading}>
                {loading ? <><Spinner size="sm" white />Signing in…</> : "Sign in →"}
              </button>
            </div>
          )}

          {/* ── Register ── */}
          {screen === "register" && (
            <div className="auth-screen" key={`reg-${regStep}`}>
              <div className="step-dots">
                {[1, 2].map((s) => <div key={s} className={`step-dot${regStep === s ? " active" : regStep > s ? " done" : ""}`} />)}
              </div>

              {regStep === 1 && (
                <>
                  <div className="auth-title">Create account</div>
                  <p className="auth-sub">Have one? <span className="link" onClick={() => goTo("login")}>Sign in</span></p>
                  <div className="oauth-group">
                    <button className="oauth-btn"><GoogleIcon /> Continue with Google</button>
                    <button className="oauth-btn"><LinkedInIcon /> Continue with LinkedIn</button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.25rem 0", color: "var(--muted)", fontSize: "var(--text-xs)" }}>
                    <div style={{ flex: 1, height: 1, background: "var(--border)" }} /><span style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>or email</span><div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  </div>
                  <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginBottom: "0.65rem" }}>I am a…</p>
                  <div className="role-grid">
                    <button className={`role-card${role === "job_seeker" ? " active" : ""}`} onClick={() => setRole("job_seeker")}>
                      <span className="role-em">🧑‍💻</span><div className="role-name">Job Seeker</div><div className="role-hint">Find my next role</div>
                    </button>
                    <button className={`role-card${role === "recruiter" ? " active" : ""}`} onClick={() => setRole("recruiter")}>
                      <span className="role-em">🏢</span><div className="role-name">Recruiter</div><div className="role-hint">Hire top talent</div>
                    </button>
                  </div>
                  <button className="auth-submit" onClick={handleRegister}>Continue →</button>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textAlign: "center", marginTop: "0.85rem" }}>
                    By continuing you agree to our <a href="#" style={{ color: "var(--ink)" }}>Terms</a> &amp; <a href="#" style={{ color: "var(--ink)" }}>Privacy Policy</a>
                  </p>
                </>
              )}

              {regStep === 2 && (
                <>
                  <div className="auth-title">{role === "recruiter" ? "Company details" : "Your details"}</div>
                  <p className="auth-sub"><span className="link" onClick={() => setRegStep(1)}>← Change role</span></p>
                  {alertMsg && <Alert type="danger">{alertMsg}</Alert>}

                  {/* First/last name + company name — commented out
                  {role === "job_seeker" ? (
                    <div className="field-row-2">
                      <Field label="First name" error={errors.firstName}>
                        <input className={`field-input${errors.firstName ? " err" : ""}`} placeholder="Anh" value={form.firstName} onChange={(e) => setF("firstName", e.target.value)} />
                      </Field>
                      <Field label="Last name">
                        <input className="field-input" placeholder="Tran" value={form.lastName} onChange={(e) => setF("lastName", e.target.value)} />
                      </Field>
                    </div>
                  ) : (
                    <Field label="Company name" error={errors.firstName}>
                      <input className={`field-input${errors.firstName ? " err" : ""}`} placeholder="Acme Corp" value={form.firstName} onChange={(e) => setF("firstName", e.target.value)} />
                    </Field>
                  )}
                  */}

                  <Field label={role === "recruiter" ? "Business email" : "Email"} error={errors.email}
                    hint={role === "recruiter" ? "Use your official company domain for faster verification." : undefined}>
                    <input className={`field-input${errors.email ? " err" : ""}`} type="email"
                      placeholder={role === "recruiter" ? "you@company.com" : "you@example.com"}
                      value={form.email} onChange={(e) => setF("email", e.target.value)} />
                  </Field>

                  {role === "job_seeker" && (
                    <Field label="Phone" optional>
                      <input className="field-input" type="tel" placeholder="+84 90 000 0000" value={form.phone} onChange={(e) => setF("phone", e.target.value)} />
                    </Field>
                  )}

                  <Field label="Password" error={errors.password}>
                    <div style={{ position: "relative" }}>
                      <input className={`field-input has-right${errors.password ? " err" : ""}`} type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={(e) => setF("password", e.target.value)} />
                      {pwToggle(showPw, setShowPw)}
                    </div>
                    <PwStrength pw={form.password} />
                  </Field>

                  <Field label="Confirm password" error={errors.confirm}>
                    <div style={{ position: "relative" }}>
                      <input className={`field-input has-right${errors.confirm ? " err" : ""}`} type={showCo ? "text" : "password"} placeholder="Re-enter password" value={form.confirm} onChange={(e) => setF("confirm", e.target.value)} />
                      {pwToggle(showCo, setShowCo)}
                    </div>
                  </Field>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "1rem", fontSize: "var(--text-sm)", color: "var(--muted)", cursor: "pointer", lineHeight: 1.5 }}>
                    <input type="checkbox" checked={form.agree} onChange={(e) => setF("agree", e.target.checked)} style={{ marginTop: 3, accentColor: "var(--sage)", flexShrink: 0 }} />
                    I agree to the <a href="#" style={{ color: "var(--ink)" }}>&nbsp;Terms of Service</a>&nbsp;and&nbsp;<a href="#" style={{ color: "var(--ink)" }}>Privacy Policy</a>
                  </label>
                  {errors.agree && <div style={{ fontSize: "var(--text-xs)", color: "var(--danger)", marginTop: "-0.65rem", marginBottom: "0.75rem" }}>{errors.agree}</div>}

                  <button className="auth-submit" onClick={handleRegister} disabled={loading}>
                    {loading ? <><Spinner size="sm" white />Creating account…</> : "Create account →"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── OTP ── */}
          {screen === "otp" && (
            <div className="auth-screen" key="otp">
              <div style={{ textAlign: "center", fontSize: "2.25rem", marginBottom: "0.65rem" }}>✉️</div>
              <div className="auth-title">Check your email</div>
              <p className="auth-sub">6-digit code sent to <strong>{form.email || "your email"}</strong></p>
              {alertMsg && <Alert type="danger">{alertMsg}</Alert>}
              <OTPInput value={otp} onChange={setOtp} />
              <div className="otp-timer">
                {timer > 0
                  ? <>Resend in <strong>0:{String(timer).padStart(2, "0")}</strong></>
                  : <button onClick={() => { setTimer(59); setOtp(""); }}>Resend code</button>}
              </div>
              <button className="auth-submit" onClick={handleOTP} disabled={loading}>
                {loading ? <><Spinner size="sm" white />Verifying…</> : "Verify & continue →"}
              </button>
              <p style={{ textAlign: "center", marginTop: "0.85rem", fontSize: "var(--text-sm)", color: "var(--muted)" }}>
                Wrong email? <span style={{ cursor: "pointer", fontWeight: 500, color: "var(--accent)", textDecoration: "underline", textDecorationColor: "rgba(37,99,235,0.35)" }} onClick={() => goTo("login")}>Go back</span>
              </p>
            </div>
          )}

          {/* ── Forgot password ── */}
          {screen === "forgot" && (
            <div className="auth-screen" key="forgot">
              <div className="auth-title">Forgot password?</div>
              <p className="auth-sub"><span className="link" onClick={() => goTo("login")}>← Back to sign in</span></p>
              {alertMsg && <Alert type="danger">{alertMsg}</Alert>}
              <Field label="Email address" error={errors.email}>
                <input className={`field-input${errors.email ? " err" : ""}`} type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setF("email", e.target.value)} />
              </Field>
              <button className="auth-submit" onClick={handleForgot} disabled={loading}>
                {loading ? <><Spinner size="sm" white />Sending…</> : "Send reset link →"}
              </button>
            </div>
          )}

          {/* ── Reset password ── */}
          {screen === "reset" && (
            <div className="auth-screen" key="reset">
              <div className="auth-title">New password</div>
              <p className="auth-sub">Choose a strong password for your account.</p>
              {alertMsg && <Alert type="danger">{alertMsg}</Alert>}
              <Field label="New password" error={errors.password}>
                <div style={{ position: "relative" }}>
                  <input className={`field-input has-right${errors.password ? " err" : ""}`} type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={(e) => setF("password", e.target.value)} />
                  {pwToggle(showPw, setShowPw)}
                </div>
                <PwStrength pw={form.password} />
              </Field>
              <Field label="Confirm password" error={errors.confirm}>
                <div style={{ position: "relative" }}>
                  <input className={`field-input has-right${errors.confirm ? " err" : ""}`} type={showCo ? "text" : "password"} placeholder="Re-enter password" value={form.confirm} onChange={(e) => setF("confirm", e.target.value)} />
                  {pwToggle(showCo, setShowCo)}
                </div>
              </Field>
              <button className="auth-submit" onClick={handleReset} disabled={loading}>
                {loading ? <><Spinner size="sm" white />Updating…</> : "Set new password →"}
              </button>
            </div>
          )}

          {/* ── Done ── */}
          {screen === "done" && (
            <div className="auth-screen auth-success-wrap" key="done">
              <div className="auth-success-icon">✓</div>
              <div className="auth-title">You're all set!</div>
              <p className="auth-sub" style={{ textAlign: "center" }}>Your account is verified and ready to use.</p>
              <button className="auth-submit" style={{ marginTop: "1.5rem" }} onClick={() => navigate("landing")}>
                Go to dashboard →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
//  DASHBOARD SHELL
// ──────────────────────────────────────────────────────────────
function Dashboard({ user, navigate, onLogout }) {
  // Normalize role — handle "recruiter" from BE
  const isRecruiter = user?.role === "recruiter";

  const [page,    setPage]    = useState(isRecruiter ? "jobs-mine" : "jobs");
  const [editJob, setEditJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);

  function navTo(pageId, data = null) {
    setPage(pageId);
    if (pageId === "job-create" || pageId === "job-edit") setEditJob(data);
    if (pageId === "applicants") setViewJob(data);
  }

  console.log("[Dashboard] rendering — user:", user, "isRecruiter:", isRecruiter, "page:", page);

  return (
    <div className="app-shell">
      <TopNav user={user} navigate={navigate} onLogout={onLogout} />
      <div className="dash-layout">
        <Sidebar role={user?.role} active={page} onNavigate={navTo} onLogout={onLogout} />
        <main className="dash-content">
          {/* ── Seeker pages (job_seeker or any unrecognised role) ── */}
          {!isRecruiter && page === "jobs"         && <JobsBrowse user={user} />}
          {!isRecruiter && page === "applications" && <MyApplications />}
          {!isRecruiter && page === "cvs"          && <MyCVs />}
          {!isRecruiter && page === "profile"      && <CandidateProfilePage />}
          {!isRecruiter && page === "saved"        && <SavedJobs navigateTo={navTo} user={user} />}

          {/* ── Recruiter pages ── */}
          {isRecruiter && page === "jobs-mine"  && <RecruiterJobs onEditJob={(j) => navTo("job-create", j)} onViewApplicants={(j) => navTo("applicants", j)} navigateTo={navTo} />}
          {isRecruiter && page === "job-create" && <JobForm key={editJob?.id ?? "new"} editJob={editJob} navigateTo={navTo} />}
          {isRecruiter && page === "applicants" && viewJob  && <JobApplicants job={viewJob} onBack={() => navTo("jobs-mine")} />}
          {isRecruiter && page === "applicants" && !viewJob && (
            <EmptyState icon="👥" title="Select a job posting" desc="Go to My Postings and click Applicants on any listing." />
          )}
          {isRecruiter && page === "company"    && <CompanyProfilePage />}

          {/* ── Fallback — should never be blank ── */}
          {!isRecruiter && !["jobs","applications","cvs","profile","saved"].includes(page) && <JobsBrowse user={user} />}
          {isRecruiter  && !["jobs-mine","job-create","applicants","company"].includes(page) && <RecruiterJobs onEditJob={(j) => navTo("job-create", j)} onViewApplicants={(j) => navTo("applicants", j)} navigateTo={navTo} />}
        </main>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
//  ROOT APP  ·  Client-side router
// ──────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try { const u = localStorage.getItem("tb_user"); return u ? JSON.parse(u) : null; }
    catch { return null; }
  });
  // If a user session exists on load, go straight to dashboard
  const [page,       setPage]       = useState(() => {
    try { return localStorage.getItem("tb_user") ? "dashboard" : "landing"; }
    catch { return "landing"; }
  });
  const [authScreen, setAuthScreen] = useState("login");

  function navigate(target) {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (target === "login" || target === "register") {
      setAuthScreen(target);
      setPage("auth");
    } else {
      setPage(target);
    }
  }

  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem("tb_user", JSON.stringify(userData));
    setPage("dashboard");
    scheduleAccessTokenRefresh();
  }

  function handleLogout() {
    clearAccessTokenRefreshSchedule();
    auth.logout().catch(() => {});
    token.clear();
    localStorage.removeItem("tb_user");
    setUser(null);
    setPage("landing");
  }

  useEffect(() => {
    if (token.getAccess() && token.getRefresh()) scheduleAccessTokenRefresh();
    return () => clearAccessTokenRefreshSchedule();
  }, []);

  return (
    <>
      <GlobalStyles />
      <style dangerouslySetInnerHTML={{ __html: EXTRA_CSS }} />

      {page === "landing"   && <LandingPage navigate={navigate} />}
      {page === "auth"      && <AuthPage key={authScreen} initialScreen={authScreen} navigate={navigate} onLogin={handleLogin} />}
      {page === "dashboard" && user  && <Dashboard user={user} navigate={navigate} onLogout={handleLogout} />}
      {page === "dashboard" && !user && <AuthPage initialScreen="login" navigate={navigate} onLogin={handleLogin} />}
    </>
  );
}
