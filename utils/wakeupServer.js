import { server_url } from "./apiconfig.js";

export async function wakeupServer() {
  const serverStatus = document.getElementById("serverStatus");
  serverStatus.textContent = "Checking server...";
  serverStatus.classList.add("checking");

  try {
    const res = await fetch(server_url, { cache: "no-store" });
    if (res.ok) {
      serverStatus.textContent = "Server is ready!";
      serverStatus.classList.remove("loading");
      serverStatus.classList.add("ready");
      serverStatus.classList.remove("checking");
      return;
    }
    else{
      console.log("Server fetch failed, waking up...");
      serverStatus.textContent = "Waking up server";
      serverStatus.classList.add("loading");
      serverStatus.classList.remove("ready");
      serverStatus.classList.remove("checking");
    }
  } catch (error) {
    console.error("Server fetch failed, waking up...");
    serverStatus.textContent = "Waking up server";
    serverStatus.classList.add("loading");
    serverStatus.classList.remove("ready");
    serverStatus.classList.remove("checking");
  }

  try {
    await fetch("https://exchangeslot-api-testing.onrender.com", { cache: "no-store" });

    const res2 = await fetch(server_url);
    const data = await res2.text();
    console.log(data);

    serverStatus.textContent = "Server is ready!";
    serverStatus.classList.remove("loading");
    serverStatus.classList.add("ready");
    serverStatus.classList.remove("checking");
  } catch (error) {
    console.error(error);
    serverStatus.textContent = "Failed to wake up server!";
  }
}
