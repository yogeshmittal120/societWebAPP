import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest, apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import type { AuthUser } from "../../types/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = await loginRequest(email, password);
      localStorage.setItem("access_token", token.access_token);

      const user = await apiRequest<AuthUser>("/users/me");
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      localStorage.removeItem("access_token");
      setError(err instanceof Error ? err.message : "Unable to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-brand">
          <span className="brand-mark">S</span>
          <div><h1 id="login-title">SocietWebAPP</h1><p>Connect. Help. Earn.</p></div>
        </div>
        <div className="auth-heading">
          <h2>Welcome back</h2>
          <p>Sign in to your society community.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={isLoading}>{isLoading ? "Signing in..." : "Login"}</button>
        </form>
        <p className="auth-footer">New to your society network? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
}

export default Login;
