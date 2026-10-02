import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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

function RequestDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestId = searchParams.get("id");

  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequest() {
      if (!requestId) {
        setError("Request ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const requests = await apiRequest<HelpRequest[]>("/help-requests");
        const found = requests.find((item) => item.id === requestId);

        if (!found) {
          setError("This request is no longer open or could not be found.");
        } else {
          setRequest(found);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load request",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadRequest();
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
                  <button
                    className="primary-btn"
                    type="button"
                    onClick={() => navigate("/requests")}
                  >
                    Request accepted
                  </button>
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
