import { API_BASE_URL } from "./api-config"
import type { ApiError } from "./api-types"

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

            const data = await response.json()

            if (!response.ok) {
                const error: ApiError = data
                throw new Error(Array.isArray(error.details) ? error.details.join(", ") : error.details)
            }

            return data
        } catch (error) {
            if (error instanceof Error) {
                throw error
            }
            throw new Error("Произошла ошибка при выполнении запроса")
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
