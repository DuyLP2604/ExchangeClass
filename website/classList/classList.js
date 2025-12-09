import { get_classList } from "../../utils/apiconfig.js";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

const tableBody = document.getElementById("table_body");
const pageInfo = document.getElementById("pageInfo");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

let currentPage = 1;
const PAGE_SIZE = 15;

async function getClassList(page) {
    tableBody.innerHTML = `
        <tr><td colspan="2" style="text-align:center;">Fetching class list...</td></tr>
    `;

    try {
        const res = await fetchWithAuth(get_classList(page));
        const data = await res.json();

        if (!res.ok || data.processSuccess === false) {
            tableBody.innerHTML = `
                <tr><td colspan="2" style="text-align:center;">${data.message}</td></tr>
            `;
            return null;
        }

        return data.data;
    } catch (err) {
        console.error(err);
        alert("Cannot connect to server");
        return null;
    }
}

function displayClassList(list) {
    tableBody.innerHTML = "";

    if (!list || list.length === 0) {
        tableBody.innerHTML = `
            <tr><td colspan="2" style="text-align:center;">No classes available.</td></tr>
        `;
        return;
    }

    list.forEach(item => {
        tableBody.innerHTML += `
            <tr>
                <td>${item.classCode}</td>
                <td>${item.slot}</td>
            </tr>
        `;
    });
}

function updatePagination(length) {
    pageInfo.innerHTML = `Page ${currentPage}`;
    previousBtn.disabled = currentPage === 1;
    nextBtn.disabled = length < PAGE_SIZE;
}

async function loadClassList(page) {
    currentPage = page;
    const backendPage = page - 1;

    const list = await getClassList(backendPage);

    if (list) {
        displayClassList(list);
        updatePagination(list.length);
    } else {
        displayClassList([]);
        updatePagination(0);
    }
}

previousBtn.addEventListener("click", () => {
    if (currentPage > 1) loadClassList(currentPage - 1);
});

nextBtn.addEventListener("click", () => {
    loadClassList(currentPage + 1);
});


loadClassList(1);
