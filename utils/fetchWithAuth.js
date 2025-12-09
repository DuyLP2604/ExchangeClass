import { getNewAccessToken } from "./getNewAccessToken.js";
import { isTokenExpired } from "./isTokenExpired.js";

export async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem("accessToken");

    if (isTokenExpired(accessToken)) {
        console.log("Access token expired, refreshing...");

        const newToken = await getNewAccessToken();

        if (!newToken) {
            console.log("Refresh token expired → logout");
            window.location.href = "../login/login.html";
            return;
        }

        localStorage.setItem("accessToken", newToken);
        accessToken = newToken;
    }

    options.headers = {
        ...(options.headers || {}),
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };

    const res = await fetch(url, {
        ...options,
        credentials: "include"
    });

    if (res.status === 401) {
        console.log("Unauthorized (token still valid). Force login.");
        window.location.href = "../login/login.html";
        return res;
    }

    return res;
}

