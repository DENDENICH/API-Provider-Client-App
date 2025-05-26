import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "./api-config"
import type {
    UserRegisterRequest,
    UserLoginRequest,
    AuthResponse,
    UsersCompanyWithUserInfo,
    OrganizerRegisterRequest,
    ProductRequest,
    ProductResponse,
    ProductsResponse,
    SupplyCreateRequest,
    SupplyResponse,
    SuppliesResponse,
    SupplyStatusUpdate,
    SupplyAssembleCancelled,
    SuppliersResponse,
    SupplierResponse,
    Expenses,
    Expense,
} from "./api-types"

// Сервисы для аутентификации
export const authService = {
    register: (data: UserRegisterRequest): Promise<AuthResponse> => apiClient.post(API_ENDPOINTS.AUTH_REGISTER, data),

    login: (data: UserLoginRequest): Promise<AuthResponse> => apiClient.post(API_ENDPOINTS.AUTH_LOGIN, data),
}

// Сервисы для пользователей
export const usersService = {
    getCompanyUsers: (): Promise<UsersCompanyWithUserInfo> => apiClient.get(API_ENDPOINTS.USERS_COMPANY),

    addUserToCompany: (data: { link_code: number; role: "manager" | "employee" }): Promise<void> =>
        apiClient.post(API_ENDPOINTS.USERS_COMPANY, data),

    removeUserFromCompany: (userId: number): Promise<void> =>
        apiClient.delete(`${API_ENDPOINTS.USERS_COMPANY}?user_id=${userId}`),
}

// Сервисы для организаций
export const organizersService = {
    register: (data: OrganizerRegisterRequest): Promise<void> => apiClient.post(API_ENDPOINTS.ORGANIZERS_REGISTER, data),
}

// Сервисы для товаров
export const productsService = {
    getProducts: (params?: { supplier_id?: number; add_quantity?: boolean }): Promise<ProductsResponse> => {
        const searchParams = new URLSearchParams()
        if (params?.supplier_id) searchParams.append("supplier_id", params.supplier_id.toString())
        if (params?.add_quantity) searchParams.append("add_quantity", params.add_quantity.toString())

        const endpoint = searchParams.toString()
            ? `${API_ENDPOINTS.PRODUCTS}?${searchParams.toString()}`
            : API_ENDPOINTS.PRODUCTS

        return apiClient.get(endpoint)
    },

    getProduct: (id: number): Promise<ProductResponse> => apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id)),

    createProduct: (data: ProductRequest): Promise<void> => apiClient.post(API_ENDPOINTS.PRODUCTS, data),

    updateProduct: (id: number, data: ProductResponse): Promise<ProductResponse> =>
        apiClient.put(API_ENDPOINTS.PRODUCT_BY_ID(id), data),
}

// Сервисы для поставок
export const suppliesService = {
    getSupplies: (params?: { is_wait_confirm?: boolean }): Promise<SuppliesResponse> => {
        const searchParams = new URLSearchParams()
        if (params?.is_wait_confirm) searchParams.append("is_wait_confirm", params.is_wait_confirm.toString())

        const endpoint = searchParams.toString()
            ? `${API_ENDPOINTS.SUPPLIES}?${searchParams.toString()}`
            : API_ENDPOINTS.SUPPLIES

        return apiClient.get(endpoint)
    },

    getSupply: (id: number): Promise<SupplyResponse> => apiClient.get(API_ENDPOINTS.SUPPLY_BY_ID(id)),

    createSupply: (data: SupplyCreateRequest): Promise<SupplyResponse> => apiClient.post(API_ENDPOINTS.SUPPLIES, data),

    updateSupplyStatus: (id: number, data: SupplyStatusUpdate): Promise<SupplyResponse> =>
        apiClient.patch(API_ENDPOINTS.SUPPLY_STATUS(id), data),

    acceptOrCancelSupply: (id: number, data: SupplyAssembleCancelled): Promise<SupplyResponse> =>
        apiClient.patch(API_ENDPOINTS.SUPPLY_BY_ID(id), data),
}

// Сервисы для поставщиков
export const suppliersService = {
    getSuppliers: (): Promise<SuppliersResponse> => apiClient.get(API_ENDPOINTS.SUPPLIERS),

    getSupplierByInn: (inn: string): Promise<SupplierResponse> => apiClient.get(API_ENDPOINTS.SUPPLIER_BY_INN(inn)),

    addSupplier: (id: number): Promise<void> => apiClient.post(API_ENDPOINTS.SUPPLIER_BY_ID(id), {}),

    removeSupplier: (id: number): Promise<void> => apiClient.delete(API_ENDPOINTS.SUPPLIER_BY_ID(id)),
}

// Сервисы для расходов склада
export const expensesService = {
    getExpenses: (): Promise<Expenses> => apiClient.get(API_ENDPOINTS.EXPENSES),

    updateExpenseQuantity: (id: number, quantity: number): Promise<Expense> =>
        apiClient.patch(API_ENDPOINTS.EXPENSE_BY_ID(id), { quantity }),

    deleteExpense: (id: number): Promise<void> => apiClient.delete(API_ENDPOINTS.EXPENSE_BY_ID(id)),
}
