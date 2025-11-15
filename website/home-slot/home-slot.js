import { exchange_slot_create_api, exchange_class_get_by_slot_api, account_api } from "../../utils/apiconfig.js";
import { finishProgressBar } from "../../utils/finishProgressBar.js";
import { getNewAccessToken } from "../../utils/getNewAccessToken.js";
import { getProfile } from "../../utils/getProfile.js";
import { isTokenExpired } from "../../utils/isTokenExpired.js";
import { startProgressBar } from "../../utils/startProgressBar.js";
import { unloadProfile } from "../../utils/unloadProfile.js";
import { unloadAvatar, userAvatar } from "../../utils/userAvatar.js";
import { wakeupServer } from "../../utils/wakeupServer.js";

const avatarBtn = document.getElementById("dropdownAvatar");
const dropdownMenu = document.getElementById("dropdownMenu");
const member_welcome = document.getElementById("member_welcome");
const logout = document.getElementById("logout");
const profile = document.getElementById("profile");
const addClassandSlotBtn = document.getElementById("addClassAndSlot");

const tableBody = document.getElementById("results_table_body");
const prevBtn = document.getElementById("prev_page_btn");
const nextBtn = document.getElementById("next_page_btn");
const pageInfo = document.getElementById("page_info");

const classMode = document.getElementById("classMode");
const slotMode = document.getElementById("slotMode");

const searchBtn = document.getElementById("Search");
const exchangeInput = document.getElementById("Exchange");
const username = document.getElementById("username");
const studentCode = document.getElementById("id");
const classCode = document.getElementById("Menu_current_class");
let token = localStorage.getItem("accessToken");
const requestAdd = document.getElementById("requestAdd");
let currentPage = 1;
let totalPages = 1;
const limit = 10; // Số lượng mục trên mỗi trang
const now = new Date();
const hour = now.getHours();

document.getElementById("Add").onclick = function openMenu() {
  document.getElementById("addMenu").style.display = "block";
  username.value = localStorage.getItem("username");
  studentCode.value = localStorage.getItem("studentCode");
  classCode.value = localStorage.getItem("classCode");
};

document.getElementById("closeMenu").onclick = function closeMenu() {
  document.getElementById("addMenu").style.display = "none";
};

avatarBtn.addEventListener("click", () => {
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".user_menu")) {
    dropdownMenu.style.display = "none";
  }
});

window.onload = async() => {
  await wakeupServer();
  const expried = isTokenExpired(token);
  const refreshToken = localStorage.getItem("refreshToken");
  if(expried && refreshToken){
    console.log("Access token expired. Getting a new one...");
    await getNewAccessToken(refreshToken);
    token = localStorage.getItem("accessToken");
  }
  tableBody.innerHTML = window.innerWidth < 775 ?
      '<tr><td colspan="5" style="text-align:center; padding-left:20%; white-space: nowrap">Type in class to find request.</td></tr>':'<tr><td colspan="5" style="text-align:center;">Type in class to find request.</td></tr>';
  if(!token){
    member_welcome.textContent = "Welcome, please log in first!";
    profile.style.display = "none";
    logout.style.display = "none";
    unloadProfile(false);
    unloadAvatar(false);
    addClassandSlotBtn.style.display = "none";
    addClassandSlotBtn.style.pointerEvents = "none";
  }
  else{
    profile.style.display = "block";
    logout.style.display = "block";
    await getProfile(account_api, token);
    userAvatar(false);
    const username = localStorage.getItem("username");
    if(username){
      if (hour >= 0 && hour <= 4)
        member_welcome.textContent = "Good Night, " + username + "!";
      else if (hour >= 5 && hour <= 10)
        member_welcome.textContent = "Have a nice day, " + username + "!";
      else if (hour >= 11 && hour <= 12)
        member_welcome.textContent = "Happy Midday, " + username + "!";
      else if (hour >= 13 && hour <= 18)
        member_welcome.textContent = "Good Afternoon, " + username + "!";
      else if (hour >= 19 && hour <= 21)
        member_welcome.textContent = "Good Evening, " + username + "!";
      else member_welcome.textContent = "Good Night, " + username + "!";
    }

    if(localStorage.getItem("role") === "ADMIN"){
      addClassandSlotBtn.style.display = "block";
      addClassandSlotBtn.style.pointerEvents = "all";
    }
    else{
      addClassandSlotBtn.style.display = "none";
      addClassandSlotBtn.style.pointerEvents = "none";
    }
  }
};

logout.addEventListener("click", () => {
  alert("Logout Successfully");
  profile.style.display = "none";
  logout.style.display = "none";
  unloadProfile();
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("refreshToken");
  addClassandSlotBtn.style.display = "none";
  addClassandSlotBtn.style.pointerEvents = "none";
  unloadAvatar(false);
  window.location.href = "../home/home.html";
});

//ADMIN PRIVILEGE
addClassandSlotBtn.addEventListener("click", () => {
  window.location.href = "../addClassandSlot/addClassandSlot.html"
})

//CHANGE DISPLAY TEXT CONTENT
function updateText(){
  const screenWidth = window.innerWidth;
  if(screenWidth <= 775){
    classMode.textContent = "Exchange by Classes";
    slotMode.textContent = "Exchange by Slots";
  }else{
    classMode.textContent = "Exchange requests for Classes";
    slotMode.textContent = "Exchange requests for Slots";
  }
}

window.addEventListener("load", updateText);
window.addEventListener("resize", updateText);

const searchIcon = searchBtn.querySelector("i");

function updateIcon(){
 const hasInput = exchangeInput.value.trim();

 if(hasInput){
    searchIcon.className = "fa-solid fa-magnifying-glass-plus";
 } else{
    searchIcon.className = "fa-solid fa-arrows-rotate";
 }
}

