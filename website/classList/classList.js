import { get_classList } from "../../utils/apiconfig.js";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

const tableBody = document.getElementById("table_body");

async function getClassList() {
    tableBody.innerHTML = '';
    tableBody.innerHTML = '<tr><td colspan="2" style="text-align:center;">Fetching class list...</td></tr>';

    try{
        const res = await fetchWithAuth(get_classList(page));
        const json = await res.json();
        const data = json.data;
        if(res.ok){
            data.forEach((item) => {
                const row = `
                        <tr>
                            <td>${item.classCode}</td>
                            <td>${item.slot}</td>
                        </tr>
                    `;
                tableBody.innerHTML += row;
            });
        }
        else{
            tableBody.innerHTML = `<tr><td colspan="2" style="text-align:center;">${json.message}</td></tr>`;
        }
    }catch(error){
        console.error(error);
        alert("Cannot connect to server");
    }
}

window.addEventListener("load", getClassList);