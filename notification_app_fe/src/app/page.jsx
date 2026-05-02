"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const TYPES = ["All", "Placement", "Result", "Event"];
const PAGE_SIZE = 10;

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

function NotificationCard({ notification }) {
  const { Type, Message, Timestamp, ID } = notification;
  const style = TYPE_STYLE[Type] || TYPE_STYLE.Event;
  const [read, setRead] = useState(false);

  useEffect(() => {
    const readSet = JSON.parse(sessionStorage.getItem("readNotifications") || "[]");
    setRead(readSet.includes(ID));
  }, [ID]);

  function markAsRead() {
    const readSet = JSON.parse(sessionStorage.getItem("readNotifications") || "[]");
    if (!readSet.includes(ID)) {
      readSet.push(ID);
      sessionStorage.setItem("readNotifications", JSON.stringify(readSet));
    }
    setRead(true);
  }

  return (
    <div onClick={markAsRead} style={{
      backgroundColor: read ? "#fafafa" : style.bg,
      border: `1.5px solid ${read ? "#e0e0e0" : style.border}`,
      borderRadius: 12, padding: "16px 18px", marginBottom: 10,
      cursor: "pointer", opacity: read ? 0.7 : 1,
      position: "relative", transition: "all 0.2s",
    }}>
      {!read && <span style={{
        position: "absolute", top: 14, right: 14,
        width: 9, height: 9, borderRadius: "50%",
        backgroundColor: style.border, display: "inline-block",
      }} />}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 18 }}>{style.icon}</span>
        <span style={{
          backgroundColor: style.badge, color: "#fff",
          fontSize: 11, fontWeight: 700, padding: "2px 10px",
          borderRadius: 20, textTransform: "uppercase",
        }}>{Type}</span>
      </div>
      <p style={{ margin: 0, fontSize: 14, fontWeight: read ? 400 : 600, color: "#212121" }}>{Message}</p>
      <p style={{ margin: "4px 0 0", fontSize: 12, color: "#757575" }}>{timeAgo(Timestamp)}</p>
    </div>
  );
}

export default function HomePage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      query.set("limit", PAGE_SIZE);
      query.set("page", page);
      if (filter !== "All") query.set("notification_type", filter);
      const res = await fetch(`/api/notifications?${query.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      setError("Could not load notifications: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1a237e" }}>📬 Notifications</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#757575" }}>All campus updates</p>
        </div>
        <Link href="/priority" style={{
          backgroundColor: "#1a237e", color: "#fff",
          padding: "8px 16px", borderRadius: 8,
          textDecoration: "none", fontSize: 13, fontWeight: 700,
        }}>⭐ Priority Inbox</Link>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => { setFilter(t); setPage(1); }} style={{
            padding: "6px 16px", borderRadius: 20, border: "1.5px solid",
            borderColor: filter === t ? "#1a237e" : "#e0e0e0",
            backgroundColor: filter === t ? "#1a237e" : "#fff",
            color: filter === t ? "#fff" : "#424242",
            fontWeight: filter === t ? 700 : 400, fontSize: 13, cursor: "pointer",
          }}>{t}</button>
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", padding: 40, color: "#9e9e9e" }}>Loading…</div>}
      {error && <div style={{ backgroundColor: "#ffebee", border: "1px solid #ef9a9a", borderRadius: 10, padding: 16, color: "#c62828", fontSize: 14 }}>{error}</div>}
      {!loading && !error && notifications.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#9e9e9e" }}>No notifications found.</div>}
      {!loading && notifications.map(n => <NotificationCard key={n.ID} notification={n} />)}

      {!loading && !error && (
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{
            padding: "8px 20px", borderRadius: 8, border: "1.5px solid #e0e0e0",
            backgroundColor: page === 1 ? "#f5f5f5" : "#fff",
            cursor: page === 1 ? "not-allowed" : "pointer",
            color: page === 1 ? "#bdbdbd" : "#424242", fontWeight: 600,
          }}>← Prev</button>
          <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: "#757575" }}>Page {page}</span>
          <button disabled={notifications.length < PAGE_SIZE} onClick={() => setPage(p => p + 1)} style={{
            padding: "8px 20px", borderRadius: 8, border: "1.5px solid #e0e0e0",
            backgroundColor: notifications.length < PAGE_SIZE ? "#f5f5f5" : "#fff",
            cursor: notifications.length < PAGE_SIZE ? "not-allowed" : "pointer",
            color: notifications.length < PAGE_SIZE ? "#bdbdbd" : "#424242", fontWeight: 600,
          }}>Next →</button>
        </div>
      )}
    </main>
  );
}