exchangeInput.addEventListener("input", updateIcon);

//ALIGN MOBILE SEARCH WITH PC SEARCH
const exchangeMobile = document.getElementById("Exchange_Mobile");

if (exchangeMobile && exchangeInput) {
  // Mobile → PC
  exchangeMobile.addEventListener("input", () => {
    exchangeInput.value = exchangeMobile.value.trim();
    exchangeInput.dispatchEvent(new Event("input"));
  });

  // PC → Mobile
  exchangeInput.addEventListener("input", () => {
    exchangeMobile.value = exchangeInput.value.trim();
  });
}

//TOGGLE MOD
classMode.addEventListener("click", () => {
  window.location.href = "../home/home.html";
});

//API ADD REQUEST
async function addRequest(studentCode, desiredSlot) {
  startProgressBar();
  try{
    const res = await fetch(exchange_slot_create_api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({studentCode, desiredSlot})
    })

    const data = await res.json();
    finishProgressBar();
    if(res.status === 201){
      alert("Add request successfully");
    }
    else if(res.status === 409){
      alert(data.message);
    }
    else if(res.status === 500){
      alert(data.message);
    }
    else if(res.status === 404 || res.status === 400){
      alert(data.error + ": " + data.message);
    }
    else if(res.status === 401){
      alert("Session expired, please log in again.");
    }
  }
  catch(err){
    console.error(err);
    alert("Server is starting up...");
  }
}

requestAdd.addEventListener("submit", (e) => {
  e.preventDefault();
  const desiredSlot = document.getElementById("Menu_exchanging_class").value.trim();
  if(requestAdd.checkValidity()){
    addRequest(studentCode.value.trim(), desiredSlot);
    document.getElementById("addMenu").style.display = "none";
  }
  else{
    requestAdd.reportValidity();
  }
})
//API DELETE REQUEST
//API GET LIST
/**
 * Hàm gọi API để lấy danh sách yêu cầu trao đổi theo trang
 * @param {number} page - Số trang cần lấy dữ liệu
 */
async function fetchExchangeData(classCode, page) {
  // Hiển thị trạng thái đang tải (tùy chọn)
  tableBody.innerHTML = screenWidth > 775 ?
    '<tr><td colspan="5" style="text-align:center;">Loading...</td></tr>' : '<tr><td colspan="5" style="text-align:center; padding-left:35%;">Loading...</td></tr>'
  startProgressBar();

  try {
    const response = await fetch(exchange_class_get_by_slot_api(classCode,page), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    
    const data = await response.json();
    finishProgressBar();
    if (!response.ok) {
      if(response.status === 404){
        tableBody.innerHTML =
        `<tr><td colspan="5" style="text-align:center;">${data.error}: ${data.message}</td></tr>`;
      }
      else if(response.status === 401){
        tableBody.innerHTML =
        `<tr><td colspan="5" style="text-align:center;">Session failed. Please log in again</td></tr>`;
      }
      else{
        tableBody.innerHTML =
       `<tr><td colspan="5" style="text-align:center;">${data.error || "Error"}: ${data.message || "Unknown error"}</td></tr>`;
      }
      return null;
    }
   
    return data;
  } catch (error) {
    console.error("Failed to fetch exchange data:", error);
    finishProgressBar();
    tableBody.innerHTML =
      '<tr><td colspan="5" style="text-align:center; color:red;">Failed to load data.</td></tr>';
    return null;
  }
}

/**
 * Hàm hiển thị dữ liệu lấy được từ API ra bảng
 * @param {Array} data - Mảng dữ liệu các yêu cầu
 */
function displayData(data) {
  // Xóa nội dung cũ
  tableBody.innerHTML = "";

  if (!data || data.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;">No data available.</td></tr>';
    return;
  }

  data.forEach((item) => {
    // const contactInfo = `
    //         ${item.contact.email ? `<div class = "subInfo">${item.contact.email}</div>` : ""}
    //     `;

    const row = `
            <tr>
                <td data-label = "Id:">${item.id}</td>
                <td data-label = "Student code: ">${item.studentCode}</td>  
                <td data-label = "Current slot:">${item.currentSlot}</td>
                <td data-label = "Exchange to: ">${item.desiredSlot}</td>
                <td data-label = "Contact Information: ">Currently under maintainance</td>
            </tr>
        `;
    tableBody.innerHTML += row;
  });
}

/**
 * Cập nhật trạng thái của các nút điều khiển pagination
 */
function updatePaginationControls() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// async function loadPage(classCode, page) {
//   const backendPage = page - 1;
//   const responseData = await fetchExchangeData(classCode, backendPage);

//   if (responseData && responseData.data) {
//     currentPage = page;
//     totalPages = responseData.pagination.totalPages;

//     displayData(responseData.data);
//     updatePaginationControls();
//   }
// }
async function loadPage(classCode, page) {
  const backendPage = page - 1;
  const responseData = await fetchExchangeData(classCode, backendPage);

  console.log("Response from API:", responseData); // debug log

  if (responseData && responseData.data) {
    currentPage = page;
    totalPages = responseData.pagination?.totalPages || 1; // tránh undefined
    displayData(responseData.data);
  } else {
    tableBody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;">No data available.</td></tr>';
    totalPages = 1;
  }

  updatePaginationControls();
}


prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    loadPage(exchangeInput.value.trim(), currentPage - 1);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    loadPage(exchangeInput.value.trim(), currentPage + 1);
  }
});

searchBtn.addEventListener("click", () => {
  const findClass = exchangeInput.value.trim();
  currentPage = 1;
  loadPage(findClass, currentPage);
})