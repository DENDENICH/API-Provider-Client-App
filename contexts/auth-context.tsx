"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
  logout: () => void
  setUserRole: (role: UserRole) => void
  registerWithInvite: (userData: any, inviteCode: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Имитация загрузки пользователя
  useEffect(() => {
    // В реальном приложении здесь будет проверка сессии/токена
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Для демонстрации создаем пользователя с ролью на основе email
      const role = email.includes("supplier") ? "supplier" : "company"
      const newUser = {
        id: "user-1",
        name: email.split("@")[0],
        email,
        role,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const setUserRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  // Новая функция для регистрации по коду приглашения
  const registerWithInvite = async (userData: any, inviteCode: string) => {
    setIsLoading(true)
    try {
      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Создаем нового пользователя на основе данных из формы и кода приглашения
      const newUser = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.organizationType, // company или supplier
        organizationId: "org-1", // В реальном приложении это будет ID организации из кода приглашения
        position: userData.position,
        department: userData.department,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        login,
        logout,
        setUserRole,
        registerWithInvite,
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
