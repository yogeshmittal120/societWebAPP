import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/client";

interface RegisterResponse {
  user_id: string;
  email: string;
  society_id: string;
  role: string;
}

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
          invite_code: inviteCode.trim(),
        }),
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="register-title">
        <div className="auth-brand">
          <span className="brand-mark">S</span>
          <div>
            <h1 id="register-title">SocietWebAPP</h1>
            <p>Connect. Help. Earn.</p>
          </div>
        </div>

        <div className="auth-heading">
          <h2>Create account</h2>
          <p>Join your society community.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" type="text" autoComplete="name" placeholder="Enter your name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />

          <label htmlFor="register-email">Email</label>
          <input id="register-email" type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="register-password">Password</label>
          <input id="register-password" type="password" autoComplete="new-password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />

          <label htmlFor="invite-code">Society invite code</label>
          <input id="invite-code" type="text" placeholder="Enter invite code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} required />

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
