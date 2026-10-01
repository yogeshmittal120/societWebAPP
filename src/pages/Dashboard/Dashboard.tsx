import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import type { AuthUser } from "../../types/auth";

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  delivery_location: string;
  status: string;
  created_at?: string;
}

interface Wallet {
  user_id: string;
  balance_points: number;
}

function Dashboard() {
  const { user, setUser } = useAuth();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");

        const [me, walletData, requestData] = await Promise.all([
          apiRequest<AuthUser>("/users/me"),
          apiRequest<Wallet>("/wallet"),
          apiRequest<HelpRequest[]>("/help-requests"),
        ]);

        setUser(me);
        setWallet(walletData);
        setRequests(requestData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [setUser]);

  const availableRequests = requests.length;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-inline">
          <span className="brand-mark small">S</span>
          <strong>SocietWebAPP</strong>
        </div>
        <nav>
          <Link to="/requests">Requests</Link>
          <Link to="/wallet">Wallet</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

      <section className="dashboard">
        <div className="hero">
          <div>
            <p className="eyebrow">YOUR SOCIETY</p>
            <h1>Good morning 👋</h1>
            <p>
              {user ? `Welcome back, ${user.email}.` : "Help a neighbour or ask for help when you need it."}
            </p>
          </div>
          <Link className="primary-btn" to="/requests/create">+ Request help</Link>
        </div>

        {error && <div className="notice form-error">{error}</div>}

        <div className="stats">
          <div>
            <span>Available requests</span>
            <strong>{isLoading ? "..." : availableRequests}</strong>
          </div>
          <div>
            <span>My points</span>
            <strong>{isLoading ? "..." : wallet?.balance_points ?? 0}</strong>
          </div>
          <div>
            <span>Completed helps</span>
            <strong>—</strong>
          </div>
        </div>

        <div className="section-head">
          <h2>Nearby requests</h2>
          <Link to="/requests">View all</Link>
        </div>

        {isLoading ? (
          <div className="notice">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="notice">No open help requests in your society right now.</div>
        ) : (
          <div className="request-grid">
            {requests.slice(0, 4).map((request) => (
              <article className="request-card" key={request.id}>
                <span className="tag">{request.status}</span>
                <h3>{request.title}</h3>
                <p>{request.delivery_location}</p>
                <p>{request.description}</p>
                <Link to={`/requests/details?id=${request.id}`}>View request</Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
