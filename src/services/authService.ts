import api from "../api/axios"

/**
 * Login API
 */

export const loginUser = async (email: string, password: string) => {

  const response = await api.post("/auth/login", {
    email,
    password
  })

  return response.data
}

/**
 * Register API
 */

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  mobileNumber: string
) => {

  const response = await api.post("/auth/register", {
    firstName,
    lastName,
    email,
    password,
    mobileNumber
  })

  return response.data
}



export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email })
  return response.data
}


export const verifyOtp = async (email: string, otp: string) => {
  const response = await api.post("/auth/verify-otp", { email, otp })
  return response.data
}



export const resetPassword = async (email: string, newPassword: string) => {
  const response = await api.post("/auth/reset-password", { email, newPassword })
  return response.data
}