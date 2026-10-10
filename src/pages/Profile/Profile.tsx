import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";

interface ResidentProfile {
  id: string;
  full_name: string | null;
  email: string;
  society_id: string;
  society_name: string | null;
  role: string;
  created_at: string;
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "R"
  );
}

function Profile() {
  const [profile, setProfile] = useState<ResidentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<ResidentProfile>("/users/me")
      .then(setProfile)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load profile"),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const displayName = profile?.full_name?.trim() || "Resident";

  return (
    <main className="app-shell">
      <header className="topbar">
        <strong>My profile</strong>
        <nav>
          <Link to="/dashboard">Home</Link>
          <Link to="/requests">Requests</Link>
          <Link to="/wallet">Appreciation points</Link>
        </nav>
      </header>
      <section className="profile-page">
        <div className="profile-card">
          {isLoading ? (
            <p role="status">Loading your profile...</p>
          ) : error ? (
            <p className="form-error" role="alert">{error}</p>
          ) : profile ? (
            <>
              <div className="avatar" aria-hidden="true">{getInitials(displayName)}</div>
              <h1>{displayName}</h1>
              <p>Resident{profile.society_name ? ` • ${profile.society_name}` : ""}</p>
              <div className="profile-row"><span>Email</span><strong>{profile.email}</strong></div>
              <div className="profile-row"><span>Society</span><strong>{profile.society_name || "Not available"}</strong></div>
              <div className="profile-row"><span>Role</span><strong>{profile.role.replace(/\b\w/g, (letter) => letter.toUpperCase())}</strong></div>
              <div className="profile-row"><span>Member since</span><strong>{new Date(profile.created_at).toLocaleDateString()}</strong></div>
            </>
          ) : null}
        </div>
        <div className="safety-card">
          <h2>Privacy &amp; safety</h2>
          <p>Keep personal information private and report anything that feels unsafe or inappropriate.</p>
          <Link to="/report">Report an issue</Link>
        </div>
      </section>
    </main>
  );
}

export default Profile;
