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
  requester_id?: string | null;
  accepted_by_id?: string | null;
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

  const openRequests = requests.filter((request) => request.status === "OPEN");
  const myAcceptedRequests = requests.filter(
    (request) => request.accepted_by_id === user?.id,
  );
  const myRequests = requests.filter(
    (request) => request.requester_id === user?.id,
  );
  const completedRequests = requests.filter(
    (request) => request.status === "COMPLETED" &&
      (request.requester_id === user?.id || request.accepted_by_id === user?.id),
  );

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
              {user
                ? `Welcome back, ${user.email}.`
                : "Help a neighbour or ask for help when you need it."}
            </p>
          </div>
          <Link className="primary-btn" to="/requests/create">
            + Request help
          </Link>
        </div>

        {error && <div className="notice form-error">{error}</div>}

        <div className="stats">
          <div>
            <span>Open requests</span>
            <strong>{isLoading ? "..." : openRequests.length}</strong>
          </div>
          <div>
            <span>My accepted helps</span>
            <strong>{isLoading ? "..." : myAcceptedRequests.length}</strong>
          </div>
          <div>
            <span>My points</span>
            <strong>{isLoading ? "..." : wallet?.balance_points ?? 0}</strong>
          </div>
        </div>

        <div className="section-head">
          <h2>My activity</h2>
          <Link to="/requests">View all</Link>
        </div>

        {isLoading ? (
          <div className="notice">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="notice">No request activity yet.</div>
        ) : (
          <div className="request-grid">
            {[...myAcceptedRequests, ...myRequests]
              .filter((request, index, all) =>
                all.findIndex((item) => item.id === request.id) === index,
              )
              .slice(0, 4)
              .map((request) => (
                <article className="request-card" key={request.id}>
                  <span className="tag">{request.status}</span>
                  <h3>{request.title}</h3>
                  <p>{request.delivery_location}</p>
                  <p>
                    {request.accepted_by_id === user?.id
                      ? "You are helping"
                      : "Your request"}
                  </p>
                  <Link to={`/requests/details?id=${request.id}`}>
                    View request
                  </Link>
                </article>
              ))}
          </div>
        )}

        {myRequests.length > 0 && (
          <div className="notice">
            You have {myRequests.length} request{myRequests.length === 1 ? "" : "s"} in your activity.
            {completedRequests.length > 0
              ? ` ${completedRequests.length} completed.`
              : ""}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
