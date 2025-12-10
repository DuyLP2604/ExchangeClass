import { register_api } from "../../utils/apiconfig.js";
import { finishProgressBar } from "../../utils/finishProgressBar.js";
import { startProgressBar } from "../../utils/startProgressBar.js";
import { wakeupServer } from "../../utils/wakeupServer.js";

const openBtn1 = document.getElementById("openPass1");
const closeBtn1 = document.getElementById("closePass1");
const password1 = document.getElementById("password1");

window.onload = async () => {
    await wakeupServer();
}

openBtn1.addEventListener("click", () => {
    openBtn1.style.display = "none";
    closeBtn1.style.display = "block";
    password1.type = "text";
});

closeBtn1.addEventListener("click", () => {
    openBtn1.style.display = "block";
    closeBtn1.style.display = "none";
    password1.type = "password";
});


const openBtn2 = document.getElementById("openPass2");
const closeBtn2 = document.getElementById("closePass2");
const password2 = document.getElementById("password2");

openBtn2.addEventListener("click", () => {
    openBtn2.style.display = "none";
    closeBtn2.style.display = "block";
    password2.type = "text";
});

closeBtn2.addEventListener("click", () => {
    openBtn2.style.display = "block";
    closeBtn2.style.display = "none";
    password2.type = "password";
});

const form = document.getElementById("form");
const password_error = document.getElementById("Password_Error");
const password_typo = document.getElementById("password_typo");

function checkPassword(password){
    let alpha;
    let lower;
    let num;
    let special;
    for(let i = 0;i < password.length; i++){
        if(password[i] <= 'Z' && password[i] >= 'A')
            alpha = true;
        else if(password[i] <= 'z' && password[i] >= 'a')
            lower= true;
        else if(password[i] <= '9' && password[i] >= '0')
            num = true;
        else
            special = true;
        
        
        if(alpha && lower && num && special)
            return true;
    }
    return false;
}

async function register() {
    const studentCode = document.getElementById("studentCode").value.trim();
    const accountName = document.getElementById("accountName").value.trim();
    const username = document.getElementById("userName").value.trim();
    const password = document.getElementById("password1").value.trim();
    const phoneNumber = document.getElementById("Zalo").value.trim();
    // const gmail = document.getElementById("Gmail").value.trim(); // no usage for now
    const classCode = document.getElementById("classCode").value.trim();
    startProgressBar();
    try {
        const res = await fetch(register_api, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                phoneNumber,
                accountName,
                studentCode,
                classCode,
                role: "USER"
            })
        });
        const data = await res.json();
        finishProgressBar();

        if (res.status === 201 && data.processSuccess) {
            alert(data.message); 
            window.location.href = "../login/login.html";
        } else if(res.status === 409){
            alert(data.error + ": "+  data.message);
        } else if(res.status === 400){
            alert(data.error + ": " + data.message);
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Server is starting up...");
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let password;
    let confirm_password;
    
    password = password1.value.trim();
    confirm_password = password2.value.trim();
    
    if(password.length < 8){
        password_typo.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <b>Password is too short!</b>';
        password_typo.style.color = "tomato";
    }
    else if(password.length > 32){
        password_typo.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <b>Password is too long!</b>';
        password_typo.style.color = "tomato";
    }
    else{
        if(checkPassword(password)){
            if(password === confirm_password){
                password_error.innerHTML = '<i class="fa-solid fa-circle-check"></i> <b>Set Password successfully</b>';
                password_error.style.color = "lime";
                password_typo.innerHTML ='';
                register();
            }
            else{
                password_error.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <b>Password does not match!</b>';
                password_error.style.color = "tomato";
                password_typo.innerHTML ='';
            }
        }
        else{
            password_typo.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <b>Password does not meet requirements</b>';
            password_typo.style.color = "tomato";
        }
    }
});

const savedTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", savedTheme);

