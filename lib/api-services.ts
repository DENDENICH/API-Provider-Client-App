import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "./api-config"
import type {
  UserRegisterRequest,
  UserLoginRequest,
  AuthResponse,
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
  UsersCompanyWithUserInfo,
  LinkCodeResponse,
  AuthResponseAfterLogin,
} from "./api-types"

// Сервисы аутентификации
export const authService = {
  async register(data: UserRegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, data)
  },

  async login(data: UserLoginRequest): Promise<AuthResponseAfterLogin> {
    return apiClient.post<AuthResponseAfterLogin>(API_ENDPOINTS.AUTH_LOGIN, data)
  },
}

// Сервисы пользователей
export const usersService = {
  async getCompanyUsers(): Promise<UsersCompanyWithUserInfo> {
    return apiClient.get<UsersCompanyWithUserInfo>(API_ENDPOINTS.USERS_COMPANY)
  },

  async getLinkCode(): Promise<LinkCodeResponse> {
    return apiClient.get<LinkCodeResponse>(API_ENDPOINTS.LINK_CODE)
  },

  async linkUserToCompany(linkCode: number, role: "manager" | "employee"): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.USERS_COMPANY, { link_code: linkCode, role })
  },

  async removeUserFromCompany(userId?: number): Promise<void> {
    const url = userId ? `${API_ENDPOINTS.USERS_COMPANY}?user_id=${userId}` : API_ENDPOINTS.USERS_COMPANY
    return apiClient.delete<void>(url)
  },
}

// Сервисы организаций
export const organizersService = {
  async register(data: OrganizerRegisterRequest): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.ORGANIZERS_REGISTER, data)
  },
}

// Сервисы товаров
export const productsService = {
  async create(data: ProductRequest): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.PRODUCTS, data)
  },

  async getAll(supplierId?: number, addQuantity?: boolean): Promise<ProductsResponse> {
    const params = new URLSearchParams()
    if (supplierId) params.append("supplier_id", supplierId.toString())
    if (addQuantity) params.append("add_quantity", "true")

    const url = params.toString() ? `${API_ENDPOINTS.PRODUCTS}?${params}` : API_ENDPOINTS.PRODUCTS
    return apiClient.get<ProductsResponse>(url)
  },

  async getById(id: number): Promise<ProductResponse> {
    return apiClient.get<ProductResponse>(API_ENDPOINTS.PRODUCT_BY_ID(id))
  },

  async update(id: number, data: ProductResponse): Promise<ProductResponse> {
    return apiClient.put<ProductResponse>(API_ENDPOINTS.PRODUCT_BY_ID(id), data)
  },
}

// Сервисы поставок
export const suppliesService = {
  async getAll(isWaitConfirm?: boolean): Promise<SuppliesResponse> {
    const params = isWaitConfirm ? "?is_wait_confirm=true" : ""
    return apiClient.get<SuppliesResponse>(`${API_ENDPOINTS.SUPPLIES}${params}`)
  },

  async create(data: SupplyCreateRequest): Promise<SupplyResponse> {
    return apiClient.post<SupplyResponse>(API_ENDPOINTS.SUPPLIES, data)
  },

  async getById(id: number): Promise<SupplyResponse> {
    return apiClient.get<SupplyResponse>(API_ENDPOINTS.SUPPLY_BY_ID(id))
  },

  async updateStatus(id: number, data: SupplyStatusUpdate): Promise<SupplyResponse> {
    return apiClient.patch<SupplyResponse>(API_ENDPOINTS.SUPPLY_STATUS(id), data)
  },

  async acceptOrCancel(id: number, data: SupplyAssembleCancelled): Promise<SupplyResponse> {
    return apiClient.patch<SupplyResponse>(API_ENDPOINTS.SUPPLY_BY_ID(id), data)
  },
}

// Сервисы поставщиков
export const suppliersService = {
  async getAll(): Promise<SuppliersResponse> {
    return apiClient.get<SuppliersResponse>(API_ENDPOINTS.SUPPLIERS)
  },

  async getByInn(inn: number): Promise<SupplierResponse> {
    return apiClient.get<SupplierResponse>(API_ENDPOINTS.SUPPLIER_BY_INN(inn))
  },

  async addToContacts(id: number): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.SUPPLIER_BY_ID(id), {})
  },

  async removeFromContacts(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.SUPPLIER_BY_ID(id))
  },
}

// Сервисы расходов склада
export const expensesService = {
  async getAll(): Promise<Expenses> {
    return apiClient.get<Expenses>(API_ENDPOINTS.EXPENSES)
  },

  async updateQuantity(id: number, quantity: number): Promise<Expense> {
    return apiClient.patch<Expense>(API_ENDPOINTS.EXPENSE_BY_ID(id), { quantity })
  },

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.EXPENSE_BY_ID(id))
  },
}
