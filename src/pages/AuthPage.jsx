import { useState, useEffect, createRef, useMemo } from "react"

import { BrandLogo } from "../BrandLogo"
import { auth, token } from "../api.js"
import { Spinner, Alert, Field } from "../shared.jsx"

import googleIcon from "../assets/google.svg"
import linkedinIcon from "../assets/linkedin.svg"
import "../styles/AuthPage.css"

export function AuthPage({ initialScreen, navigate, onLogin }) {
    const [screen, setScreen] = useState(initialScreen || "login")
    const [role, setRole] = useState("job_seeker")
    const [regStep, setRegStep] = useState(1)
    const [showPw, setShowPw] = useState(false)
    const [showCo, setShowCo] = useState(false)
    const [loading, setLoading] = useState(false)
    const [otp, setOtp] = useState("")
    const [timer, setTimer] = useState(59)
    const [alertMsg, setAlertMsg] = useState("")
    const [form, setFormState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm: "",
        phone: "",
        agree: false,
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (screen !== "otp") return undefined

        setTimer(59)
        const t = setInterval(() => setTimer((p) => (p > 0 ? p - 1 : 0)), 1000)
        return () => clearInterval(t)
    }, [screen])

    const setF = (k, v) => {
        setFormState((p) => ({ ...p, [k]: v }))
        setErrors((p) => ({ ...p, [k]: "" }))
        setAlertMsg("")
    }

    function validate(fields) {
        const e = {}
        if (fields.includes("email") && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address."
        if (fields.includes("password") && form.password.length < 8) e.password = "Password must be at least 8 characters."
        if (fields.includes("confirm") && form.password !== form.confirm) e.confirm = "Passwords do not match."
        if (fields.includes("firstName") && !form.firstName.trim()) e.firstName = "This field is required."
        if (fields.includes("agree") && !form.agree) e.agree = "You must agree to the terms."
        setErrors(e)
        return Object.keys(e).length === 0
    }

    function fake(cb, ms = 1300) {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            cb()
        }, ms)
    }

    async function handleLogin() {
        if (!validate(["email", "password"])) return
        setLoading(true)
        try {
            const data = await auth.login(form.email, form.password)
            token.set(data.access_token, data.refresh_token)
            const userData = { email: data.email || form.email, role: data.role || "job_seeker" }
            onLogin(userData)
        } catch (e) {
            setLoading(false)
            setAlertMsg(e.message || "Login failed. Please check your credentials.")
            // OTP flow commented out:
            // setScreen("otp");
        }
    }

    async function handleRegister() {
        if (regStep === 1) {
            setRegStep(2)
            return
        }
        if (!validate(["email", "password", "confirm", "agree"])) return
        setLoading(true)
        try {
            // Step 1: register — BE returns { email, role }
            const registered = await auth.register(form.email, form.password, role)
            // Step 2: auto-login to get tokens — BE returns { access_token, refresh_token }
            const loginData = await auth.login(form.email, form.password)
            token.set(loginData.access_token, loginData.refresh_token)
            setLoading(false)
            onLogin({ email: registered.email || form.email, role: registered.role || role })
        } catch (e) {
            setLoading(false)
            setAlertMsg(e.message || "Registration failed. Please try again.")
        }
    }

    function handleOTP() {
        if (otp.length < 6) {
            setAlertMsg("Enter the 6-digit code.")
            return
        }
        fake(() => onLogin({ email: form.email, role }))
    }

    function toScreen(s) {
        setShowPw(false)
        setShowCo(false)
        setScreen(s)
    }

    function handleForgot() {
        if (!validate(["email"])) return
        fake(() => toScreen("reset"))
    }

    function handleReset() {
        if (!validate(["password", "confirm"])) return
        fake(() => toScreen("done"))
    }

    function goTo(s) {
        setAlertMsg("")
        setErrors({})
        setOtp("")
        setRegStep(1)
        setFormState((p) => ({ ...p, password: "", confirm: "" }))
        toScreen(s)
    }

    const copy = AUTH_PANEL_COPY[screen] || AUTH_PANEL_COPY.login

    // Shared inline toggle button
    const pwToggle = (show, set) => (
        <button
            type="button"
            style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "var(--text-sm)",
                color: "var(--muted)",
                fontFamily: "var(--font-sans)",
                padding: "0.2rem",
            }}
            onClick={() => set((p) => !p)}
        >
            {show ? "Hide" : "Show"}
        </button>
    )

    return (
        <div className="auth-root page-enter">
            {/* Left panel */}
            <div className="auth-panel">
                <div className="auth-panel-bg" />
                <div
                    className="lp-orb"
                    style={{ bottom: "-8rem", right: "-8rem", width: 320, height: 320, border: "1px solid rgba(148,163,184,0.12)" }}
                />
                <div
                    className="lp-orb"
                    style={{ top: "-5rem", left: "-5rem", width: 200, height: 200, border: "1px solid rgba(148,163,184,0.08)" }}
                />
                <BrandLogo className="auth-logo" variant="inverse" onClick={() => navigate("landing")} />
                <div className="auth-panel-copy">
                    <p className="auth-panel-ey">{copy.ey}</p>
                    <h2 className="auth-panel-h">{copy.h}</h2>
                    <p className="auth-panel-sub">{copy.s}</p>
                </div>
                <div className="auth-panel-stats">
                    {[
                        ["12,400+", "Active listings"],
                        ["3,200", "Verified employers"],
                        ["89%", "Placement rate"],
                    ].map(([v, l]) => (
                        <div key={l}>
                            <div className="auth-stat-val">{v}</div>
                            <div className="auth-stat-label">{l}</div>
                        </div>
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
                            <p className="auth-sub">
                                New here?{" "}
                                <span className="link" onClick={() => goTo("register")}>
                                    Create an account
                                </span>
                            </p>
                            <div className="oauth-group">
                                <button className="oauth-btn">
                                    <img src={googleIcon} alt="LinkedIn" width={18} height={18} /> Continue with Google
                                </button>
                                <button className="oauth-btn">
                                    <img src={linkedinIcon} alt="LinkedIn" width={18} height={18} /> Continue with LinkedIn
                                </button>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    margin: "1.25rem 0",
                                    color: "var(--muted)",
                                    fontSize: "var(--text-xs)",
                                }}
                            >
                                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                                <span style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>or email</span>
                                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                            </div>
                            {alertMsg && <Alert type="danger">{alertMsg}</Alert>}
                            <Field label="Email address" error={errors.email}>
                                <input
                                    className={`field-input${errors.email ? " err" : ""}`}
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={(e) => setF("email", e.target.value)}
                                />
                            </Field>
                            <Field label="Password" error={errors.password}>
                                <div style={{ position: "relative" }}>
                                    <input
                                        className={`field-input has-right${errors.password ? " err" : ""}`}
                                        type={showPw ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={(e) => setF("password", e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                    />
                                    {pwToggle(showPw, setShowPw)}
                                </div>
                            </Field>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-0.5rem", marginBottom: "1rem" }}>
                                <button className="forgot-link" onClick={() => goTo("forgot")}>
                                    Forgot password?
                                </button>
                            </div>
                            <button className="auth-submit" onClick={handleLogin} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner size="sm" white />
                                        Signing in…
                                    </>
                                ) : (
                                    "Sign in →"
                                )}
                            </button>
                        </div>
                    )}

                    {/* ── Register ── */}
                    {screen === "register" && (
                        <div className="auth-screen" key={`reg-${regStep}`}>
                            <div className="step-dots">
                                {[1, 2].map((s) => (
                                    <div key={s} className={`step-dot${regStep === s ? " active" : regStep > s ? " done" : ""}`} />
                                ))}
                            </div>

                            {regStep === 1 && (
                                <>
                                    <div className="auth-title">Create account</div>
                                    <p className="auth-sub">
                                        Have one?{" "}
                                        <span className="link" onClick={() => goTo("login")}>
                                            Sign in
                                        </span>
                                    </p>
                                    <div className="oauth-group">
                                        <button className="oauth-btn">
                                            <img src={googleIcon} alt="LinkedIn" width={18} height={18} /> Continue with Google
                                        </button>
                                        <button className="oauth-btn">
                                            <img src={linkedinIcon} alt="LinkedIn" width={18} height={18} /> Continue with LinkedIn
                                        </button>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                            margin: "1.25rem 0",
                                            color: "var(--muted)",
                                            fontSize: "var(--text-xs)",
                                        }}
                                    >
                                        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                                        <span style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>or email</span>
                                        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                                    </div>
                                    <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, marginBottom: "0.65rem" }}>I am a…</p>
                                    <div className="role-grid">
                                        <button
                                            className={`role-card${role === "job_seeker" ? " active" : ""}`}
                                            onClick={() => setRole("job_seeker")}
                                        >
                                            <span className="role-em">🧑‍💻</span>
                                            <div className="role-name">Job Seeker</div>
                                            <div className="role-hint">Find my next role</div>
                                        </button>
                                        <button className={`role-card${role === "recruiter" ? " active" : ""}`} onClick={() => setRole("recruiter")}>
                                            <span className="role-em">🏢</span>
                                            <div className="role-name">Recruiter</div>
                                            <div className="role-hint">Hire top talent</div>
                                        </button>
                                    </div>
                                    <button className="auth-submit" onClick={handleRegister}>
                                        Continue →
                                    </button>
                                    <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textAlign: "center", marginTop: "0.85rem" }}>
                                        By continuing you agree to our{" "}
                                        <a href="#" style={{ color: "var(--ink)" }}>
                                            Terms
                                        </a>{" "}
                                        &amp;{" "}
                                        <a href="#" style={{ color: "var(--ink)" }}>
                                            Privacy Policy
                                        </a>
                                    </p>
                                </>
                            )}

                            {regStep === 2 && (
                                <>
                                    <div className="auth-title">{role === "recruiter" ? "Company details" : "Your details"}</div>
                                    <p className="auth-sub">
                                        <span className="link" onClick={() => setRegStep(1)}>
                                            ← Change role
                                        </span>
                                    </p>
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

                                    <Field
                                        label={role === "recruiter" ? "Business email" : "Email"}
                                        error={errors.email}
                                        hint={role === "recruiter" ? "Use your official company domain for faster verification." : undefined}
                                    >
                                        <input
                                            className={`field-input${errors.email ? " err" : ""}`}
                                            type="email"
                                            placeholder={role === "recruiter" ? "you@company.com" : "you@example.com"}
                                            value={form.email}
                                            onChange={(e) => setF("email", e.target.value)}
                                        />
                                    </Field>

                                    {role === "job_seeker" && (
                                        <Field label="Phone" optional>
                                            <input
                                                className="field-input"
                                                type="tel"
                                                placeholder="+84 90 000 0000"
                                                value={form.phone}
                                                onChange={(e) => setF("phone", e.target.value)}
                                            />
                                        </Field>
                                    )}

                                    <Field label="Password" error={errors.password}>
                                        <div style={{ position: "relative" }}>
                                            <input
                                                className={`field-input has-right${errors.password ? " err" : ""}`}
                                                type={showPw ? "text" : "password"}
                                                placeholder="Min. 8 characters"
                                                value={form.password}
                                                onChange={(e) => setF("password", e.target.value)}
                                            />
                                            {pwToggle(showPw, setShowPw)}
                                        </div>
                                        <PwStrength pw={form.password} />
                                    </Field>

                                    <Field label="Confirm password" error={errors.confirm}>
                                        <div style={{ position: "relative" }}>
                                            <input
                                                className={`field-input has-right${errors.confirm ? " err" : ""}`}
                                                type={showCo ? "text" : "password"}
                                                placeholder="Re-enter password"
                                                value={form.confirm}
                                                onChange={(e) => setF("confirm", e.target.value)}
                                            />
                                            {pwToggle(showCo, setShowCo)}
                                        </div>
                                    </Field>

                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "0.5rem",
                                            marginBottom: "1rem",
                                            fontSize: "var(--text-sm)",
                                            color: "var(--muted)",
                                            cursor: "pointer",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.agree}
                                            onChange={(e) => setF("agree", e.target.checked)}
                                            style={{ marginTop: 3, accentColor: "var(--sage)", flexShrink: 0 }}
                                        />
                                        I agree to the{" "}
                                        <a href="#" style={{ color: "var(--ink)" }}>
                                            &nbsp;Terms of Service
                                        </a>
                                        &nbsp;and&nbsp;
                                        <a href="#" style={{ color: "var(--ink)" }}>
                                            Privacy Policy
                                        </a>
                                    </label>
                                    {errors.agree && (
                                        <div
                                            style={{
                                                fontSize: "var(--text-xs)",
                                                color: "var(--danger)",
                                                marginTop: "-0.65rem",
                                                marginBottom: "0.75rem",
                                            }}
                                        >
                                            {errors.agree}
                                        </div>
                                    )}

                                    <button className="auth-submit" onClick={handleRegister} disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Spinner size="sm" white />
                                                Creating account…
                                            </>
                                        ) : (
                                            "Create account →"
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {screen === "otp" && (
                        <div className="auth-screen" key="otp">
                            <div style={{ textAlign: "center", fontSize: "2.25rem", marginBottom: "0.65rem" }}>✉️</div>
                            <div className="auth-title">Check your email</div>
                            <p className="auth-sub">
                                6-digit code sent to <strong>{form.email || "your email"}</strong>
                            </p>
                            {alertMsg && <Alert type="danger">{alertMsg}</Alert>}
                            <OTPInput value={otp} onChange={setOtp} />
                            <div className="otp-timer">
                                {timer > 0 ? (
                                    <>
                                        Resend in <strong>0:{String(timer).padStart(2, "0")}</strong>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setTimer(59)
                                            setOtp("")
                                        }}
                                    >
                                        Resend code
                                    </button>
                                )}
                            </div>
                            <button className="auth-submit" onClick={handleOTP} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner size="sm" white />
                                        Verifying…
                                    </>
                                ) : (
                                    "Verify & continue →"
                                )}
                            </button>
                            <p style={{ textAlign: "center", marginTop: "0.85rem", fontSize: "var(--text-sm)", color: "var(--muted)" }}>
                                Wrong email?{" "}
                                <span
                                    style={{
                                        cursor: "pointer",
                                        fontWeight: 500,
                                        color: "var(--accent)",
                                        textDecoration: "underline",
                                        textDecorationColor: "rgba(37,99,235,0.35)",
                                    }}
                                    onClick={() => goTo("login")}
                                >
                                    Go back
                                </span>
                            </p>
                        </div>
                    )}

                    {screen === "forgot" && (
                        <div className="auth-screen" key="forgot">
                            <div className="auth-title">Forgot password?</div>
                            <p className="auth-sub">
                                <span className="link" onClick={() => goTo("login")}>
                                    ← Back to sign in
                                </span>
                            </p>
                            {alertMsg && <Alert type="danger">{alertMsg}</Alert>}
                            <Field label="Email address" error={errors.email}>
                                <input
                                    className={`field-input${errors.email ? " err" : ""}`}
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={(e) => setF("email", e.target.value)}
                                />
                            </Field>
                            <button className="auth-submit" onClick={handleForgot} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner size="sm" white />
                                        Sending…
                                    </>
                                ) : (
                                    "Send reset link →"
                                )}
                            </button>
                        </div>
                    )}

                    {screen === "reset" && (
                        <div className="auth-screen" key="reset">
                            <div className="auth-title">New password</div>
                            <p className="auth-sub">Choose a strong password for your account.</p>
                            {alertMsg && <Alert type="danger">{alertMsg}</Alert>}
                            <Field label="New password" error={errors.password}>
                                <div style={{ position: "relative" }}>
                                    <input
                                        className={`field-input has-right${errors.password ? " err" : ""}`}
                                        type={showPw ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        value={form.password}
                                        onChange={(e) => setF("password", e.target.value)}
                                    />
                                    {pwToggle(showPw, setShowPw)}
                                </div>
                                <PwStrength pw={form.password} />
                            </Field>
                            <Field label="Confirm password" error={errors.confirm}>
                                <div style={{ position: "relative" }}>
                                    <input
                                        className={`field-input has-right${errors.confirm ? " err" : ""}`}
                                        type={showCo ? "text" : "password"}
                                        placeholder="Re-enter password"
                                        value={form.confirm}
                                        onChange={(e) => setF("confirm", e.target.value)}
                                    />
                                    {pwToggle(showCo, setShowCo)}
                                </div>
                            </Field>
                            <button className="auth-submit" onClick={handleReset} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner size="sm" white />
                                        Updating…
                                    </>
                                ) : (
                                    "Set new password →"
                                )}
                            </button>
                        </div>
                    )}

                    {screen === "done" && (
                        <div className="auth-screen auth-success-wrap" key="done">
                            <div className="auth-success-icon">✓</div>
                            <div className="auth-title">You're all set!</div>
                            <p className="auth-sub" style={{ textAlign: "center" }}>
                                Your account is verified and ready to use.
                            </p>
                            <button className="auth-submit" style={{ marginTop: "1.5rem" }} onClick={() => navigate("landing")}>
                                Go to dashboard →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function PwStrength({ pw }) {
    if (!pw) return null
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    const label = ["Weak", "Fair", "Good", "Strong", "Strong"][s]
    const barScore = s === 0 ? 1 : s
    return (
        <div>
            <div className="pw-bars">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`pw-bar${i <= barScore ? ` s${barScore}` : ""}`} />
                ))}
            </div>
            <span className="pw-label">{label} password</span>
        </div>
    )
}

