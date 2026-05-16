interface Props {
  onRefresh: () => void;
  loading: boolean;
}

export function Header({ onRefresh, loading }: Props) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo">
          <span className="logo-icon">🔔</span>
        </div>
        <div>
          <h1 className="header-title">NotifyHub</h1>
          <p className="header-subtitle">Notification Management Dashboard</p>
        </div>
      </div>
      <button
        id="refresh-btn"
        className={`btn btn-ghost ${loading ? "loading" : ""}`}
        onClick={onRefresh}
        disabled={loading}
        aria-label="Refresh notifications"
      >
        <span className="refresh-icon">⟳</span>
        {loading ? "Refreshing…" : "Refresh"}
      </button>
    </header>
  );
}
