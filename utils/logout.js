import { logout_url } from "./apiconfig.js";

export async function callLogout() {
    try {
        const res = await fetch(logout_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
