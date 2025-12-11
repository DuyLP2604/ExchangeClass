import { account_api, exchange_class_delete_api, exchange_class_get_by_studentCode, exchange_slot_delete_api, exchange_slot_get_by_studentCode} from "../../utils/apiconfig.js";
import { getProfile } from "../../utils/getProfile.js";
import { unloadProfile } from "../../utils/unloadProfile.js";
import { unloadAvatar, userAvatar } from "../../utils/userAvatar.js";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

export let token = localStorage.getItem("accessToken");
export const member_welcome = document.getElementById("member_welcome");
export const now = new Date();

const newStudentCode = document.getElementById("studentCodeInput");
const newClassCode = document.getElementById("currentClassInput");
const screenWidth = window.innerWidth;
const deleteBtn = document.getElementById("deleteRequest");
const deleteCancelBtn = document.getElementById("delete_cancel");
const deleteConfirmBtn = document.getElementById("delete_confirm");
const deleteSlotBtn = document.getElementById("deleteSlotRequest");
const deleteSlotCancelBtn = document.getElementById("delete_slot_cancel");
const deleteSlotConfirmBtn = document.getElementById("delete_slot_confirm");
const deleteBtnConfirm = document.getElementById("information_delete_request_confirm");
const deleteSlotBtnConfirm = document.getElementById("information_delete_slot_request_confirm");
export const tableBody = document.getElementById("results_table_body");
const tableSlotBody = document.getElementById("results_table_slot_body");
export const editBtn = document.getElementById("edit");
const resetPasswordBtn = document.getElementById("resetPasswordButton");
let classRequestFound = false;
export function formatDate(){

    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const dayName = days[now.getDay()];
    const day = String(now.getDate()).padStart(2, '0');
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    return `${dayName}, ${month} ${day} ${year}`;
}

function loadProfile(){
    document.getElementById("user_id").textContent = `ID: ${localStorage.getItem("id")}`;
    document.getElementById("accountNameInput").value = localStorage.getItem("accountName");
    newStudentCode.value = localStorage.getItem("studentCode");
    newClassCode.value = localStorage.getItem("classCode");
    document.getElementById("email").value = localStorage.getItem("email");
}

async function getClassRequest(studentCode) {
    try{
        const res = await fetchWithAuth(exchange_class_get_by_studentCode(studentCode))
        const response = await res.json();
        const data = response.data;
        if(res.ok){
            console.log(data);
            const row = `
                <tr>
                    <td data-label = "Id:">${data.id}</td>
                    <td data-label = "Student code: ">${data.studentCode}</td>  
                    <td data-label = "Current class:">${data.currentClassCode}</td>
                    <td data-label = "Exchange to: ">${data.desiredClassCode}</td>
                    <td data-label = "Current slot: ">${data.currentSlot}</td>
                    <td data-label = "Exchange to slot: ">${data.desiredSlot}</td>
                </tr>
            `;
            tableBody.innerHTML = row;
            classRequestFound = true;
            localStorage.setItem("requestID", data.id);
        }
        else if(res.status == 404){
            tableBody.innerHTML = window.innerWidth < 775 ?
                `<tr><td colspan="6" style="text-align:center; padding-left:6%; white-space: nowrap">You don't have a class request currently</td></tr>`: `<tr><td colspan="6" style="text-align:center;">You don't have a class request currently</td></tr>`;
        }
        else{
            tableBody.innerHTML =
                `<tr><td colspan="6" style="text-align:center;">${data.message}</td></tr>`;
        }
    }catch(error){
        console.log(error);
        alert("Server is starting up...");
    }
}

