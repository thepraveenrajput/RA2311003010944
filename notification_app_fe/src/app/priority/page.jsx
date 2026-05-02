"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const TYPE_WEIGHT = { Placement: 300, Result: 200, Event: 100 };
const TYPE_STYLE = {
  Placement: { bg: "#e8f5e9", border: "#43a047", badge: "#2e7d32", icon: "💼" },
  Result:    { bg: "#e3f2fd", border: "#1e88e5", badge: "#1565c0", icon: "📊" },
  Event:     { bg: "#fce4ec", border: "#e91e63", badge: "#880e4f", icon: "🎉" },
};

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function scoreNotification(n) {
  return (TYPE_WEIGHT[n.Type] ?? 0) * 1e13 + new Date(n.Timestamp).getTime();
}

export default function PriorityPage() {
  const [topN, setTopN] = useState(10);
  const [inputN, setInputN] = useState("10");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notifications?limit=100`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const ranked = [...(data.notifications || [])]
        .map(n => ({ ...n, _score: scoreNotification(n) }))
        .sort((a, b) => b._score - a._score)
        .slice(0, topN);
      setNotifications(ranked);
    } catch (err) {
      setError("Could not load: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [topN]);

  useEffect(() => { load(); }, [load]);

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#e65100" }}>⭐ Priority Inbox</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#757575" }}>Top notifications by importance</p>
        </div>
        <Link href="/" style={{
          backgroundColor: "#fff", color: "#1a237e",
          padding: "8px 16px", borderRadius: 8,
          textDecoration: "none", fontSize: 13, fontWeight: 700,
          border: "1.5px solid #1a237e",
        }}>← All Notifications</Link>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600 }}>Show top:</label>
        <input type="number" min={1} max={100} value={inputN}
          onChange={e => setInputN(e.target.value)}
          style={{ width: 70, padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 14, textAlign: "center" }}
        />
        <button onClick={() => { const n = parseInt(inputN); if (n > 0 && n <= 100) setTopN(n); }} style={{
          padding: "6px 16px", borderRadius: 8, backgroundColor: "#e65100",
          color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
        }}>Apply</button>
      </div>

      {loading && <div style={{ textAlign: "center", padding: 40, color: "#9e9e9e" }}>Ranking notifications…</div>}
      {error && <div style={{ backgroundColor: "#ffebee", border: "1px solid #ef9a9a", borderRadius: 10, padding: 16, color: "#c62828", fontSize: 14 }}>{error}</div>}
      {!loading && notifications.map((n, i) => {
        const style = TYPE_STYLE[n.Type] || TYPE_STYLE.Event;
        return (
          <div key={n.ID} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: i < 3 ? "#e65100" : "#bdbdbd", minWidth: 28, paddingTop: 18 }}>#{i + 1}</span>
            <div style={{ flex: 1, backgroundColor: style.bg, border: `1.5px solid ${style.border}`, borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{style.icon}</span>
                <span style={{ backgroundColor: style.badge, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, textTransform: "uppercase" }}>{n.Type}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#212121" }}>{n.Message}</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#757575" }}>{timeAgo(n.Timestamp)}</p>
            </div>
          </div>
        );
      })}
    </main>
  );
}