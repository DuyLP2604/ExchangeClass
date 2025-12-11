import { account_api, forgot_password_api, verify_otp_api } from "../../utils/apiconfig.js";
import { getProfile } from "../../utils/getProfile.js";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";
import { startProgressBar } from "../../utils/startProgressBar.js";
import { finishProgressBar } from "../../utils/finishProgressBar.js";

const inputs = document.querySelectorAll(".otp-input");
const username = localStorage.getItem("username");
const email = localStorage.getItem("email");
const usernameMode = document.getElementById("usernameMode");
const emailMode = document.getElementById("emailMode");
const usernameOrEmail = document.getElementById("usernameOrEmail");
const sendOTP = document.getElementById("sendOTP");
const resendOTP = document.getElementById("resendOTP");
await getProfile(account_api);
inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
        const value = e.target.value;

        if (!/^[0-9]$/.test(value)) {
            e.target.value = "";
            return;
        }

        if (index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

//==========CHANGE AUTOFILL==============
usernameMode.addEventListener("click", () => {
    usernameMode.classList.add("active");
    emailMode.classList.remove("active");
    usernameOrEmail.value = username;
})
emailMode.addEventListener("click", () => {
    usernameMode.classList.remove("active");
    emailMode.classList.add("active");
    usernameOrEmail.value = email;
})
//============FORGOT PASSWORD===========
async function forget_password(usernameOrEmail) {
    try{
        const res = await fetchWithAuth(forgot_password_api, {
            method: "POST",
            body: JSON.stringify({usernameOrEmail})
        })

        const data = await res.json();
        if(res.ok){
            inputs.forEach(input => {
                input.disabled = false;
            });
            inputs[0].focus();
            sendOTP.disabled = false;
            disableResendButton();
        }
        document.getElementById("backendAnnounce").textContent = data.message;
    }catch(error){
        console.error(error);
        alert("Fail to connect to server");
    }
}
//=============VERIFY OTP=============
function getOTP() {
    let otp = "";

    inputs.forEach(input => {
        otp += input.value;
    });

    return otp;
}

async function verify_otp(){
    startProgressBar();
    try{
        let otp = getOTP();
        const res = await fetchWithAuth(verify_otp_api, {
            method: "POST",
            body: JSON.stringify({email, otp})
        })

        const data = await res.json();
        if(res.ok){
            localStorage.setItem("resetToken", data.resetToken);
            window.location.href = "../changePassword/changePassword.html";
            finishProgressBar();
        }
        else{
            alert(data.error + ": " + data.nessage);
            finishProgressBar();
        }
    } catch(error){
        console.error(error);
        alert("Fail to verify OTP");
        finishProgressBar();
    }
}

//====================RESEND AFTER 60s================
function disableResendButton() {
    let timeLeft = 60; 

    resendOTP.disabled = true;
    resendOTP.textContent = `Resend (${timeLeft}s)`;

    const timer = setInterval(() => {
        timeLeft--;

        resendOTP.textContent = `Resend (${timeLeft}s)`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.textContent = "Resend OTP";
        }
    }, 1000);
}

//===============MAIN=========================
document.getElementById("confirm_information").addEventListener("click", async () => {
    forget_password(usernameOrEmail.value);
})

resendOTP.addEventListener("click", async () => {
    forget_password(usernameOrEmail.value);
})

sendOTP.addEventListener("click", async () => {
    verify_otp();
})