async function getSlotRequest(studentCode) {
    try{
        const res = await fetchWithAuth(exchange_slot_get_by_studentCode(studentCode))
        const response = await res.json();
        const data = response.data;
        if(res.ok){
            console.log(data);
            const row = `
                <tr>
                    <td data-label = "Id:">${data.id}</td>
                    <td data-label = "Student code: ">${data.studentCode}</td>  
                    <td data-label = "Current class:">${data.currentClassCode}</td>
                    <td data-label = "Current slot: ">${data.currentSlot}</td>
                    <td data-label = "Exchange to slot: ">${data.desiredSlot}</td>
                </tr>
            `;
            tableSlotBody.innerHTML = row;
            localStorage.setItem("requestSlotID", data.id);
        }
        else if(res.status == 404){
            tableSlotBody.innerHTML = window.innerWidth < 775 ?
                `<tr><td colspan="5" style="text-align:center; padding-left:8%; white-space: nowrap">You don't have a slot request currently</td></tr>`: `<tr><td colspan="6" style="text-align:center;">You don't have a slot request currently</td></tr>`
        }
        else{
            tableSlotBody.innerHTML =
                `<tr><td colspan="5" style="text-align:center;">${data.message}</td></tr>`;
        }
    }catch(error){
        console.log(error);
        alert("Server is starting up...");
    }
}
function updateText(){
    const currentClassLabel = document.getElementById("current_class_label");
    const currentSlotLabel = document.getElementById("current_slot_label");
  if(screenWidth <= 775){
    currentClassLabel.textContent = "Class request";
    currentSlotLabel.textContent = "Slot request";
  }else{
    currentClassLabel.textContent = "Current class request";
    currentSlotLabel.textContent = "Current slot request";
  }
}
window.onload = async () => {
    updateText();
    const profileResponse = await getProfile(account_api);
    tableBody.innerHTML = window.innerWidth < 775 ?
      '<tr><td colspan="6" style="text-align:center; padding-left:43%; white-space: nowrap">Loading...</td></tr>' : '<tr><td colspan="6" style="text-align:center;">Loading...</td></tr>';
    tableSlotBody.innerHTML = window.innerWidth < 775 ?
      '<tr><td colspan="5" style="text-align:center; padding-left:43%; white-space: nowrap">Loading...</td></tr>' : '<tr><td colspan="6" style="text-align:center;">Loading...</td></tr>';
    document.getElementById("date").textContent = formatDate();
    const hour = now.getHours();
    if(!token || profileResponse.status === 401 || !profileResponse.data){
        member_welcome.textContent = "Welcome, please log in first!";
        unloadProfile();
        unloadAvatar(true);
        document.getElementById("login_required").style.display = "block";
        editBtn.style.opacity = 0;
        editBtn.style.pointerEvents = "none";
        deleteBtn.style.display = "none";
        deleteBtn.style.pointerEvents = "none";
        resetPasswordBtn.style.display = "none";
        resetPasswordBtn.style.pointerEvents = "none";
    }
    else{
        const username = localStorage.getItem("username");
        if(username){
            if (hour >= 0 && hour <= 4)
                member_welcome.textContent = "Good Night, " + username + "!";
            else if (hour >= 5 && hour <= 10)
                member_welcome.textContent = "Have a nice day, " + username + "!";
            else if (hour >= 11 && hour <= 12)
                member_welcome.textContent = "Have a nice day, " + username + "!";
            else if (hour >= 13 && hour <= 18)
                member_welcome.textContent = "Good Afternoon, " + username + "!";
            else if (hour >= 19 && hour <= 21)
                member_welcome.textContent = "Good Evening, " + username + "!";
            else member_welcome.textContent = "Good Night, " + username + "!";
        }
        document.getElementById("username").textContent = username;
        document.getElementById("login_required").style.display = "none";
        userAvatar(true);
        editBtn.style.opacity = 1;
        editBtn.style.pointerEvents = "all";
        loadProfile();
        getClassRequest(localStorage.getItem("studentCode"));
        getSlotRequest(localStorage.getItem("studentCode"));
        if(localStorage.getItem("role") === "ADMIN"){
            document.getElementById("username").classList.add("adminGreeting");
        }
    }
}

document.getElementById("resetPasswordButton").addEventListener("click", () => {
    window.location.href ="../reset/reset.html";
})
//=========================CHANGE INFORMATION===================
async function changeInformation(studentCode, classCode){
    editBtn.innerHTML = `<i class="fa-solid fa-hammer"></i> Updating...`;
    const hammer = document.querySelector(".fa-hammer");
    if(screenWidth < 775){
        usermenu.style.gap = "30px";
    }
    hammer.classList.add("hitting");
    try{
        const res = await fetchWithAuth(account_api, {
            method: "PATCH",
            body: JSON.stringify({studentCode, classCode})
        })

        const data = await res.json();
        if(res.status === 200){
            alert("Change information successfully");
            const newProfile = await getProfile(account_api);
            if(newProfile) loadProfile();
            editBtn.innerHTML = `<i class="fa-solid fa-hammer"></i> Done!`;
            if(screenWidth < 775){
                usermenu.style.gap = "55px";
            }
        }
        else if(res.status === 400 || res.status === 401){
            alert(data.error +": " + data.message);
        }
        hammer.classList.remove("hitting");
    }catch(error){
        console.log(error);
        alert("Server is starting up...");
        hammer.classList.remove("hitting");
    }
}

const editConfirmBtn = document.getElementById("edit_confirm");
const editCancelBtn = document.getElementById("edit_cancel");
const usermenu = document.getElementById("user");
const information_button = document.getElementById("information_button");

