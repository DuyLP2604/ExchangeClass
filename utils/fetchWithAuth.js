import { getNewAccessToken } from "./getNewAccessToken.js";
import { isTokenExpired } from "./isTokenExpired.js";
import { unloadProfile } from "./unloadProfile.js";

export async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem("accessToken");

    if (isTokenExpired(accessToken)) {
        console.log("Access token expired, refreshing...");

        const newToken = await getNewAccessToken();

        if (!newToken) {
            console.log("Refresh token expired → logout");
            // window.location.href = "../login/login.html";
            unloadProfile();
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
        if(isTokenExpired(accessToken)){
            console.log("Unauthorized (token is not valid)");
        }
        else{
            console.log("401 but access token still valid → BE says refresh not allowed");
        }
        return res;
    }

    return res;
}

