import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";

interface Wallet {
  balance_points: number;
}

interface Transaction {
  id: string;
  type: string;
  points: number;
  help_request_id?: string | null;
  description: string;
  created_at: string;
}

function Wallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiRequest<Wallet>("/wallet"),
      apiRequest<Transaction[]>("/wallet/transactions"),
    ])
      .then(([walletData, transactionData]) => {
        setWallet(walletData);
        setTransactions(transactionData);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load appreciation points"),
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="app-shell">
      <header className="topbar">
        <strong>Appreciation points</strong>
        <nav>
          <Link to="/dashboard">Home</Link>
          <Link to="/requests">Requests</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

      <section className="page-content">
        {error && <div className="notice form-error" role="alert">{error}</div>}

        <div className="wallet-hero">
          <p>Your appreciation points</p>
          <strong>{isLoading ? "..." : wallet?.balance_points ?? 0}</strong>
          <span>Points residents have awarded to thank you for helping neighbours.</span>
        </div>

        <div className="section-head">
          <h2>Appreciation history</h2>
        </div>

        {isLoading ? (
          <div className="notice" role="status">Loading appreciation history...</div>
        ) : transactions.length === 0 ? (
          <div className="notice">No appreciation points yet. Help a neighbour and they may choose to thank you with points.</div>
        ) : (
          <div className="transaction-list">
            {transactions.map((transaction) => (
              <div className="transaction" key={transaction.id}>
                <div>
                  <strong>{transaction.description || "Appreciation points"}</strong>
                  <span>{new Date(transaction.created_at).toLocaleString()}</span>
                </div>
                <b>
                  {transaction.type === "EARN" ? "+" : "-"}
                  {transaction.points} pts
                </b>
              </div>
            ))}
          </div>
        )}

        <div className="notice">
          Appreciation points are free, optional recognition only. They are not money, cannot be purchased, and cannot be redeemed for cash. Actual item expenses are paid separately.
        </div>
      </section>
    </main>
  );
}

export default Wallet;
