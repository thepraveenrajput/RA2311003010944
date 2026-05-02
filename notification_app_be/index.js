require("dotenv").config();
const { Log } = require("../logging_middleware");

const NOTIFICATIONS_API = "http://20.207.122.201/evaluation-service/notifications";

const TYPE_WEIGHT = {
  Placement: 300,
  Result: 200,
  Event: 100,
};

function timestampScore(timestamp) {
  return new Date(timestamp).getTime();
}

function calculatePriorityScore(notification) {
  const typeScore = TYPE_WEIGHT[notification.Type] ?? 0;
  const recencyScore = timestampScore(notification.Timestamp);
  return typeScore * 1e13 + recencyScore;
}

async function fetchNotifications(token) {
  await Log("backend", "info", "controller", "Fetching notifications from API");

  const response = await fetch(NOTIFICATIONS_API, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    await Log("backend", "error", "controller", `API returned ${response.status}`);
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  await Log("backend", "info", "controller", `Got ${data.notifications.length} notifications`);
  return data.notifications;
}

async function getPriorityInbox(token, topN = 10) {
  await Log("backend", "info", "domain", `Getting top ${topN} notifications`);

  const notifications = await fetchNotifications(token);

  const scored = notifications.map((notif) => ({
    ...notif,
    _priorityScore: calculatePriorityScore(notif),
  }));

  scored.sort((a, b) => b._priorityScore - a._priorityScore);

  return scored.slice(0, topN);
}

function updatePriorityInbox(currentTop, newNotif, topN = 10) {
  const scored = { ...newNotif, _priorityScore: calculatePriorityScore(newNotif) };

  if (currentTop.length < topN) {
    return [...currentTop, scored].sort((a, b) => b._priorityScore - a._priorityScore);
  }

  const lowestScore = currentTop[currentTop.length - 1]._priorityScore;

  if (scored._priorityScore > lowestScore) {
    return [...currentTop.slice(0, topN - 1), scored].sort(
      (a, b) => b._priorityScore - a._priorityScore
    );
  }

  return currentTop;
}

(async () => {
  const token = process.env.AUTH_TOKEN;
  if (!token) {
    console.error("AUTH_TOKEN not found in .env file");
    process.exit(1);
  }

  try {
    console.log("Fetching notifications...");
    const top10 = await getPriorityInbox(token, 10);
    console.log("\n===== TOP 10 PRIORITY NOTIFICATIONS =====\n");
    top10.forEach((n, i) => {
      console.log(`#${i + 1} [${n.Type}] ${n.Message}  |  ${n.Timestamp}`);
    });

    const incoming = {
      ID: "test-001",
      Type: "Placement",
      Message: "Google hiring — urgent deadline",
      Timestamp: new Date().toISOString(),
    };

    const updated = updatePriorityInbox(top10, incoming, 10);
    console.log("\n===== AFTER NEW PLACEMENT NOTIFICATION =====\n");
    updated.forEach((n, i) => {
      console.log(`#${i + 1} [${n.Type}] ${n.Message}`);
    });
  } catch (err) {
    console.error("Error:", err.message);
  }
})();

module.exports = { getPriorityInbox, updatePriorityInbox, calculatePriorityScore };