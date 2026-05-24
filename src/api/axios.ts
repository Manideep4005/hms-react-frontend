import axios from "axios"
import { getToken } from "../utils/session"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {

  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {

    const url = error.config?.url

    // Skip redirect for login request
    if (url?.includes("/auth/login")) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      window.location.href = "/unauthorized"
    }

    if (error.response?.status === 403) {
      window.location.href = "/forbidden"
    }

    return Promise.reject(error)
  }
)

export default api;