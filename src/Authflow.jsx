import { useState, useEffect, useMemo, createRef } from "react";
import { BrandLogo, BRAND_LOGO_STYLES } from "./BrandLogo.jsx";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --font-sans: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
    --ink: #18181b;
    --chalk: #ffffff;
    --cream: #f4f4f5;
    --accent: #2563eb;
    --accent-muted: rgba(37,99,235,0.12);
    --accent-soft: #eff6ff;
    --gold: var(--accent);
    --gold-light: #93c5fd;
    --copper: #1d4ed8;
    --sage: #475569;
    --sage-light: #e2e8f0;
    --muted: #71717a;
    --border: rgba(24,24,27,0.09);
    --border-focus: #2563eb;
    --danger: #c0392b;
    --danger-bg: #fdf0ee;
    --radius: 6px;
    --radius-lg: 14px;
  }

  ${BRAND_LOGO_STYLES}

  .auth-root {
    font-family: var(--font-sans);
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--chalk);
    color: var(--ink);
  }

  /* ── LEFT PANEL ── */
  .auth-left {
    background: #0f172a;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem;
  }
  .auth-left-bg {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
    background-size: 20px 20px;
  }
  .auth-left-orb1 {
    position: absolute; bottom: -8rem; right: -8rem;
    width: 340px; height: 340px; border-radius: 50%;
    border: 1px solid rgba(148,163,184,0.12);
  }
  .auth-left-orb2 {
    position: absolute; top: -5rem; left: -5rem;
    width: 220px; height: 220px; border-radius: 50%;
    border: 1px solid rgba(148,163,184,0.08);
  }
  .auth-logo {
    font-family: var(--font-sans);
    font-size: 1.5rem; font-weight: 700; color: var(--chalk);
    text-decoration: none; position: relative; z-index: 1;
  }
  .auth-logo span { color: #93c5fd; }

  .auth-left-content {
    position: relative; z-index: 1;
  }
  .auth-left-eyebrow {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .auth-left-eyebrow::before { content: ''; width: 1.5rem; height: 1px; background: rgba(255,255,255,0.25); }
  .auth-left-headline {
    font-size: 2.75rem; font-weight: 700; line-height: 1.08;
    letter-spacing: -0.02em; color: var(--chalk); margin-bottom: 1.25rem;
  }
  .auth-left-headline em { font-style: normal; color: #93c5fd; }
  .auth-left-sub {
    font-size: 0.95rem; font-weight: 300;
    color: rgba(255,255,255,0.45); line-height: 1.7; max-width: 30ch;
  }

  .auth-left-stats {
    display: flex; gap: 2.5rem; position: relative; z-index: 1;
    padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08);
  }
  .auth-stat-val {
    font-size: 1.6rem; font-weight: 700; color: var(--chalk);
  }
  .auth-stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.35); margin-top: 0.2rem; letter-spacing: 0.04em; }

  /* ── RIGHT PANEL ── */
  .auth-right {
    display: flex; align-items: center; justify-content: center;
    padding: 3rem 2rem;
    overflow-y: auto;
  }
  .auth-form-wrap {
    width: 100%; max-width: 420px;
  }

  /* ── SCREEN TRANSITIONS ── */
  .auth-screen {
    animation: authSlideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes authSlideIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── FORM HEADER ── */
  .auth-form-title {
    font-family: var(--font-sans);
    font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.5rem;
  }
  .auth-form-sub {
    font-size: 0.9rem; color: var(--muted); margin-bottom: 2rem; line-height: 1.5;
  }
  .auth-form-sub a, .auth-form-sub span.link {
    color: var(--accent); font-weight: 500; text-decoration: underline;
    text-decoration-color: rgba(37,99,235,0.35); cursor: pointer;
  }
  .auth-form-sub a:hover, .auth-form-sub span.link:hover { color: var(--sage); }

  /* ── ROLE SELECTOR ── */
  .role-selector {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.75rem;
  }
  .role-card {
    border: 1.5px solid var(--border); border-radius: var(--radius-lg);
    padding: 1.1rem 1rem; cursor: pointer; text-align: center;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
    background: transparent;
    font-family: var(--font-sans);
  }
  .role-card:hover { border-color: var(--accent); }
  .role-card.active {
    border-color: var(--accent); background: var(--accent-soft);
  }
  .role-icon { font-size: 1.5rem; margin-bottom: 0.4rem; display: block; }
  .role-name { font-size: 0.85rem; font-weight: 500; }
  .role-hint { font-size: 0.72rem; color: var(--muted); margin-top: 0.2rem; }

  /* ── DIVIDER ── */
  .auth-divider {
    display: flex; align-items: center; gap: 1rem;
    margin: 1.5rem 0; color: var(--muted); font-size: 0.78rem;
  }
  .auth-divider::before, .auth-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  /* ── OAUTH BUTTONS ── */
  .oauth-group { display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.5rem; }
  .oauth-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
    padding: 0.75rem 1rem; border-radius: var(--radius);
    border: 1.5px solid var(--border); background: transparent; cursor: pointer;
    font-size: 0.875rem; font-weight: 400; color: var(--ink);
    font-family: var(--font-sans);
    transition: border-color 0.2s, background 0.2s;
  }
  .oauth-btn:hover { border-color: rgba(15,14,12,0.3); background: var(--cream); }
  .oauth-icon { width: 18px; height: 18px; flex-shrink: 0; }

  /* ── INPUTS ── */
  .field { margin-bottom: 1rem; }
  .field-label {
    display: block; font-size: 0.8rem; font-weight: 500;
    margin-bottom: 0.45rem; color: var(--ink);
  }
  .field-row { position: relative; }
  .field-input {
    width: 100%; padding: 0.75rem 1rem;
    border: 1.5px solid var(--border); border-radius: var(--radius);
    font-size: 0.9rem; font-family: var(--font-sans);
    background: var(--chalk); color: var(--ink);
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }
  .field-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--accent-muted); }
  .field-input.has-icon { padding-right: 2.75rem; }
  .field-input.error { border-color: var(--danger); }
  .field-toggle {
    position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--muted);
    font-size: 0.8rem; padding: 0.2rem; font-family: var(--font-sans);
  }
  .field-error { font-size: 0.75rem; color: var(--danger); margin-top: 0.35rem; }
  .field-hint { font-size: 0.72rem; color: var(--muted); margin-top: 0.35rem; }

  .field-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

  /* ── PASSWORD STRENGTH ── */
  .pw-strength { margin-top: 0.5rem; }
  .pw-bars { display: flex; gap: 4px; margin-bottom: 0.3rem; }
  .pw-bar { flex: 1; height: 3px; border-radius: 2px; background: var(--border); transition: background 0.3s; }
  .pw-bar.weak  { background: #e74c3c; }
  .pw-bar.fair  { background: #f39c12; }
  .pw-bar.good  { background: #27ae60; }
  .pw-bar.strong{ background: var(--sage); }
  .pw-label { font-size: 0.72rem; color: var(--muted); }

  /* ── CHECKBOX ── */
  .check-row {
    display: flex; align-items: flex-start; gap: 0.6rem;
    margin-bottom: 1.25rem; font-size: 0.82rem; color: var(--muted); cursor: pointer;
  }
  .check-row input[type=checkbox] {
    width: 16px; height: 16px; margin-top: 1px; flex-shrink: 0;
    accent-color: var(--sage); cursor: pointer;
  }
  .check-row a { color: var(--ink); font-weight: 500; text-decoration-color: rgba(37,99,235,0.35); }
  .forgot-row {
    display: flex; justify-content: flex-end; margin-top: -0.5rem; margin-bottom: 1rem;
  }
  .forgot-link {
    font-size: 0.78rem; color: var(--muted); text-decoration: underline;
    text-decoration-color: transparent; cursor: pointer; background: none; border: none;
    font-family: var(--font-sans); transition: color 0.2s;
  }
  .forgot-link:hover { color: var(--ink); text-decoration-color: var(--accent); }

  /* ── SUBMIT ── */
  .auth-submit {
    width: 100%; padding: 0.9rem;
    background: var(--ink); color: var(--chalk);
    border: none; border-radius: var(--radius);
    font-size: 0.95rem; font-weight: 500;
    font-family: var(--font-sans); cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .auth-submit:hover { background: #334155; }
  .auth-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .auth-submit.loading { pointer-events: none; }
  .spinner {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%;
    animation: spin 0.7s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── OTP ── */
  .otp-wrap { display: flex; gap: 0.6rem; justify-content: center; margin: 1.75rem 0; }
  .otp-input {
    width: 52px; height: 58px; text-align: center;
    font-size: 1.4rem; font-weight: 700;
    border: 1.5px solid var(--border); border-radius: var(--radius);
    background: var(--chalk); color: var(--ink); outline: none;
    font-family: var(--font-sans);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .otp-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-muted); }
  .otp-input.filled { border-color: var(--sage); background: rgba(61,90,76,0.04); }
  .otp-resend {
    text-align: center; font-size: 0.82rem; color: var(--muted); margin-bottom: 1.5rem;
  }
  .otp-resend button {
    background: none; border: none; font-family: var(--font-sans);
    font-size: 0.82rem; font-weight: 500; color: var(--ink);
    cursor: pointer; text-decoration: underline; text-decoration-color: rgba(37,99,235,0.35);
  }
  .otp-resend button:disabled { color: var(--muted); text-decoration: none; cursor: default; }
  .otp-icon { text-align: center; font-size: 2.5rem; margin-bottom: 0.75rem; }

  /* ── ALERT ── */
  .auth-alert {
    background: var(--danger-bg); border: 1px solid rgba(192,57,43,0.2);
    border-radius: var(--radius); padding: 0.75rem 1rem;
    font-size: 0.82rem; color: var(--danger); margin-bottom: 1rem;
    display: flex; gap: 0.5rem; align-items: flex-start;
  }

  /* ── SUCCESS ── */
  .auth-success {
    text-align: center; padding: 1rem 0;
  }
  .auth-success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: var(--accent-soft); border: 2px solid var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.75rem; margin: 0 auto 1.5rem; color: var(--accent);
  }

  /* ── STEP INDICATOR ── */
  .auth-steps {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem;
  }
  .auth-step-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--border); transition: all 0.3s;
  }
  .auth-step-dot.active { background: var(--accent); width: 24px; border-radius: 4px; }
  .auth-step-dot.done { background: var(--sage); }

  @media (max-width: 768px) {
    .auth-root { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { padding: 2rem 1.25rem; align-items: flex-start; padding-top: 3rem; }
  }
`;

// ── SVG ICONS ──
const GoogleIcon = () => (
  <svg className="oauth-icon" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="oauth-icon" viewBox="0 0 24 24" fill="#0077B5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// ── PASSWORD STRENGTH ──
function getStrength(pw) {
  if (!pw) return { score: 0, label: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["Weak", "Fair", "Good", "Strong", "Strong"];
  return { score: s, label: labels[s] };
}

function PasswordStrength({ password }) {
  const { score, label } = getStrength(password);
  if (!password) return null;
  const cls = ["", "weak", "fair", "good", "strong"][score];
  return (
    <div className="pw-strength">
      <div className="pw-bars">
        {[1,2,3,4].map(i => (
          <div key={i} className={`pw-bar ${i <= score ? cls : ""}`} />
        ))}
      </div>
      <span className="pw-label">{label} password</span>
    </div>
  );
}

// ── OTP INPUTS ──
function OTPInputs({ value, onChange }) {
  const inputRefs = useMemo(() => Array.from({ length: 6 }, () => createRef()), []);
  const digits = (value + "      ").slice(0, 6).split("");

  function handle(i, e) {
    const v = e.target.value.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, idx) => idx === i ? v : d).join("").trimEnd();
    onChange(next);
    if (v && i < 5) inputRefs[i + 1].current?.focus();
  }
  function handleKey(i, e) {
    if (e.key === "Backspace" && !digits[i].trim() && i > 0) inputRefs[i - 1].current?.focus();
  }
  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    inputRefs[Math.min(pasted.length, 5)].current?.focus();
    e.preventDefault();
  }

  return (
    <div className="otp-wrap">
      {inputRefs.map((ref, i) => (
        <input
          key={i} ref={ref} className={`otp-input${digits[i]?.trim() ? " filled" : ""}`}
          maxLength={1} value={digits[i]?.trim() || ""} inputMode="numeric"
          onChange={e => handle(i, e)} onKeyDown={e => handleKey(i, e)} onPaste={handlePaste}
        />
      ))}
    </div>
  );
}

// ── MAIN COMPONENT ──
export default function AuthFlow() {
  const [screen, setScreen] = useState("login"); // login | register | otp | forgot | reset | done
  const [role, setRole] = useState("seeker");
  const [regStep, setRegStep] = useState(1); // 1=role, 2=details
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(59);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "", phone: "", agree: false });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState("");

  // OTP countdown
  useEffect(() => {
    if (screen !== "otp") return undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when entering OTP screen
    setOtpTimer(59);
    const t = setInterval(() => setOtpTimer(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [screen]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); setAlert(""); };

  function validate(fields) {
    const e = {};
    if (fields.includes("email") && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address.";
    if (fields.includes("password") && form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (fields.includes("confirm") && form.password !== form.confirm) e.confirm = "Passwords do not match.";
    if (fields.includes("firstName") && !form.firstName.trim()) e.firstName = "First name is required.";
    if (fields.includes("agree") && !form.agree) e.agree = "You must agree to the terms.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function fakeLoad(cb, ms = 1400) {
    setLoading(true);
    setTimeout(() => { setLoading(false); cb(); }, ms);
  }

  function toScreen(s) {
    setShowPw(false);
    setShowConfirm(false);
    setScreen(s);
  }

  function handleLogin() {
    if (!validate(["email", "password"])) return;
    fakeLoad(() => toScreen("otp"));
  }
  function handleRegister() {
    if (regStep === 1) { setRegStep(2); return; }
    if (!validate(["firstName", "email", "password", "confirm", "agree"])) return;
    fakeLoad(() => toScreen("otp"));
  }
  function handleOTP() {
    if (otp.length < 6) { setAlert("Please enter the 6-digit code."); return; }
    fakeLoad(() => toScreen("done"), 1000);
  }
  function handleForgot() {
    if (!validate(["email"])) return;
    fakeLoad(() => toScreen("reset"));
  }
  function handleReset() {
    if (!validate(["password", "confirm"])) return;
    fakeLoad(() => toScreen("done"), 1000);
  }

  function goTo(s) {
    setAlert("");
    setErrors({});
    setOtp("");
    setRegStep(1);
    setForm((f) => ({ ...f, password: "", confirm: "" }));
    toScreen(s);
  }

  // Left panel copy per screen
  const leftCopy = {
    login:    { eyebrow: "Welcome back", headline: <>Your next chapter<br/>starts <em>here.</em></>, sub: "Sign in to access thousands of opportunities tailored to you." },
    register: { eyebrow: "Join TalentBridge", headline: <>Find work that truly <em>fits.</em></>, sub: "Create your account and connect with verified employers across Vietnam and beyond." },
    otp:      { eyebrow: "One last step", headline: <>Verify your <em>identity.</em></>, sub: "We sent a 6-digit code to your email. It expires in 10 minutes." },
    forgot:   { eyebrow: "Password reset", headline: <>Let's get you back <em>in.</em></>, sub: "Enter the email linked to your account and we'll send a reset link." },
    reset:    { eyebrow: "New password", headline: <>Almost <em>there.</em></>, sub: "Create a strong new password for your account." },
    done:     { eyebrow: "You're in!", headline: <>Welcome to <em>TalentBridge.</em></>, sub: "Your account is ready. Let's find your perfect match." },
  };
  const copy = leftCopy[screen] || leftCopy.login;

  return (
    <div className="auth-root">
      <style>{styles}</style>

      {/* LEFT */}
      <div className="auth-left">
        <div className="auth-left-bg" /><div className="auth-left-orb1" /><div className="auth-left-orb2" />
        <BrandLogo className="auth-logo" variant="inverse" />
        <div className="auth-left-content">
          <p className="auth-left-eyebrow">{copy.eyebrow}</p>
          <h2 className="auth-left-headline">{copy.headline}</h2>
          <p className="auth-left-sub">{copy.sub}</p>
        </div>
        <div className="auth-left-stats">
          {[["12,400+", "Active listings"], ["3,200", "Verified employers"], ["89%", "Placement rate"]].map(([v, l]) => (
            <div key={l}><div className="auth-stat-val">{v}</div><div className="auth-stat-label">{l}</div></div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <div className="auth-form-wrap">

          {/* ── LOGIN ── */}
          {screen === "login" && (
            <div className="auth-screen" key="login">
              <h1 className="auth-form-title">Sign in</h1>
              <p className="auth-form-sub">New here? <span className="link" onClick={() => goTo("register")}>Create an account</span></p>

              <div className="oauth-group">
                <button className="oauth-btn"><GoogleIcon />Continue with Google</button>
                <button className="oauth-btn"><LinkedInIcon />Continue with LinkedIn</button>
              </div>
              <div className="auth-divider">or sign in with email</div>

              {alert && <div className="auth-alert">⚠ {alert}</div>}

              <div className="field">
                <label className="field-label">Email address</label>
                <input className={`field-input${errors.email ? " error" : ""}`} type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => set("email", e.target.value)} />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-row">
                  <input className={`field-input has-icon${errors.password ? " error" : ""}`}
                    type={showPw ? "text" : "password"} placeholder="••••••••"
                    value={form.password} onChange={e => set("password", e.target.value)} />
                  <button className="field-toggle" onClick={() => setShowPw(p => !p)}>{showPw ? "Hide" : "Show"}</button>
                </div>
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>
              <div className="forgot-row">
                <button className="forgot-link" onClick={() => goTo("forgot")}>Forgot password?</button>
              </div>
              <button className="auth-submit" onClick={handleLogin} disabled={loading}>
                {loading ? <><div className="spinner" />Signing in…</> : "Sign in →"}
              </button>
            </div>
          )}

          {/* ── REGISTER ── */}
          {screen === "register" && (
            <div className="auth-screen" key={`reg${regStep}`}>
              <div className="auth-steps">
                {[1,2].map(s => <div key={s} className={`auth-step-dot${regStep === s ? " active" : regStep > s ? " done" : ""}`} />)}
              </div>

              {regStep === 1 && (
                <>
                  <h1 className="auth-form-title">Create account</h1>
                  <p className="auth-form-sub">Already have one? <span className="link" onClick={() => goTo("login")}>Sign in</span></p>

                  <div className="oauth-group">
                    <button className="oauth-btn"><GoogleIcon />Continue with Google</button>
                    <button className="oauth-btn"><LinkedInIcon />Continue with LinkedIn</button>
                  </div>
                  <div className="auth-divider">or register with email</div>

                  <p className="field-label" style={{ marginBottom: "0.75rem" }}>I am a…</p>
                  <div className="role-selector">
                    <button className={`role-card${role === "seeker" ? " active" : ""}`} onClick={() => setRole("seeker")}>
                      <span className="role-icon">🧑‍💻</span>
                      <div className="role-name">Job Seeker</div>
                      <div className="role-hint">Find my next role</div>
                    </button>
                    <button className={`role-card${role === "recruiter" ? " active" : ""}`} onClick={() => setRole("recruiter")}>
                      <span className="role-icon">🏢</span>
                      <div className="role-name">Recruiter</div>
                      <div className="role-hint">Hire top talent</div>
                    </button>
                  </div>
                  <button className="auth-submit" onClick={handleRegister}>Continue →</button>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", marginTop: "1rem" }}>
                    By continuing you agree to our <a href="#" style={{ color: "var(--ink)" }}>Terms</a> & <a href="#" style={{ color: "var(--ink)" }}>Privacy Policy</a>
                  </p>
                </>
              )}

              {regStep === 2 && (
                <>
                  <h1 className="auth-form-title">{role === "recruiter" ? "Company details" : "Your details"}</h1>
                  <p className="auth-form-sub" style={{ marginBottom: "1.5rem" }}>
                    <span className="link" onClick={() => setRegStep(1)}>← Change role</span>
                  </p>

                  {alert && <div className="auth-alert">⚠ {alert}</div>}

                  {/* {role === "seeker" ? (
                    <div className="field-row-2">
                      <div className="field">
                        <label className="field-label">First name</label>
                        <input className={`field-input${errors.firstName ? " error" : ""}`} placeholder="Anh"
                          value={form.firstName} onChange={e => set("firstName", e.target.value)} />
                        {errors.firstName && <div className="field-error">{errors.firstName}</div>}
                      </div>
                      <div className="field">
                        <label className="field-label">Last name</label>
                        <input className="field-input" placeholder="Tran"
                          value={form.lastName} onChange={e => set("lastName", e.target.value)} />
                      </div>
                    </div>
                  ) : (
                    <div className="field">
                      <label className="field-label">Company name</label>
                      <input className={`field-input${errors.firstName ? " error" : ""}`} placeholder="Acme Corp"
                        value={form.firstName} onChange={e => set("firstName", e.target.value)} />
                      {errors.firstName && <div className="field-error">{errors.firstName}</div>}
                    </div>
                  )} */}

                  <div className="field">
                    <label className="field-label">{role === "recruiter" ? "Business email" : "Email address"}</label>
                    <input className={`field-input${errors.email ? " error" : ""}`} type="email"
                      placeholder={role === "recruiter" ? "you@company.com" : "you@example.com"}
                      value={form.email} onChange={e => set("email", e.target.value)} />
                    {errors.email && <div className="field-error">{errors.email}</div>}
                    {role === "recruiter" && <div className="field-hint">Use your official company domain for faster verification.</div>}
                  </div>

                  {role === "seeker" && (
                    <div className="field">
                      <label className="field-label">Phone number <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
                      <input className="field-input" type="tel" placeholder="+84 90 000 0000"
                        value={form.phone} onChange={e => set("phone", e.target.value)} />
                    </div>
                  )}

                  <div className="field">
                    <label className="field-label">Password</label>
                    <div className="field-row">
                      <input className={`field-input has-icon${errors.password ? " error" : ""}`}
                        type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                        value={form.password} onChange={e => set("password", e.target.value)} />
                      <button className="field-toggle" onClick={() => setShowPw(p => !p)}>{showPw ? "Hide" : "Show"}</button>
                    </div>
                    {errors.password && <div className="field-error">{errors.password}</div>}
                    <PasswordStrength password={form.password} />
                  </div>

                  <div className="field">
                    <label className="field-label">Confirm password</label>
                    <div className="field-row">
                      <input className={`field-input has-icon${errors.confirm ? " error" : ""}`}
                        type={showConfirm ? "text" : "password"} placeholder="Re-enter password"
                        value={form.confirm} onChange={e => set("confirm", e.target.value)} />
                      <button className="field-toggle" onClick={() => setShowConfirm(p => !p)}>{showConfirm ? "Hide" : "Show"}</button>
                    </div>
                    {errors.confirm && <div className="field-error">{errors.confirm}</div>}
                  </div>

                  <label className="check-row">
                    <input type="checkbox" checked={form.agree} onChange={e => set("agree", e.target.checked)} />
                    I agree to the <a href="#" style={{ marginLeft: 4 }}>Terms of Service</a>&nbsp;and&nbsp;<a href="#">Privacy Policy</a>
                  </label>
                  {errors.agree && <div className="field-error" style={{ marginTop: "-0.75rem", marginBottom: "0.75rem" }}>{errors.agree}</div>}

                  <button className="auth-submit" onClick={handleRegister} disabled={loading}>
                    {loading ? <><div className="spinner" />Creating account…</> : "Create account →"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── OTP ── */}
          {screen === "otp" && (
            <div className="auth-screen" key="otp">
              <div className="otp-icon">✉️</div>
              <h1 className="auth-form-title">Check your email</h1>
              <p className="auth-form-sub">
                We sent a 6-digit code to <strong>{form.email || "your email"}</strong>. Enter it below to continue.
              </p>

              {alert && <div className="auth-alert">⚠ {alert}</div>}

              <OTPInputs value={otp} onChange={setOtp} />

              <div className="otp-resend">
                {otpTimer > 0
                  ? <>Resend code in <strong>0:{String(otpTimer).padStart(2, "0")}</strong></>
                  : <><button onClick={() => { setOtpTimer(59); setOtp(""); }}>Resend code</button></>
                }
              </div>

              <button className="auth-submit" onClick={handleOTP} disabled={loading}>
                {loading ? <><div className="spinner" />Verifying…</> : "Verify & continue →"}
              </button>
              <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.82rem", color: "var(--muted)" }}>
                Wrong email? <span className="link" onClick={() => goTo(screen === "otp" ? "login" : "register")} style={{ cursor: "pointer", fontWeight: 500, color: "var(--accent)", textDecoration: "underline", textDecorationColor: "rgba(37,99,235,0.35)" }}>Go back</span>
              </p>
            </div>
          )}

          {/* ── FORGOT ── */}
          {screen === "forgot" && (
            <div className="auth-screen" key="forgot">
              <h1 className="auth-form-title">Forgot password?</h1>
              <p className="auth-form-sub">
                <span className="link" onClick={() => goTo("login")}>← Back to sign in</span>
              </p>

              <div className="field">
                <label className="field-label">Email address</label>
                <input className={`field-input${errors.email ? " error" : ""}`} type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => set("email", e.target.value)} />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              <button className="auth-submit" onClick={handleForgot} disabled={loading}>
                {loading ? <><div className="spinner" />Sending…</> : "Send reset link →"}
              </button>
            </div>
          )}

          {/* ── RESET ── */}
          {screen === "reset" && (
            <div className="auth-screen" key="reset">
              <h1 className="auth-form-title">New password</h1>
              <p className="auth-form-sub">Choose a strong password for your account.</p>

              <div className="field">
                <label className="field-label">New password</label>
                <div className="field-row">
                  <input className={`field-input has-icon${errors.password ? " error" : ""}`}
                    type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                    value={form.password} onChange={e => set("password", e.target.value)} />
                  <button className="field-toggle" onClick={() => setShowPw(p => !p)}>{showPw ? "Hide" : "Show"}</button>
                </div>
                {errors.password && <div className="field-error">{errors.password}</div>}
                <PasswordStrength password={form.password} />
              </div>

              <div className="field">
                <label className="field-label">Confirm password</label>
                <div className="field-row">
                  <input className={`field-input has-icon${errors.confirm ? " error" : ""}`}
                    type={showConfirm ? "text" : "password"} placeholder="Re-enter password"
                    value={form.confirm} onChange={e => set("confirm", e.target.value)} />
                  <button className="field-toggle" onClick={() => setShowConfirm(p => !p)}>{showConfirm ? "Hide" : "Show"}</button>
                </div>
                {errors.confirm && <div className="field-error">{errors.confirm}</div>}
              </div>

              <button className="auth-submit" onClick={handleReset} disabled={loading}>
                {loading ? <><div className="spinner" />Updating…</> : "Set new password →"}
              </button>
            </div>
          )}

          {/* ── DONE ── */}
          {screen === "done" && (
            <div className="auth-screen auth-success" key="done">
              <div className="auth-success-icon">✓</div>
              <h1 className="auth-form-title">You're all set!</h1>
              <p className="auth-form-sub" style={{ textAlign: "center" }}>
                {form.email ? `Signed in as ${form.email}.` : "Your account is verified."}<br />
                Ready to find your perfect match.
              </p>
              <button className="auth-submit" style={{ marginTop: "2rem" }} onClick={() => goTo("login")}>
                Go to dashboard →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}