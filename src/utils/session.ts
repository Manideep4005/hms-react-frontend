export const saveSession = (data: any) => {
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("role", data.role);
    sessionStorage.setItem("username", data.username);
}

export const getToken = () => {
    return sessionStorage.getItem("token");
}

export const getRole = () => {
    return sessionStorage.getItem("role");
}

export const clearSession = () =>{
  sessionStorage.clear()
}