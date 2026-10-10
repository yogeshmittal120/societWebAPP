import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";

type ReportReason = "Safety concern" | "Request dispute" | "Harassment or abuse" | "Other";

interface ReportResponse {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
}

function Report() {
  const [reason, setReason] = useState<ReportReason>("Safety concern");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const report = await apiRequest<ReportResponse>("/reports", {
        method: "POST",
        body: JSON.stringify({ reason, description: details.trim() || null }),
      });
      setSuccess(`Report submitted successfully. Reference: ${report.id}. Status: ${report.status}.`);
      setDetails("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <strong>Safety &amp; report</strong>
        <Link to="/profile">Back to profile</Link>
      </header>
      <section className="form-page">
        <div className="form-card">
          <p className="eyebrow">SAFETY FIRST</p>
          <h1>Report an issue</h1>
          <p>Tell us what happened. Avoid sharing passwords, payment details, or unnecessary personal information.</p>
          <form className="wide-form" onSubmit={handleSubmit}>
            <label>
              Issue type
              <select value={reason} onChange={(event) => setReason(event.target.value as ReportReason)}>
                <option>Safety concern</option>
                <option>Request dispute</option>
                <option>Harassment or abuse</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Details
              <textarea rows={6} maxLength={5000} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Describe the issue..." />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            {success && <p className="form-success" role="status">{success}</p>}
            <div className="form-actions">
              <Link to="/profile">Cancel</Link>
              <button className="primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit report"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Report;
