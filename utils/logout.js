import { logout_url } from "./apiconfig.js";
import { fetchWithAuth } from "./fetchWithAuth.js";

export async function callLogout() {
    try {
        const res = await fetchWithAuth(logout_url, {
            method: "POST",
            credentials: "include" 
        });

        if (!res.ok) {
            throw new Error("Logout failed");
        }

        return true;
    } catch (error) {
        console.error(error);
        alert("Cannot logout due to some network issue");
        return false;
    }
}
