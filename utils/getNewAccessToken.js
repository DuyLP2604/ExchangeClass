import { get_new_access_token_url } from "./apiconfig.js";

export async function getNewAccessToken(refreshToken){
    if(!refreshToken) return;
    try{
        const res = await fetch(get_new_access_token_url, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({refreshToken})
        })

        const json = await res.json();
        console.log(json.message);
        if(res.ok){
            console.log("Get new access token");
            localStorage.setItem("accessToken", json.data.accessToken);
            return json.data.accessToken;
        }
        else{
            console.log("Refresh Token Expired");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return null;
        }
    } catch(error){
        console.error(error);
        return null;
    }
}