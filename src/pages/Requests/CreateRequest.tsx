import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/client";

interface CreateHelpRequestResponse {
  id: string;
  title: string;
  description: string;
  pickup_location: string | null;
  delivery_location: string;
  status: string;
  created_at: string;
}

function CreateRequest() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiRequest<CreateHelpRequestResponse>("/help-requests", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          pickup_location: pickupLocation || null,
          delivery_location: deliveryLocation,
        }),
      });

      navigate("/requests");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create help request",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <strong>Create help request</strong>
        <Link to="/requests">Cancel</Link>
      </header>

      <section className="form-page">
        <div className="form-card">
          <p className="eyebrow">ASK YOUR COMMUNITY</p>
          <h1>What do you need?</h1>
          <p>Share only the information needed to complete the request.</p>

          <form className="wide-form" onSubmit={handleSubmit}>
            <label>
              Request title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Grocery pickup"
                required
                minLength={3}
                maxLength={200}
              />
            </label>

            <label>
              Description
              <textarea
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tell your neighbour what you need..."
                required
                maxLength={2000}
              />
            </label>

            <label>
              Pickup location
              <input
                value={pickupLocation}
                onChange={(event) => setPickupLocation(event.target.value)}
                placeholder="Store or pickup point"
                maxLength={500}
              />
            </label>

            <label>
              Delivery location
              <input
                value={deliveryLocation}
                onChange={(event) => setDeliveryLocation(event.target.value)}
                placeholder="Your tower / flat area"
                required
                maxLength={500}
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
              <Link to="/requests">Cancel</Link>
              <button className="primary-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Posting..." : "Post request"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default CreateRequest;
