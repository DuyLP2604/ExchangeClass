import { server_url } from "./apiconfig.js";

export async function wakeupServer() {
  const serverStatus = document.getElementById("serverStatus");

  try {
    const res = await fetch(server_url, { cache: "no-store" });
    if (res.ok) {
      serverStatus.textContent = "Server is ready!";
      serverStatus.classList.remove("loading");
      serverStatus.classList.add("ready");
      return;
    }
  } catch (err) {
    console.log("Server is not ready, waking up...");
  }

  serverStatus.textContent = "Waking up server";
  serverStatus.classList.add("loading");
  serverStatus.classList.remove("ready");

  try {
    await fetch("https://exchangeslot-api-testing.onrender.com", { cache: "no-store" });

    const res2 = await fetch(server_url);
    const data = await res2.text();
    console.log(data);

    serverStatus.textContent = "Server is ready!";
    serverStatus.classList.remove("loading");
    serverStatus.classList.add("ready");
  } catch (error) {
    console.error(error);
    serverStatus.textContent = "Failed to wake up server!";
  }
}
