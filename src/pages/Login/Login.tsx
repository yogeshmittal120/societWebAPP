import { useState, type FormEvent } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Login submitted", { email, password });
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-brand">
          <span className="brand-mark">S</span>
          <div>
            <h1 id="login-title">SocietWebAPP</h1>
            <p>Connect. Help. Earn.</p>
          </div>
        </div>
        <div className="auth-heading">
          <h2>Welcome back</h2>
          <p>Sign in to your society community.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button type="submit">Login</button>
        </form>
        <p className="auth-footer">New to your society network? Registration will be available next.</p>
      </section>
    </main>
  );
}

export default Login;
