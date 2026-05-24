import { createContext, useContext, useState,type ReactNode } from "react"
import { saveSession, clearSession } from "../utils/session"

type AuthUser = {
  username: string
  role: string
  token: string
}

type AuthContextType = {
  user: AuthUser | null
  login: (data: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const storedToken = sessionStorage.getItem("token")
  const storedRole = sessionStorage.getItem("role")
  const storedUsername = sessionStorage.getItem("username")

  const [user, setUser] = useState<AuthUser | null>(
    storedToken
      ? {
          token: storedToken,
          role: storedRole || "",
          username: storedUsername || ""
        }
      : null
  )

  const login = (data: AuthUser) => {

    saveSession(data)

    setUser({
      token: data.token,
      role: data.role,
      username: data.username
    })
  }

  const logout = () => {

    clearSession()
    setUser(null)

  }

  return (

    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>

  )
}

export const useAuth = () => {

  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}