function OTPInput({ value, onChange }) {
    const inputRefs = useMemo(() => Array.from({ length: 6 }, () => createRef()), [])
    const chars = (value + "      ").slice(0, 6).split("")

    function handleChange(i, e) {
        const v = e.target.value.replace(/\D/g, "").slice(-1)
        const next = chars
            .map((c, idx) => (idx === i ? v : c))
            .join("")
            .trimEnd()
        onChange(next)
        if (v && i < 5) inputRefs[i + 1].current?.focus()
    }
    function handleKey(i, e) {
        if (e.key === "Backspace" && !chars[i]?.trim() && i > 0) inputRefs[i - 1].current?.focus()
    }
    function handlePaste(e) {
        const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        onChange(p)
        inputRefs[Math.min(p.length, 5)].current?.focus()
        e.preventDefault()
    }

    return (
        <div className="otp-row">
            {inputRefs.map((ref, i) => (
                <input
                    key={i}
                    ref={ref}
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
    )
}

const AUTH_PANEL_COPY = {
    login: {
        ey: "Welcome back",
        h: (
            <>
                Your next chapter
                <br />
                starts <em>here.</em>
            </>
        ),
        s: "Sign in to access thousands of opportunities.",
    },
    register: {
        ey: "Join TalentBridge",
        h: (
            <>
                Find work that truly <em>fits.</em>
            </>
        ),
        s: "Create your account and connect with verified employers.",
    },
    otp: {
        ey: "One last step",
        h: (
            <>
                Verify your <em>identity.</em>
            </>
        ),
        s: "We sent a 6-digit code to your email.",
    },
    forgot: {
        ey: "Password reset",
        h: (
            <>
                Let's get you back <em>in.</em>
            </>
        ),
        s: "Enter the email linked to your account.",
    },
    reset: {
        ey: "New password",
        h: (
            <>
                Almost <em>there.</em>
            </>
        ),
        s: "Create a strong new password for your account.",
    },
    done: {
        ey: "You're in!",
        h: (
            <>
                Welcome to <em>JobBridge.</em>
            </>
        ),
        s: "Your account is ready.",
    },
}