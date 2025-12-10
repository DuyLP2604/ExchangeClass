export function userAvatar(isProfilePage){
    const userIndex = Number(localStorage.getItem("id") % 10);
    const role = localStorage.getItem("role");
    const backgroundColor = [
        "linear-gradient(45deg, #ff9a9e, #fad0c4)",
        "linear-gradient(45deg, #a1c4fd, #c2e9fb)",
        "linear-gradient(45deg, #fbc2eb, #a6c1ee)",
        "linear-gradient(45deg, #84fab0, #8fd3f4)",
        "linear-gradient(45deg, #fccb90, #d57eeb)",
        "linear-gradient(45deg, #ffecd2, #fcb69f)",
        "linear-gradient(45deg, #a18cd1, #fbc2eb)",
        "linear-gradient(45deg, #f6d365, #fda085)",
        "linear-gradient(45deg, #96fbc4, #f9f586)",
        "linear-gradient(45deg, #5ee7df, #b490ca)"
    ]

    const boxShadow = [
        "0 0 25px rgba(255,154,158,0.8)",
        "0 0 25px rgba(161,196,253,0.8)",
        "0 0 25px rgba(251,194,235,0.8)",
        "0 0 25px rgba(132,250,176,0.8)",
        "0 0 25px rgba(252,203,144,0.8)",
        "0 0 25px rgba(255,236,210,0.8)",
        "0 0 25px rgba(161,140,209,0.8)",
        "0 0 25px rgba(246,211,101,0.8)",
        "0 0 25px rgba(150,251,196,0.8)",
        "0 0 25px rgba(94,231,223,0.8)"
    ]

    const ring = document.getElementById("user_ring") || document.querySelector(".user_ring");
    const icon = document.querySelector(".avatar");
    icon.style.color = "white";
    icon.style.fontSize = isProfilePage? (window.innerWidth > 775 ? "45px" : "35px"): "22px";
    if(role == "ADMIN"){
        ring.style.boxShadow = "0 0 25px rgba(255, 107, 107, 0.6)";
        ring.style.background = "conic-gradient(from 0deg, #ff6b6b, #f7d794, #1dd1a1, #54a0ff, #5f27cd, #ff6b6b)";
    }
    else{
        ring.style.background = backgroundColor[userIndex];
        ring.style.boxShadow = boxShadow[userIndex];
        ring.style.border = "none";
    }
}

export function unloadAvatar(isProfilePage){
    const ring = document.getElementById("user_ring") || document.querySelector(".user_ring");
    const icon = document.querySelector(".avatar");
    if(localStorage.getItem("theme") === "dark"){
        ring.style.background = "#1e1e1e";
        ring.style.boxShadow = "none";
        ring.style.border = "2px solid white";
        icon.style.color = "white";
    }
    else{
        ring.style.background = "white";
        ring.style.boxShadow = "none";
        ring.style.border = "2px solid black";
        icon.style.color = "black";
    }
    icon.style.fontSize = isProfilePage? "45px" : "22px";
}
