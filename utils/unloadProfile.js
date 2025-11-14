export function unloadProfile(){
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("classCode");
    localStorage.removeItem("studentCode");
    localStorage.removeItem("accountName");
    localStorage.removeItem("role");
}