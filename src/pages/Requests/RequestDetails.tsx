import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../api/client";

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  pickup_location?: string | null;
  delivery_location: string;
  status: string;
  created_at: string;
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

function RequestDetails() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id");

  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [error, setError] = useState("");

  const loadRequest = async () => {
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
  };

  useEffect(() => {
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
        current ? { ...current, status: result.status } : current,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to accept request",
      );
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
                  <strong>
                    {new Date(request.created_at).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="notice">
                Your personal contact details stay private. Communication can
                be handled inside the app.
              </div>

              {request.status === "OPEN" && (
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

              {request.status === "ACCEPTED" && (
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

              {request.status === "DELIVERED" && (
                <div className="notice">
                  Delivery marked successfully. Waiting for the requester to
                  confirm completion.
                </div>
              )}
            </>
          )}
        </article>
      </section>
    </main>
  );
}

export default RequestDetails;
