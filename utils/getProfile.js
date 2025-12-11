import { fetchWithAuth } from "./fetchWithAuth.js";

export async function getProfile(account_api) {
    try {
        const res = await fetchWithAuth(account_api);
        const response = await res.json();

        if (res.ok) {
            const data = response.data;

            localStorage.setItem("id", data.id);
            localStorage.setItem("classCode", data.classCode);
            localStorage.setItem("studentCode", data.studentCode);
            localStorage.setItem("accountName", data.accountName);
            localStorage.setItem("role", data.role);
            localStorage.setItem("email", data.email);

            return { status: res.status, data };
        } else {
            return { status: res.status, data: null };
        }

    } catch (error) {
        console.error("Get profile error:", error);
        return { status: 500, data: null };
    }
}

