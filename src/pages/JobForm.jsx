import { useEffect } from "react";
import { jobs, companyProfile } from "../api.js";
import { Alert, Field, LoadingPage, Spinner } from "../shared.jsx";
import { useAsync } from "../useAsync.js";
import { JOB_TYPES, CURRENCIES } from "./constants.js";
import { useForm, useSubmit } from "./hooks.js";
import { salaryStepForCurrency, parseSalaryNumber, validateSalaryMinMax } from "./salary.js";

const JOB_INIT = {
  title: "", description: "", location: "", type: "Full-time",
  min_salary: "", max_salary: "", currency: "USD",
  responsibilities: "", qualifications: "",
};

export function JobForm({ editJob, navigateTo }) {
  const form = useForm(JOB_INIT);
  const { patch } = form;
  const { loading, error, success, submit } = useSubmit(async () => {
    if (!form.values.title.trim()) { form.setErrors({ title: "Job title is required." }); throw new Error("Validation failed."); }
    const rangeErr = validateSalaryMinMax(form.values.min_salary, form.values.max_salary);
    if (rangeErr) {
      form.setErrors({ max_salary: rangeErr });
      throw new Error("Validation failed.");
    }
    const minVal = parseSalaryNumber(form.values.min_salary);
    const maxVal = parseSalaryNumber(form.values.max_salary);
    const payload = {
      title:                   form.values.title,
      description:             form.values.description,
      responsibilities:        form.values.responsibilities,
      required_qualifications: form.values.qualifications,
      salary_min:              minVal ?? 0,
      salary_max:              maxVal,
      currency:                form.values.currency,
      location:                form.values.location,
      job_type:                form.values.type,
    };
    if (editJob) await jobs.update(editJob.id, payload);
    else await jobs.create(payload);
    setTimeout(() => navigateTo("jobs-mine"), 1400);
    return editJob ? "Job updated." : "Job posted!";
  });

  const { data: company, loading: companyLoading } = useAsync(() => companyProfile.getOwn(), []);

  useEffect(() => {
    if (!editJob) {
      patch(JOB_INIT);
      return;
    }
    patch({
      title:            editJob.title || "",
      description:      editJob.description || "",
      location:         editJob.location || "",
      type:             editJob.job_type || editJob.type || "Full-time",
      min_salary:       editJob.min_salary ?? editJob.salary_min ?? "",
      max_salary:       editJob.max_salary ?? editJob.salary_max ?? "",
      currency:         editJob.currency || "USD",
      responsibilities: editJob.responsibilities || "",
      qualifications:   editJob.qualifications || editJob.required_qualifications || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync form when job id changes, not on every editJob reference change
  }, [editJob?.id, patch]);

  const step = salaryStepForCurrency(form.values.currency);

  function setSalaryField(key, raw) {
    if (raw === "") { form.set(key, ""); return; }
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    form.set(key, String(Math.max(0, n)));
  }

  if (companyLoading) return <LoadingPage />;

  if (company && company.verification_status !== "verified") {
    return (
      <div className="page-enter">
        <div className="page-header">
          <div className="page-title">Post a Job</div>
        </div>
        <div className="card" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center", padding: "3rem 2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>
            Verification required
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Your company needs to be verified before you can post jobs. Upload your business registration document in Company Profile — our team reviews within 2–3 business days.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => navigateTo("company")}>
            Go to Company Profile →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="page-header-row">
        <div>
          <div className="page-title">{editJob ? "Edit Job" : "Post a Job"}</div>
          <div className="page-sub">{editJob ? "Update listing details" : "Fill in the details to attract great candidates"}</div>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => navigateTo("jobs-mine")}>← Back</button>
      </div>

      {error && <Alert type="danger">{error}</Alert>}
      {success && <Alert type="success">{success} Redirecting…</Alert>}

      <div className="card form-card" style={{ maxWidth: 680, margin: "0 auto" }}>
        <Field label="Job title" error={form.errors.title}>
          <input
            className={`field-input${form.errors.title ? " err" : ""}`}
            value={form.values.title}
            onChange={(e) => form.set("title", e.target.value)}
            placeholder="e.g. Senior Product Designer"
          />
        </Field>

        <div className="field-row-2">
          <Field label="Location">
            <input
              className="field-input"
              value={form.values.location}
              onChange={(e) => form.set("location", e.target.value)}
              placeholder="City or Remote"
            />
          </Field>
          <Field label="Job type">
            <select className="field-select" value={form.values.type} onChange={(e) => form.set("type", e.target.value)}>
              {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>

        <div className="field-row-3">
          <Field label="Min salary">
            <input
              className="field-input"
              type="number"
              value={form.values.min_salary}
              min={0}
              step={step}
              onChange={(e) => setSalaryField("min_salary", e.target.value)}
              placeholder="50000"
            />
          </Field>
          <Field label="Max salary" error={form.errors.max_salary}>
            <input
              className={`field-input${form.errors.max_salary ? " err" : ""}`}
              type="number"
              value={form.values.max_salary}
              min={0}
              step={step}
              onChange={(e) => setSalaryField("max_salary", e.target.value)}
              placeholder="100000"
            />
          </Field>
          <Field label="Currency">
            <select className="field-select" value={form.values.currency} onChange={(e) => form.set("currency", e.target.value)}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Job description">
          <textarea
            className="field-textarea"
            rows={4}
            value={form.values.description}
            onChange={(e) => form.set("description", e.target.value)}
            placeholder="Overview of the role, team, and mission…"
          />
        </Field>

        <Field label="Responsibilities" optional>
          <textarea
            className="field-textarea"
            rows={4}
            value={form.values.responsibilities}
            onChange={(e) => form.set("responsibilities", e.target.value)}
            placeholder="Key day-to-day responsibilities…"
          />
        </Field>

        <Field label="Qualifications & requirements" optional>
          <textarea
            className="field-textarea"
            rows={4}
            value={form.values.qualifications}
            onChange={(e) => form.set("qualifications", e.target.value)}
            placeholder="Skills, education, certifications required…"
          />
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigateTo("jobs-mine")}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={submit} disabled={loading || !!success}>
            {loading ? <><Spinner size="sm" white />{editJob ? "Saving…" : "Posting…"}</> : editJob ? "Save changes" : "Post job →"}
          </button>
        </div>
      </div>
    </div>
  );
}
