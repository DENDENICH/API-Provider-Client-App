import { API_BASE_URL } from "./api-config"
import type { ApiError } from "./api-types"

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
  ) {
    super(message)
    this.name = "ApiClientError"
  }
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Загружаем токен из localStorage при инициализации
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
    }
  }

  private getErrorMessage(status: number, details?: string | string[]): string {
    const detailsMessage = Array.isArray(details) ? details.join(", ") : details || ""

    switch (status) {
      case 400:
        return `Неверный запрос: ${detailsMessage}`
      case 401:
        return "Необходима авторизация. Пожалуйста, войдите в систему"
      case 403:
        return "Доступ запрещен. У вас нет прав для выполнения этого действия"
      case 404:
        // Для логина возвращаем специальное сообщение
        if (detailsMessage.toLowerCase().includes("user") || detailsMessage.toLowerCase().includes("пользователь")) {
          return "Пользователь с указанными данными не найден. Проверьте email и пароль"
        }
        return `Ресурс не найден: ${detailsMessage}`
      case 422:
        return `Ошибка валидации данных: ${detailsMessage}`
      case 500:
        return "Внутренняя ошибка сервера. Попробуйте позже"
      case 502:
        return "Сервер временно недоступен. Попробуйте позже"
      case 503:
        return "Сервис временно недоступен. Попробуйте позже"
      default:
        if (status >= 500) {
          return "Ошибка сервера. Попробуйте позже"
        }
        return detailsMessage || "Произошла неизвестная ошибка"
    }
  }

  private getErrorCode(status: number, endpoint?: string): string {
    switch (status) {
      case 400:
        return "BAD_REQUEST"
      case 401:
        return "UNAUTHORIZED"
      case 403:
        return "FORBIDDEN"
      case 404:
        // Специальный код для логина
        if (endpoint?.includes("/auth/login")) {
          return "USER_NOT_FOUND"
        }
        return "NOT_FOUND"
      case 422:
        return "VALIDATION_ERROR"
      case 500:
        return "INTERNAL_SERVER_ERROR"
      case 502:
        return "BAD_GATEWAY"
      case 503:
        return "SERVICE_UNAVAILABLE"
      default:
        if (status >= 500) {
          return "SERVER_ERROR"
        }
        return "UNKNOWN_ERROR"
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    // Добавляем существующие заголовки из options
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value
        })
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value
        })
      } else {
        Object.assign(headers, options.headers)
      }
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)

      // Если ответ пустой (204 No Content), возвращаем пустой объект
      if (response.status === 204) {
        return {} as T
      }

      // Если ответ успешный, парсим JSON
      if (response.ok) {
        const data = await response.json()
        return data
      }

      // Обработка ошибок
      let errorData: ApiError | null = null
      try {
        errorData = await response.json()
      } catch {
        // Если не удалось распарсить JSON, используем статус текст
        errorData = { details: response.statusText }
      }

      const errorMessage = this.getErrorMessage(response.status, errorData?.details)
      const errorCode = this.getErrorCode(response.status, endpoint)

      // Для 401 ошибки очищаем токен
      if (response.status === 401) {
        this.clearToken()
        // Можно добавить редирект на страницу логина
        if (typeof window !== "undefined" && !endpoint.includes("/auth/")) {
          window.location.href = "/login"
        }
      }

      throw new ApiClientError(errorMessage, response.status, errorCode)
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error
      }

      // Обработка сетевых ошибок
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new ApiClientError(
          "Не удалось подключиться к серверу. Проверьте подключение к интернету",
          0,
          "NETWORK_ERROR",
        )
      }

      throw new ApiClientError("Произошла неизвестная ошибка", 0, "UNKNOWN_ERROR")
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
