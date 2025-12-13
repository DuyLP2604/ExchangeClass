import { exchange_slot_create_api, exchange_class_get_by_slot_api, account_api } from "../../utils/apiconfig.js";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";
import { finishProgressBar } from "../../utils/finishProgressBar.js";
import { getProfile } from "../../utils/getProfile.js";
import { callLogout } from "../../utils/logout.js";
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

const themeBtn = document.getElementById("toggleTheme");

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

window.onload = async () => {
  await wakeupServer();

  const profileResponse = await getProfile(account_api);

  tableBody.innerHTML =
    window.innerWidth < 775
      ? `<tr><td colspan="5" style="text-align:center; padding-left:20%; white-space: nowrap">
            Type in class to find request.
         </td></tr>`
      : `<tr><td colspan="5" style="text-align:center;">
            Type in class to find request
         </td></tr>`;

  if (!token || profileResponse.status === 401 || !profileResponse.data) {
    handleLoggedOutState();
    return;
  }

  handleLoggedInState();
};

//====================UI FUNCTIONS=============================

async function handleLoggedOutState() {
  member_welcome.textContent = "Welcome, please log in first!";
  unloadProfile();
  unloadAvatar(false);
  await callLogout();

  profile.style.display = "none";
  logout.style.display = "none";

  addClassandSlotBtn.style.display = "none";
  addClassandSlotBtn.style.pointerEvents = "none";
}

function handleLoggedInState() {
  profile.style.display = "flex";
  logout.style.display = "flex";

  userAvatar(false);

  const username = localStorage.getItem("username");
  if (username) {
    member_welcome.innerHTML = `${getGreeting()}, 
      <span id="usernameGreeting" class="usernameGreeting">${username}</span>!`;
  }

  const isAdmin = localStorage.getItem("role") === "ADMIN";
  addClassandSlotBtn.style.display = isAdmin ? "flex" : "none";
  addClassandSlotBtn.style.pointerEvents = isAdmin ? "all" : "none";
}

function getGreeting() {
  if (hour <= 4) return "Good Night";
  if (hour <= 10) return "Have a nice day";
  if (hour <= 12) return "Have a nice day";
  if (hour <= 18) return "Good Afternoon";
  if (hour <= 21) return "Good Evening";
  return "Good Night";
}

//===================LOGOUT===============================

logout.addEventListener("click", async () => {
  const isLogout = await callLogout();

  if (!isLogout) {
    alert("Cannot logout due to server");
    return;
  }

  alert("Logout Successfully");
  performLogoutUI();
  window.location.href = "../home/home.html";
});

function performLogoutUI() {
  unloadProfile();
  unloadAvatar(false);

  profile.style.display = "none";
  logout.style.display = "none";

  addClassandSlotBtn.style.display = "none";
  addClassandSlotBtn.style.pointerEvents = "none";
}
//====================TOGGLE THEME=====================
function updateThemeIcon(theme){
  const icon = themeBtn.querySelector("i");
  if(theme === "dark"){
    icon.className = "fa-solid fa-moon";
  }
  else {
    icon.className = "fa-solid fa-cloud-sun";
  }
}

const savedTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeBtn.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme");
  const nextTheme = currentTheme === "light" ? "dark" : "light";

  document.body.setAttribute("data-theme", nextTheme);
  localStorage.setItem("theme", nextTheme);
  updateThemeIcon(nextTheme);
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
async function addRequest(studentCode, desiredClassCode) {
  startProgressBar();
  try{
    const res = await fetchWithAuth(exchange_slot_create_api, {
      method: "POST",
      body: JSON.stringify({studentCode, desiredClassCode})
    })

    const data = await res.json();
    finishProgressBar();
    if(res.status === 201){
      alert("Add request successfully");
    }
    else{
      alert(data.error + ": " + data.message);
    }
  }
  catch(err){
    console.error(err);
    alert("Redirect to log in");
    finishProgressBar();
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
  tableBody.innerHTML = window.innerWidth > 775 ?
    '<tr><td colspan="5" style="text-align:center;">Loading...</td></tr>' : '<tr><td colspan="5" style="text-align:center; padding-left:45%;">Loading...</td></tr>';
  startProgressBar();

  try {
    const response = await fetchWithAuth(exchange_class_get_by_slot_api(classCode,page));
    
    const data = await response.json();
    finishProgressBar();
    if (!response.ok) {
      tableBody.innerHTML =
        `<tr><td colspan="5" style="text-align:center;">${data.error}: ${data.message}</td></tr>`;
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
function updatePaginationControls(dataArrayLength) {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = dataArrayLength < 10;
}

async function loadPage(classCode, page) {
  let dataArrayLength = 0;
  const backendPage = page - 1;
  const responseData = await fetchExchangeData(classCode, backendPage);

  console.log("Response from API:", responseData); 

  if (responseData && responseData.data) {
    currentPage = page;
    dataArrayLength = responseData.data.length;
    displayData(responseData.data);
  } else {
    tableBody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;">No data available.</td></tr>';
    totalPages = 1;
  }

  updatePaginationControls(dataArrayLength);
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