"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService, organizersService } from "@/lib/api-services"
import { apiClient } from "@/lib/api-client"
import type { UserLoginRequest, UserRegisterRequest, OrganizerRegisterRequest, AuthResponse } from "@/lib/api-types"

type UserRole = "company" | "supplier" | "employee" | null

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  organizationId?: string
  position?: string
  department?: string
}

interface AuthContextType {
  user: User | null
  role: UserRole
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: UserRegisterRequest) => Promise<AuthResponse>
  registerOrganization: (orgData: OrganizerRegisterRequest) => Promise<void>
  logout: () => void
  setUserRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        apiClient.setToken(token)
      } catch (error) {
        console.error("Ошибка при восстановлении пользователя:", error)
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const loginData: UserLoginRequest = { email, password }
      const response = await authService.login(loginData)

      // Сохраняем токен
      apiClient.setToken(response.access_token)

      // Определяем роль пользователя на основе next_route
      const role: UserRole = response.next_route === "/" ? "company" : null

      // Создаем объект пользователя
      const newUser: User = {
        id: "user-1", // В реальном приложении это будет приходить с сервера
        name: email.split("@")[0],
        email,
        role,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))

      // Если нужна регистрация организации, перенаправляем
      if (response.next_route === "organizers/register") {
        throw new Error("NEED_ORG_REGISTRATION")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: UserRegisterRequest): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const response = await authService.register(userData)

      // Сохраняем токен
      apiClient.setToken(response.access_token)

      // Если НЕ нужна регистрация организации, создаем пользователя
      if (response.next_route !== "organizers/register") {
        const newUser: User = {
          id: "user-1",
          name: userData.name,
          email: userData.email,
          role: userData.user_type === "organizer" ? "company" : "employee",
        }

        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
      }

      return response
    } finally {
      setIsLoading(false)
    }
  }

  const registerOrganization = async (orgData: OrganizerRegisterRequest) => {
    setIsLoading(true)
    try {
      await organizersService.register(orgData)

      // Обновляем роль пользователя
      if (user) {
        const updatedUser = { ...user, role: orgData.role as UserRole }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    apiClient.clearToken()
    localStorage.removeItem("user")
  }

  const setUserRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        login,
        register,
        registerOrganization,
        logout,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
