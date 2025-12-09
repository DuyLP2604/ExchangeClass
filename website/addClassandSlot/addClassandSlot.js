import { class_api_for_admin } from "../../utils/apiconfig.js";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

const newClass = document.getElementById("newClass");
const newSlot = document.getElementById("newSlot");
const changeClass = document.getElementById("changeClass");
const changeSlot = document.getElementById("changeSlot");
const body = document.body;
const adminOnlyMsg = document.getElementById("adminOnlyMsg");

function checkForAdmin(){
    const role = localStorage.getItem("role");
    if(role !== "ADMIN"){
        body.style.opacity = "0.3";
        body.style.pointerEvents = "none";
        adminOnlyMsg.style.display = "block";
    }
    else{
        body.style.opacity = "1";
        body.style.pointerEvents = "all";
        adminOnlyMsg.style.display = "none";
    }
}
async function addClass() {
    const classCode = newClass.value.trim();
    const slot = newSlot.value.trim();
    try{
        const res = await fetchWithAuth(class_api_for_admin, {
            method: "POST",
            body: JSON.stringify({classCode, slot})
        })

        const data = await res.json();
        if(res.ok){
            alert("Add a New class");
            newClass.value = "";
            newSlot.value = "";
        }
        else{
            alert(data.error +": " + data.message);
        }
    }catch(error){
        console.log(error);
        alert(error);
    }
}
async function adjustClass() {
    const classCode = changeClass.value.trim();
    const slot = changeSlot.value.trim();
    try{
        const res = await fetchWithAuth(class_api_for_admin, {
            method: "PATCH",
            body: JSON.stringify({classCode, slot})
        })

        const data = await res.json();
        if(res.ok){
            alert("Adjust a class successfully");
            changeClass.value = "";
            changeSlot.value = "";
        }
        else{
            alert(data.error +": " + data.message);
        }
    }catch(error){
        console.log(error);
        alert(error);
    }
}
window.addEventListener("load", checkForAdmin);
document.getElementById("addClassBtn").addEventListener("click", addClass);
document.getElementById("adjustClassBtn").addEventListener("click", adjustClass);