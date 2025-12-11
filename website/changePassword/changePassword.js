import { reset_password_api } from "../../utils/apiconfig.js";
import { finishProgressBar } from "../../utils/finishProgressBar.js";
import { getProfile } from "../../utils/getProfile.js";
import { startProgressBar } from "../../utils/startProgressBar.js";
const savedTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", savedTheme);

const openPass = document.getElementById("openPass");
const closePass = document.getElementById("closePass");
const passwordInput = document.getElementById("password_input");
const password_typo = document.getElementById("password_typo");

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

async function reset_password_with_OTP() {
    startProgressBar();
    const email = localStorage.getItem("email");
    const resetToken = localStorage.getItem("resetToken");
    const newPassword = document.getElementById("password_input").value.trim()
    try{
        const res = await fetch(reset_password_api , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, resetToken, newPassword})
        })

        const data = await res.json();
        finishProgressBar();
        if(res.ok){
            localStorage.removeItem("resetToken");
            alert("Change password successfully");
            window.location.href = "../login/login.html";
        }
        else{
            alert(data.error + ": " + data.message);
        }
    }catch(error){
        console.error(error);
        finishProgressBar();
        alert("Fail to change password");
    }
}
function checkPassword(password) {
    let alpha, lower, num, special;
    for (let i = 0; i < password.length; i++) {
        if (password[i] >= 'A' && password[i] <= 'Z') alpha = true;
        else if (password[i] >= 'a' && password[i] <= 'z') lower = true;
        else if (password[i] >= '0' && password[i] <= '9') num = true;
        else special = true;

        if (alpha && lower && num && special) return true;
    }
    return false;
}
await getProfile();
document.getElementById("Send").addEventListener("click", () => {
    const password = document.getElementById("password_input").value.trim();
    if (password.length < 8) {
        password_typo.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <b>Password is too short!</b>';
        password_typo.style.color = "tomato";
    } else if (password.length > 32) {
        password_typo.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <b>Password is too long!</b>';
        password_typo.style.color = "tomato";
    } else {
        if (checkPassword(password)) {
            reset_password_with_OTP();
        } else {
            password_typo.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <b>Password does not meet requirements</b>';
            password_typo.style.color = "tomato";
        }
    }
})