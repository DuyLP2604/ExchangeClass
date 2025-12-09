import { base_url, server_url } from "./apiconfig.js";
const body = document.body;
export async function wakeupServer() {
  const serverStatus = document.getElementById("serverStatus");
  
  function setStatus(text, status){
    serverStatus.textContent = text;
    serverStatus.className = "";
    serverStatus.classList.add(status);
    // classes.forEach(c => serverStatus.classList.add(c));
  }

  setStatus("Checking server...", "checking");
  body.style.pointerEvents = "none";
  const isServerRunning = async (url, timeout = 4000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    return fetch(url, {signal: controller.signal, cache: "no-store"})
      .finally(() => clearTimeout(id)); 
  };

  try{
    const res = await isServerRunning(server_url)
    if(res.ok){
      setStatus("Server is ready", "ready");
      body.style.pointerEvents = "all";
      return;
    }
    else{
      setStatus("Waking up server", "loading");
    }
  } catch (error){
    setStatus("Waking server up", "loading");
  }

  try{
    await fetch(base_url);
    const res = await fetch(server_url);
    const data = await res.text();
    if(res.ok) {
      setStatus("Server is ready", "ready");
      body.style.pointerEvents = "all";
    }
    else setStatus("Failed to wake up server", "loading");
  } catch(error){
    setStatus("Failed to wake up server", "loading");
  }
}