editBtn.addEventListener("click" , () => {
    newStudentCode.disabled = false;
    newClassCode.disabled = false;
    editBtn.innerHTML = `<i class="fa-solid fa-hammer"></i>Editing...`;
    if(screenWidth < 775){
        usermenu.style.gap = "30px";
    }
    editBtn.classList.add("lock");
    information_button.style.opacity = "1";
    editConfirmBtn.style.pointerEvents = "all";
    editCancelBtn.style.pointerEvents = "all";
})

editConfirmBtn.addEventListener("click", async () => {
    newClassCode.disabled = true;
    newStudentCode.disabled = true;
    editBtn.innerHTML = `<i class="fa-solid fa-hammer"></i>Edit`;
    if(screenWidth < 775){
        usermenu.style.gap = "55px";
    }
    editBtn.classList.remove("lock");
    information_button.style.opacity = "0";
    editConfirmBtn.style.pointerEvents = "none";
    editCancelBtn.style.pointerEvents = "none";
    await changeInformation(newStudentCode.value, newClassCode.value);
    window.location.reload();
})
editCancelBtn.addEventListener("click", () => {
    newClassCode.disabled = true;
    newStudentCode.disabled = true;
    editBtn.innerHTML = `<i class="fa-solid fa-hammer"></i>Edit`;
    editBtn.classList.remove("lock");
    information_button.style.opacity = "0";
    editConfirmBtn.style.pointerEvents = "none";
    editCancelBtn.style.pointerEvents = "none";
    if(screenWidth < 775){
        usermenu.style.gap = "55px";
    }
    loadProfile();
})

//============================DELETE REQUEST=====================
async function deleteRequest(id) {
    deleteBtn.innerHTML = `Deleting...`
    try{
        const res = await fetchWithAuth(exchange_class_delete_api(id), {
            method: "DELETE",
            body: JSON.stringify({id})
        })

        if(res.ok){
            alert("Delete request successfully!");
            deleteBtn.innerHTML = `Done!`;
        }
        else{
            alert(data.message); 
        }
    }catch(error){
        console.log(error);
        alert("Cannot delete request");
        deleteBtn.innerHTML = `Delete request`;
    }
}

async function deleteSlotRequest(id) {
    deleteSlotBtn.innerHTML = `Deleting...`
    try{
        const res = await fetchWithAuth(exchange_slot_delete_api(id), {
            method: "DELETE",
            body: JSON.stringify({id})
        })

        if(res.ok){
            alert("Delete request successfully!");
            deleteBtn.innerHTML = `Done!`;
        }
        else{
            alert(data.message); 
        }
    }catch(error){
        console.log(error);
        alert("Cannot delete request");
        deleteBtn.innerHTML = `Delete request`;
    }
}


deleteBtn.addEventListener("click", () => {
    deleteBtn.style.pointerEvents = "none";
    deleteBtn.style.display = "none";
    deleteBtnConfirm.style.opacity = 1;
    deleteBtnConfirm.style.pointerEvents = "all";
})

deleteCancelBtn.addEventListener("click", () => {
    deleteBtn.style.pointerEvents = "all";
    deleteBtn.style.display = "block";
    deleteBtnConfirm.style.opacity = 0;
    deleteBtnConfirm.style.pointerEvents = "none";
})

deleteConfirmBtn.addEventListener("click", async() => {
    deleteBtn.style.pointerEvents = "all";
    deleteBtn.style.display = "block";
    deleteBtnConfirm.style.opacity = 0;
    deleteBtnConfirm.style.pointerEvents = "none";
    await deleteRequest(Number(localStorage.getItem("requestID")));
    window.location.reload();
})

deleteSlotBtn.addEventListener("click", () => {
    deleteSlotBtn.style.pointerEvents = "none";
    deleteSlotBtn.style.display = "none";
    deleteSlotBtnConfirm.style.opacity = 1;
    deleteSlotBtnConfirm.style.pointerEvents = "all";
    if(screenWidth < 775){
        deleteSlotBtnConfirm.style.top = classRequestFound ? "650px" : "475px";
    }
})

deleteSlotCancelBtn.addEventListener("click", () => {
    deleteSlotBtn.style.pointerEvents = "all";
    deleteSlotBtn.style.display = "block";
    deleteSlotBtnConfirm.style.opacity = 0;
    deleteSlotBtnConfirm.style.pointerEvents = "none";
})

deleteSlotConfirmBtn.addEventListener("click", async() => {
    deleteSlotBtn.style.pointerEvents = "all";
    deleteSlotBtn.style.display = "block";
    deleteSlotBtnConfirm.style.opacity = 0;
    deleteSlotBtnConfirm.style.pointerEvents = "none";
    await deleteSlotRequest(Number(localStorage.getItem("requestSlotID")));
    window.location.reload();
})

