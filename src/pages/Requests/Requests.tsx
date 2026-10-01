import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  delivery_location: string;
  status: string;
  created_at?: string;
}

function Requests() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<HelpRequest[]>("/help-requests")
      .then(setRequests)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load requests"))
      .finally(() => setIsLoading(false));
  }, []);

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand-inline"><span className="brand-mark small">S</span><strong>Help requests</strong></div>
      <Link className="primary-btn compact" to="/requests/create">+ Request help</Link>
    </header>
    <section className="page-content">
      <div className="section-head">
        <div><p className="eyebrow">SOCIETY NETWORK</p><h1>Requests around you</h1><p>Help neighbours with everyday needs.</p></div>
      </div>
      <div className="filter-row"><button className="filter active">Open</button></div>
      {error && <div className="notice form-error">{error}</div>}
      {isLoading ? <div className="notice">Loading requests...</div> :
        requests.length === 0 ? <div className="notice">No open help requests right now.</div> :
        <div className="request-list">{requests.map((request)=>
          <article className="list-card" key={request.id}>
            <div><span className="tag">{request.status}</span><h3>{request.title}</h3><p>{request.delivery_location}</p></div>
            <div className="list-action"><strong>Reward after completion</strong><Link to={`/requests/details?id=${request.id}`}>View</Link></div>
          </article>
        )}</div>}
    </section>
  </main>;
}
export default Requests;