export async function authFetch(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    alert("No access token found. Please log in first.");
    window.location.href = "../login/login.html";
    return { status: 401, data: null };
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => null);

    if (res.status === 401) {
      alert("Session expired or invalid token. Please log in again.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "../login/login.html";
    }

    return { status: res.status, data };
  } catch (err) {
    console.error("Fetch Error:", err);
    alert("Cannot connect to server. Please try again later.");
    return { status: res.status, data: null };
  }
}
