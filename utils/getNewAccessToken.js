import { get_new_access_token_url } from "./apiconfig.js";

export async function getNewAccessToken() {
    try {
        const res = await fetch(get_new_access_token_url, {
            method: "POST",
            credentials: "include", 
            headers: {
                "Content-Type": "application/json"
            }
        });

        const json = await res.json();
        console.log(json.message);

        if (res.ok) {
            console.log("Get new access token:", json.data.accessToken);
            return json.data.accessToken;
        } else {
            console.log("Refresh Token Expired");
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}
