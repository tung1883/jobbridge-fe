import { useEffect } from "react";
import { candidateProfile } from "../api.js";
import { Alert, Field, LoadingPage, ErrorPage, Spinner } from "../shared.jsx";
import { useAsync } from "../useAsync.js";
import { useForm, useSubmit } from "./hooks.js";

export function CandidateProfilePage() {
  const { data: profile, loading, error, refetch } = useAsync(() => candidateProfile.getOwn(), []);
  const form = useForm({ full_name: "", location: "", summary: "" });
  const { patch } = form;
  const { loading: saving, error: saveErr, success: saved, submit } = useSubmit(async () => {
    const { full_name, location, summary } = form.values;
    if (!full_name.trim()) { form.setErrors({ full_name: "Full name is required." }); throw new Error("Validation failed."); }
    await candidateProfile.update({ full_name, location, summary });
    refetch();
    return "Profile saved.";
  });

  useEffect(() => {
    if (profile) patch({ full_name: profile.full_name || "", location: profile.location || "", summary: profile.summary || "" });
  }, [profile, patch]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage message={error} onRetry={refetch} />;

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-title">My Profile</div>
        <div className="page-sub">Visible to recruiters who view your applications</div>
      </div>

      {saveErr && <Alert type="danger">{saveErr}</Alert>}
      {saved && <Alert type="success">{saved}</Alert>}

      <div className="card profile-card" style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent-soft)", border: "1px solid var(--accent-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", flexShrink: 0 }}>
            {(form.values.full_name || "?").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-md)" }}>{form.values.full_name || "Your name"}</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--muted)" }}>{form.values.location || "Location not set"}</div>
          </div>
        </div>

        <Field label="Full name" error={form.errors.full_name}>
          <input
            className={`field-input${form.errors.full_name ? " err" : ""}`}
            value={form.values.full_name}
            onChange={(e) => form.set("full_name", e.target.value)}
            placeholder="Your full name"
          />
        </Field>
        <Field label="Location" optional>
          <input
            className="field-input"
            value={form.values.location}
            onChange={(e) => form.set("location", e.target.value)}
            placeholder="City, Country"
          />
        </Field>
        <Field label="Professional summary" optional hint="Tell recruiters about your experience and what you're looking for.">
          <textarea
            className="field-textarea"
            rows={5}
            value={form.values.summary}
            onChange={(e) => form.set("summary", e.target.value)}
            placeholder="I'm a product designer with 4 years of experience…"
          />
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button type="button" className="btn btn-primary" onClick={submit} disabled={saving}>
            {saving ? <><Spinner size="sm" white />Saving…</> : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
