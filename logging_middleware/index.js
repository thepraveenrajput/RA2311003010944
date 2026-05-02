const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

async function Log(stack, level, package_name, message) {
  const token = process.env.AUTH_TOKEN || "";

  try {
    await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: package_name,
        message,
      }),
    });
  } catch (err) {
    // silently ignore log failures
  }
}

module.exports = { Log };