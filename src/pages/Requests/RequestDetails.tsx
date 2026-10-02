import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  pickup_location?: string | null;
  delivery_location: string;
  status: string;
  created_at: string;
  requester_id?: string | null;
  accepted_by_id?: string | null;
}

interface AcceptResponse {
  request_id: string;
  status: string;
  accepted_by_id: string;
  accepted_at: string;
}

interface DeliverResponse {
  request_id: string;
  status: string;
  delivered_at: string;
}

interface CompleteResponse {
  request_id: string;
  status: string;
  completed_at: string;
}

function RequestDetails() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id");
  const { user } = useAuth();

  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequest() {
      if (!requestId) {
        setError("Request ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");
        const data = await apiRequest<HelpRequest>(
          `/help-requests/${requestId}`,
        );
        setRequest(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load request");
      } finally {
        setIsLoading(false);
      }
    }

    void loadRequest();
  }, [requestId]);

  const handleAccept = async () => {
    if (!requestId) return;
    setError("");
    setIsAccepting(true);

    try {
      const result = await apiRequest<AcceptResponse>(
        `/help-requests/${requestId}/accept`,
        { method: "POST" },
      );
      setRequest((current) =>
        current
          ? { ...current, status: result.status, accepted_by_id: result.accepted_by_id }
          : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to accept request");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeliver = async () => {
    if (!requestId) return;
    setError("");
    setIsDelivering(true);

    try {
      const result = await apiRequest<DeliverResponse>(
        `/help-requests/${requestId}/deliver`,
        { method: "POST" },
      );
      setRequest((current) =>
        current ? { ...current, status: result.status } : current,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to mark request delivered",
      );
    } finally {
      setIsDelivering(false);
    }
  };

  const handleComplete = async () => {
    if (!requestId) return;
    setError("");
    setIsCompleting(true);

    try {
      const result = await apiRequest<CompleteResponse>(
        `/help-requests/${requestId}/complete`,
        { method: "POST" },
      );
      setRequest((current) =>
        current ? { ...current, status: result.status } : current,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to confirm completion",
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const isRequester = request?.requester_id === user?.id;
  const isHelper = request?.accepted_by_id === user?.id;

  return (
    <main className="app-shell">
      <header className="topbar">
        <strong>Request details</strong>
        <Link to="/requests">Back</Link>
      </header>

      <section className="detail-page">
        <article className="detail-card">
          {isLoading && <p>Loading request...</p>}
          {!isLoading && error && <p className="form-error">{error}</p>}

          {!isLoading && request && (
            <>
              <span className="tag">{request.status}</span>
              <h1>{request.title}</h1>
              <p>{request.description}</p>

              <div className="detail-meta">
                <div>
                  <span>Pickup</span>
                  <strong>{request.pickup_location || "Not specified"}</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>{request.delivery_location}</strong>
                </div>
                <div>
                  <span>Posted</span>
                  <strong>{new Date(request.created_at).toLocaleString()}</strong>
                </div>
              </div>

              <div className="notice">
                Your personal contact details stay private. Communication can
                be handled inside the app.
              </div>

              {request.status === "OPEN" && !isRequester && (
                <div className="form-actions">
                  <Link to="/requests">Go back</Link>
                  <button
                    className="primary-btn"
                    type="button"
                    onClick={handleAccept}
                    disabled={isAccepting}
                  >
                    {isAccepting ? "Accepting..." : "Accept request"}
                  </button>
                </div>
              )}

              {request.status === "OPEN" && isRequester && (
                <div className="notice">This is your request. Waiting for a resident to accept it.</div>
              )}

              {request.status === "ACCEPTED" && isHelper && (
                <div className="form-actions">
                  <Link to="/requests">Go back</Link>
                  <button
                    className="primary-btn"
                    type="button"
                    onClick={handleDeliver}
                    disabled={isDelivering}
                  >
                    {isDelivering ? "Updating..." : "Mark as Delivered"}
                  </button>
                </div>
              )}

              {request.status === "ACCEPTED" && isRequester && (
                <div className="notice">A resident has accepted your request and is handling the delivery.</div>
              )}

              {request.status === "DELIVERED" && isRequester && (
                <div className="form-actions">
                  <Link to="/requests">Back</Link>
                  <button
                    className="primary-btn"
                    type="button"
                    onClick={handleComplete}
                    disabled={isCompleting}
                  >
                    {isCompleting ? "Confirming..." : "Confirm Completion"}
                  </button>
                </div>
              )}

              {request.status === "DELIVERED" && isHelper && (
                <div className="notice">Delivery marked. Waiting for the requester to confirm completion.</div>
              )}

              {request.status === "COMPLETED" && (
                <div className="notice">Request completed successfully.</div>
              )}
            </>
          )}
        </article>
      </section>
    </main>
  );
}

export default RequestDetails;
