const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";
const NOTIFICATIONS_URL = "http://20.207.122.201/evaluation-service/notifications";

async function getAuthToken() {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      
        "email": "ps9395@srmist.edu.in",
        "name": "praveen kumar singh",
        "rollNo": "ra2311003010944",
        "accessCode": "QkbpxH",
        "clientID": "8122bf6c-17dc-4102-b302-e15a39a97f96",
        "clientSecret": "DjRxfaaKEMyqpHeG"
      
    }),
  });

  if (!res.ok) {
    throw new Error(`Auth request failed with status ${res.status}`);
  }

  const data = await res.json();
  if (!data?.access_token) {
    throw new Error("Auth response did not contain an access_token");
  }

  return data.access_token;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams();

  ["limit", "page", "notification_type"].forEach((key) => {
    const value = searchParams.get(key);
    if (value) query.set(key, value);
  });

  const token = await getAuthToken();
  const response = await fetch(`${NOTIFICATIONS_URL}?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
