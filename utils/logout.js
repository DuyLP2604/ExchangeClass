import { logout_url } from "./apiconfig.js";
import { fetchWithAuth } from "./fetchWithAuth.js";
import { finishProgressBar } from "./finishProgressBar.js";
import { startProgressBar } from "./startProgressBar.js";

export async function callLogout() {
    startProgressBar();
    try {
        const res = await fetchWithAuth(logout_url, {
            method: "POST",
            credentials: "include"
        });

        if (!res.ok) {
            throw new Error("Logout failed");
        }
        finishProgressBar();
        return true;
    } catch (error) {
        console.error(error);
        alert("Cannot logout due to some network issue");
        finishProgressBar();
        return false;
    }
}
