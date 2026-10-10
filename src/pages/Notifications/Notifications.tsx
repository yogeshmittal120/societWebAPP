import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function Notifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    setError("");
    try {
      const result = await apiRequest<NotificationItem[]>("/notifications");
      setItems(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const markRead = async (id: string) => {
    setError("");
    try {
      const updated = await apiRequest<NotificationItem>(`/notifications/${id}/read`, {
        method: "POST",
      });
      setItems((current) => current.map((item) => item.id === id ? updated : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update notification");
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <strong>Notifications</strong>
        <nav><Link to="/dashboard">Home</Link><Link to="/requests">Requests</Link></nav>
      </header>
      <section className="page-content">
        <div className="section-head">
          <h1>Notifications</h1>
          <span>{items.filter((item) => !item.is_read).length} unread</span>
        </div>
        {error && <div className="notice form-error" role="alert">{error}</div>}
        {isLoading ? (
          <div className="notice" role="status">Loading notifications...</div>
        ) : items.length === 0 ? (
          <div className="notice">You're all caught up. Updates about requests and appreciation points will appear here.</div>
        ) : (
          items.map((item) => (
            <article className={item.is_read ? "notification" : "notification unread"} key={item.id}>
              <b>{item.title}</b>
              <span>{new Date(item.created_at).toLocaleString()}</span>
              <p>{item.message}</p>
              {!item.is_read && <button className="secondary-btn" type="button" onClick={() => void markRead(item.id)}>Mark as read</button>}
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default Notifications;
