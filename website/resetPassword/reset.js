import { login_api, reset_password_api } from "../../utils/apiconfig.js";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";
// TOGGLE PASSWORD
document.querySelectorAll(".togglePassword").forEach(icon => {
    icon.addEventListener("click", () => {
        const wrapper = icon.closest(".reset_row");
        if (!wrapper) return;

        const input = wrapper.querySelector(".password_input");
        if (!input) return;

        input.type = input.type === "password" ? "text" : "password";
        wrapper.querySelectorAll(".togglePassword").forEach(i =>
            i.classList.toggle("hidden")
        );
    });
});

document.getElementById("closeMenu").addEventListener("click", () => {
    window.location.href = "../profile/profile.html";
})
// CHECK PASSWORD API 
const authentication = document.getElementById("authentication");
async function check_password() {
    const username = document.getElementById("userNameInput").value.trim();
    const oldPassword = document.getElementById("oldInput").value.trim();

    try {
        const res = await fetch(login_api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password: oldPassword })
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 200) {
            document.getElementById("newInput").disabled = false;
            document.getElementById("confirmNewInput").disabled = false;
            authentication.textContent = "Verifying Success!";
            authentication.style.color = "lime";
        } else if (res.status === 403) {
            authentication.textContent = "Wrong username or password!";
            authentication.style.color = "tomato";
        } else if (res.status === 404) {
            authentication.textContent = "Account not found!";
            authentication.style.color = "tomato";
        } else {
            authentication.textContent = "Server error!";
            authentication.style.color = "tomato";
        }
    } catch (error) {
        console.error("Reset password error:", error);
        alert("Server is starting up...");
    }
}

//RESET PASSWORD API
async function reset_password() {
    const newPassword = document.getElementById("confirmNewInput").value.trim();

    try {
        const { status, data } = await fetchWithAuth(reset_password_api, {
            method: "PATCH",
            body: JSON.stringify({ newPassword })
        });

        if (status === 200) {
            alert(data.message || "Change password successfully!");
            window.location.href = "../login/login.html";
        } else if(status === 400) {
            alert("Invalid Password");
        } else if (status === 404){
            alert("No existing account");
        } else {
            alert("Failed to change password!")
        }
    } catch (error) {
        console.error("Reset password error:", error);
        alert("Server is starting up...");
    }
}

// CHECK VALID PASSWORD
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

// MAIN
document.getElementById("checkPassword").addEventListener("click", check_password);

document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();

    if (document.getElementById("newInput").disabled) {
        alert("Please verify your account before setting a new password.");
        return;
    }

    const password = document.getElementById("newInput").value.trim();
    const confirm_password = document.getElementById("confirmNewInput").value.trim();
    const password_typo = document.getElementById("password_typo");
    const password_error = document.getElementById("password_error");

    if (password.length < 8) {
        password_typo.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <b>Password is too short!</b>';
        password_typo.style.color = "tomato";
    } else if (password.length > 32) {
        password_typo.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <b>Password is too long!</b>';
        password_typo.style.color = "tomato";
    } else {
        if (checkPassword(password)) {
            if (password !== confirm_password) {
                password_error.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <b>Password does not match!</b>';
                password_error.style.color = "tomato";
                password_typo.innerHTML = '';
                return;
            } 
            reset_password();
        } else {
            password_typo.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> <b>Password does not meet requirements</b>';
            password_typo.style.color = "tomato";
        }
    }
});
