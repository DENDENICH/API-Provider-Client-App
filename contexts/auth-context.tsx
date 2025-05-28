"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService, organizersService } from "@/lib/api-services"
import { apiClient } from "@/lib/api-client"
import type {
  UserLoginRequest,
  UserRegisterRequest,
  OrganizerRegisterRequest,
  AuthResponse,
  AuthResponseAfterLogin,
  OrganizerResponse,
} from "@/lib/api-types"

type UserRole = "company" | "supplier" | "employee" | "not_have_organizer" | null

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
  login: (email: string, password: string) => Promise<AuthResponseAfterLogin>
  register: (userData: UserRegisterRequest) => Promise<AuthResponse>
  registerOrganization: (orgData: OrganizerRegisterRequest) => Promise<OrganizerResponse>
  logout: () => void
  setUserRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingUserData, setPendingUserData] = useState<UserRegisterRequest | null>(null)

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const storedUser = localStorage.getItem("user")
    const storedPendingData = localStorage.getItem("pending_user_data")

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        console.log("AuthContext - Restored user from localStorage:", userData)
        setUser(userData)
        apiClient.setToken(token)
      } catch (error) {
        console.error("Ошибка при восстановлении пользователя:", error)
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
      }
    }

    if (storedPendingData) {
      try {
        const pendingData = JSON.parse(storedPendingData)
        console.log("AuthContext - Restored pending user data:", pendingData)
        setPendingUserData(pendingData)
      } catch (error) {
        console.error("Ошибка при восстановлении pending данных:", error)
        localStorage.removeItem("pending_user_data")
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<AuthResponseAfterLogin> => {
    setIsLoading(true)
    try {
      const loginData: UserLoginRequest = { email, password }
      const response = await authService.login(loginData)

      console.log("AuthContext - Login response:", response)

      // Сохраняем токен
      apiClient.setToken(response.access_token)

      // Создаем объект пользователя на основе role_organizer
      const newUser: User = {
        id: "user-1", // В реальном приложении это будет приходить с сервера
        name: email.split("@")[0],
        email,
        role: response.role_organizer,
      }

      console.log("AuthContext - Setting user after login:", newUser)
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))

      return response
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: UserRegisterRequest): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const response = await authService.register(userData)

      console.log("AuthContext - Register response:", response)

      // Сохраняем токен
      apiClient.setToken(response.access_token)

      if (response.next_route === "organizers/register") {
        // Если нужна регистрация организации, сохраняем данные пользователя для последующего использования
        console.log("AuthContext - Saving pending user data for organization registration")
        setPendingUserData(userData)
        localStorage.setItem("pending_user_data", JSON.stringify(userData))
      } else {
        // Если НЕ нужна регистрация организации, создаем пользователя
        const newUser: User = {
          id: "user-1",
          name: userData.name,
          email: userData.email,
          role: "not_have_organizer", // Для пользователей без организации
        }

        console.log("AuthContext - Setting user after register:", newUser)
        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
      }

      return response
    } finally {
      setIsLoading(false)
    }
  }

  const registerOrganization = async (orgData: OrganizerRegisterRequest): Promise<OrganizerResponse> => {
    setIsLoading(true)
    try {
      const response = await organizersService.register(orgData)

      console.log("AuthContext - Organization register response:", response)

      // Создаем пользователя с данными из регистрации и ролью организации
      const userData = pendingUserData || {
        name: "Unknown User",
        email: "unknown@example.com",
        phone: "",
        password: "",
        user_type: "organizer" as const,
      }

      const newUser: User = {
        id: "user-1",
        name: userData.name,
        email: userData.email,
        role: response.role as UserRole,
      }

      console.log("AuthContext - Creating user after organization registration:", newUser)
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))

      // Очищаем временные данные
      setPendingUserData(null)
      localStorage.removeItem("pending_user_data")

      return response
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setPendingUserData(null)
    apiClient.clearToken()
    localStorage.removeItem("user")
    localStorage.removeItem("pending_user_data")
  }

  const setUserRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role }
      console.log("AuthContext - Manual role update:", updatedUser)
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  // Отладочная информация при изменении пользователя
  useEffect(() => {
    console.log("AuthContext - User state changed:", user)
    console.log("AuthContext - Current role:", user?.role)
    console.log("AuthContext - Pending user data:", pendingUserData)
  }, [user, pendingUserData])

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
