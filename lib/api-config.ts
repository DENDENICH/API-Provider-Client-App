// Конфигурация API
export const API_BASE_URL = "http://localhost:7654"

// Эндпоинты API
export const API_ENDPOINTS = {
    // Аутентификация
    AUTH_REGISTER: "/auth/register",
    AUTH_LOGIN: "/auth/login",

    // Пользователи
    USERS_COMPANY: "/users/company",

    // Организации
    ORGANIZERS_REGISTER: "/organizers/register",

    // Товары
    PRODUCTS: "/products",
    PRODUCT_BY_ID: (id: number) => `/products/${id}`,

    // Поставки
    SUPPLIES: "/supplies",
    SUPPLY_BY_ID: (id: number) => `/supplies/${id}`,
    SUPPLY_STATUS: (id: number) => `/supplies/${id}/status`,

    // Поставщики
    SUPPLIERS: "/suppliers",
    SUPPLIER_BY_INN: (inn: string) => `/suppliers/${inn}`,
    SUPPLIER_BY_ID: (id: number) => `/suppliers/${id}`,

    // Расходы склада
    EXPENSES: "/expenses/",
    EXPENSE_BY_ID: (id: number) => `/expenses/${id}/`,
} as const
