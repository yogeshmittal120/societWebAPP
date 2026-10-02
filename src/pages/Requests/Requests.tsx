import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

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

function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<HelpRequest[]>("/help-requests")
      .then(setRequests)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load requests"),
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-inline">
          <span className="brand-mark small">S</span>
          <strong>Help requests</strong>
        </div>
        <Link className="primary-btn compact" to="/requests/create">
          + Request help
        </Link>
      </header>

      <section className="page-content">
        <div className="section-head">
          <div>
            <p className="eyebrow">SOCIETY NETWORK</p>
            <h1>Requests around you</h1>
            <p>Help neighbours with everyday needs.</p>
          </div>
        </div>

        {error && <div className="notice form-error">{error}</div>}

        {isLoading ? (
          <div className="notice">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="notice">No relevant help requests right now.</div>
        ) : (
          <div className="request-list">
            {requests.map((request) => {
              const isMyRequest = request.requester_id === user?.id;
              const isMyAcceptedRequest = request.accepted_by_id === user?.id;

              return (
                <article className="list-card" key={request.id}>
                  <div>
                    <span className="tag">{request.status}</span>
                    <h3>{request.title}</h3>
                    <p>{request.delivery_location}</p>
                    <small>
                      {isMyRequest
                        ? "Your request"
                        : isMyAcceptedRequest
                          ? "You are helping"
                          : "Available to help"}
                    </small>
                  </div>

                  <div className="list-action">
                    <strong>
                      {request.status === "OPEN"
                        ? "Reward after completion"
                        : request.status === "ACCEPTED"
                          ? isMyAcceptedRequest
                            ? "Ready for delivery"
                            : "Waiting for delivery"
                          : request.status === "DELIVERED"
                            ? isMyRequest
                              ? "Action required"
                              : "Delivered"
                            : "Completed"}
                    </strong>
                    <Link to={`/requests/details?id=${request.id}`}>View</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Requests;
