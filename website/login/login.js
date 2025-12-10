import { account_api, login_api } from "../../utils/apiconfig.js";
import { finishProgressBar } from "../../utils/finishProgressBar.js";
import { getProfile } from "../../utils/getProfile.js";
import { startProgressBar } from "../../utils/startProgressBar.js";
import { wakeupServer } from "../../utils/wakeupServer.js";

const openPass = document.getElementById("openPass");
const closePass = document.getElementById("closePass");
const passwordInput = document.getElementById("password_type");

window.onload = async () => {
    await wakeupServer();
}

openPass.addEventListener("click", () => {
    openPass.style.display = "none";
    closePass.style.display = "block";
    passwordInput.type = "text";
});

closePass.addEventListener("click", () => {
    openPass.style.display = "block";
    closePass.style.display = "none";
    passwordInput.type = "password";
});

async function login(username, password) {
    startProgressBar();
    try {
        const res = await fetch(login_api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: "include"
        });
    
        const json = await res.json();
        finishProgressBar();

        if (res.status === 200) {
            localStorage.setItem("accessToken", json.data.accessToken);
            localStorage.setItem("username", username);
            getProfile(account_api, localStorage.getItem("accessToken"));
            window.location.href = "../home/home.html";
        } 
        else if (res.status === 403) {
            alert("Login failed, please check username or password");
        } 
        else if (res.status === 404) {
            alert("No username existed");
        } 
        else if (res.status === 400) {
            alert("Null username or password");
        } 
        else if(res.status === 401){
            alert(json.error + ": " + json.message);
        }
        else {
            alert("Login failed due to unknown error");
        }

    } catch (error) {
        console.error("Login Error:", error);
        alert("Server is starting up...!");
    }
}

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Please enter username and password!");
        return;
    }
    login(username, password);
});

const savedTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", savedTheme);