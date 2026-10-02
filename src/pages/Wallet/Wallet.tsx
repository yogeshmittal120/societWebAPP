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
        setError(err instanceof Error ? err.message : "Unable to load wallet"),
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="app-shell">
      <header className="topbar">
        <strong>My wallet</strong>
        <nav>
          <Link to="/dashboard">Home</Link>
          <Link to="/requests">Requests</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

      <section className="page-content">
        {error && <div className="notice form-error">{error}</div>}

        <div className="wallet-hero">
          <p>Available points</p>
          <strong>{isLoading ? "..." : wallet?.balance_points ?? 0}</strong>
          <span>Reward points earned from helping neighbours</span>
        </div>

        <div className="section-head">
          <h2>Recent activity</h2>
        </div>

        {isLoading ? (
          <div className="notice">Loading wallet...</div>
        ) : transactions.length === 0 ? (
          <div className="notice">No point transactions yet.</div>
        ) : (
          <div className="transaction-list">
            {transactions.map((transaction) => (
              <div className="transaction" key={transaction.id}>
                <div>
                  <strong>{transaction.description}</strong>
                  <span>{new Date(transaction.created_at).toLocaleString()}</span>
                </div>
                <b>
                  {transaction.type === "EARN" ? "+" : "-"}
                  {transaction.points}
                </b>
              </div>
            ))}
          </div>
        )}

        <div className="notice">
          Redemption will be enabled after the reward and redemption rules are finalized.
        </div>
      </section>
    </main>
  );
}

export default Wallet;
