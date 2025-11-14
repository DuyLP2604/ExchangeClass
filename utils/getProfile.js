export async function getProfile(account_api, token) {
    try{
        const res = await fetch(account_api, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const response = await res.json();
        const data = response.data;
        
        console.log(data);
        if(res.ok){
            localStorage.setItem("id", data.id);
            localStorage.setItem("classCode", data.classCode);
            localStorage.setItem("studentCode", data.studentCode);
            localStorage.setItem("accountName", data.accountName);
            localStorage.setItem("role", data.role);
            return data;
        }
        else if(res.status === 401){
            alert(data.error + ": " + data.message);
        }
    }
    catch(error){
        console.log(error);
    }
}