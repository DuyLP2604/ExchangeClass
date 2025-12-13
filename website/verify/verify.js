import { forgot_password_api, verify_otp_api } from "../../utils/apiconfig.js";
import { startProgressBar } from "../../utils/startProgressBar.js";
import { finishProgressBar } from "../../utils/finishProgressBar.js";

const inputs = document.querySelectorAll(".otp-input");
const usernameMode = document.getElementById("usernameMode");
const emailMode = document.getElementById("emailMode");
const usernameOrEmail = document.getElementById("usernameOrEmail");
const sendOTP = document.getElementById("sendOTP");
const resendOTP = document.getElementById("resendOTP");
let email;

window.onload = async () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
}
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
usernameMode.classList.add("active");
emailMode.classList.remove("active");
usernameMode.addEventListener("click", () => {
    usernameMode.classList.add("active");
    emailMode.classList.remove("active");
    usernameOrEmail.type = "text";
    usernameOrEmail.placeholder = "Username";
})
emailMode.addEventListener("click", () => {
    usernameMode.classList.remove("active");
    emailMode.classList.add("active");
    usernameOrEmail.type = "email";
    usernameOrEmail.placeholder = "Email";
})
//============FORGOT PASSWORD===========
async function forget_password(usernameOrEmail) {
    startProgressBar();
    try{
        const res = await fetch(forgot_password_api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({usernameOrEmail})
        })

        const data = await res.json();
        finishProgressBar();
        if(res.ok){
            console.log(data);
            email = data.data;
            document.getElementById("backendAnnounce").textContent = `We have send an OTP code to email: ${email}, please check the email for the code to verify`;
            inputs.forEach(input => {
                input.disabled = false;
            });
            inputs[0].focus();
            sendOTP.disabled = false;
            disableResendButton();
        }
        else{
            document.getElementById("backendAnnounce").textContent = data.message;
        }
    }catch(error){
        console.error(error);
        alert("Fail to connect to server");
        finishProgressBar();
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
        const res = await fetch(verify_otp_api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, otp})
        })

        const data = await res.json();
        if(res.ok){
            console.log(data);
            localStorage.setItem("resetEmail", data.data.email);
            localStorage.setItem("resetToken", data.data.resetToken);
            window.location.href = "../changePassword/changePassword.html";
            finishProgressBar();
        }
        else{
            alert(data.error + ": " + data.message);
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
            resendOTP.disabled = false;
            resendOTP.textContent = "Resend OTP";
        }
    }, 1000);
}

//===============MAIN=========================
document.getElementById("confirm_information").addEventListener("click", () => {
    forget_password(usernameOrEmail.value);
})

resendOTP.addEventListener("click", () => {
    forget_password(usernameOrEmail.value);
})

sendOTP.addEventListener("click", () => {
    verify_otp();
})


