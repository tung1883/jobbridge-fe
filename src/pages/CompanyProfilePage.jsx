import { useState, useEffect, useRef } from "react";
import { companyProfile } from "../api.js";
import { Alert, Field, LoadingPage, ErrorPage, Spinner } from "../shared.jsx";
import { useAsync } from "../useAsync.js";
import { useForm, useSubmit } from "./hooks.js";
import { fileUrl } from "./utils.js";

export function CompanyProfilePage() {
  const { data: profile, loading, error, refetch } = useAsync(() => companyProfile.getOwn(), []);
  const form = useForm({ name: "", description: "", website: "", location: "" });
  const { patch } = form;
  const { loading: saving, error: saveErr, success: saved, submit } = useSubmit(async () => {
    await companyProfile.update(form.values);
    refetch();
    return "Company profile updated.";
  });

  const [logoUploading, setLogoUploading] = useState(false);
  const [logoErr, setLogoErr] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState({ type: "", text: "" });
  const logoRef = useRef();
  const verifyRef = useRef();

  useEffect(() => {
    if (profile) {
      patch({
        name:        profile.name        || "",
        description: profile.description || "",
        website:     profile.website     || "",
        location:    profile.location    || "",
      });
    }
  }, [profile, patch]);

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true); setLogoErr("");
    try { await companyProfile.uploadLogo(file); refetch(); }
    catch (err) { setLogoErr(err.message); }
    finally { setLogoUploading(false); e.target.value = ""; }
  }

  async function handleVerify(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVerifying(true); setVerifyMsg({ type: "", text: "" });
    try {
      await companyProfile.submitVerification(file);
      setVerifyMsg({ type: "success", text: "Verification documents submitted. Our team will review within 2–3 business days." });
    } catch (err) {
      setVerifyMsg({ type: "danger", text: err.message });
    } finally {
      setVerifying(false); e.target.value = "";
    }
  }

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage message={error} onRetry={refetch} />;

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-title">Company Profile</div>
        <div className="page-sub">Shown to candidates who view your job postings</div>
      </div>

      {saveErr && <Alert type="danger">{saveErr}</Alert>}
      {saved && <Alert type="success">{saved}</Alert>}

      <div className="card-flat company-identity" style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem", maxWidth: 640, margin: "0 auto 1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <div
            style={{ width: 72, height: 72, borderRadius: 14, background: "var(--cream)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", overflow: "hidden", cursor: "pointer" }}
            onClick={() => logoRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && logoRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            {profile?.logo_url ? (
              <img src={fileUrl(profile.logo_url)} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : "🏢"}
          </div>
          <input type="file" ref={logoRef} accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
        </div>
        <div style={{ flex: 1, minWidth: "12rem" }}>
          <div style={{ fontWeight: 600, fontSize: "var(--text-lg)", fontFamily: "var(--font-sans)" }}>
            {form.values.name || profile?.name || "Your Company"}
          </div>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--muted)", marginTop: "0.2rem" }}>
            {profile?.verification_status === "verified"
              ? <span className="badge badge-sage">✓ Verified employer</span>
              : <span className="badge badge-warn">⏳ Pending verification</span>}
          </div>
          {logoErr && <div style={{ fontSize: "var(--text-xs)", color: "var(--danger)", marginTop: "0.3rem" }}>{logoErr}</div>}
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => logoRef.current?.click()} disabled={logoUploading}>
          {logoUploading ? <><Spinner size="sm" />Uploading…</> : "Change logo"}
        </button>
      </div>

      <div className="card" style={{ maxWidth: 640, margin: "0 auto 1.25rem" }}>
        <Field label="Company name">
          <input
            className="field-input"
            value={form.values.name}
            onChange={(e) => form.set("name", e.target.value)}
            placeholder="Acme Corp"
          />
        </Field>
        <Field label="Description">
          <textarea
            className="field-textarea"
            rows={4}
            value={form.values.description}
            onChange={(e) => form.set("description", e.target.value)}
            placeholder="What does your company do, and what's your culture like?"
          />
        </Field>
        <div className="field-row-2">
          <Field label="Location">
            <input
              className="field-input"
              value={form.values.location}
              onChange={(e) => form.set("location", e.target.value)}
              placeholder="City, Country"
            />
          </Field>
          <Field label="Website" optional>
            <input
              className="field-input"
              value={form.values.website}
              onChange={(e) => form.set("website", e.target.value)}
              placeholder="https://yourcompany.com"
            />
          </Field>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button type="button" className="btn btn-primary" onClick={submit} disabled={saving}>
            {saving ? <><Spinner size="sm" white />Saving…</> : "Save changes"}
          </button>
        </div>
      </div>

      {profile?.verification_status !== "verified" && (
        <div className="card-flat" style={{ maxWidth: 640, margin: "0 auto", borderLeft: "3px solid var(--accent)" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Get verified <span className="badge badge-gold">+Trust</span>
          </div>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--muted)", lineHeight: 1.65, marginBottom: "1rem" }}>
            Upload your business registration document (PDF, JPG, or PNG). Our admin team reviews within 2–3 business days. Verified companies get a badge on all their job postings.
          </p>
          {verifyMsg.text && <Alert type={verifyMsg.type || "info"}>{verifyMsg.text}</Alert>}
          <input type="file" ref={verifyRef} accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={handleVerify} />
          <button type="button" className="btn btn-secondary" onClick={() => verifyRef.current?.click()} disabled={verifying}>
            {verifying ? <><Spinner size="sm" />Submitting…</> : "Upload verification document"}
          </button>
        </div>
      )}
    </div>
  );
}
