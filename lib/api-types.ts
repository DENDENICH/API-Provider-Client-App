// Базовые типы
export interface ApiError {
  details: string | string[]
}

// Типы для аутентификации
export interface UserRegisterRequest {
  name: string
  email: string
  phone: string
  password: string
  user_type: "organizer" | "employee"
}

export interface UserLoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  type_token: string
  next_route: "organizers/register" | "/"
}

// Новый тип для ответа после логина
export interface AuthResponseAfterLogin {
  access_token: string
  type_token: string
  role_organizer: "company" | "supplier" | "not_have_organizer"
}

// Типы для пользователей
export interface UserCompanyWithUserInfo {
  name: string
  email: string
  phone: string
  role: string
  user_id: number
}

export interface UsersCompanyWithUserInfo {
  users: UserCompanyWithUserInfo[]
}

// Исправленный тип для кода привязки
export interface LinkCodeResponse {
  linkcode: number
}

// Типы для организаций
export interface OrganizerRegisterRequest {
  name: string
  role: "company" | "supplier"
  address: string
  inn: string
  bank_details: string
}

export interface OrganizerResponse {
  id: number
  name: string
  role: "company" | "supplier"
  address: string
  inn: string
  bank_details: string
}

// Типы для товаров
export type ProductCategory =
  | "hair_coloring"
  | "hair_care"
  | "hair_styling"
  | "consumables"
  | "perming"
  | "eyebrows"
  | "manicure_and_pedicure"
  | "tools_and_equipment"

export interface ProductRequest {
  name: string
  category: ProductCategory
  price: number
  description: string
  quantity: number
}

export interface ProductResponse {
  id: number
  article: number
  name: string
  category: string
  description: string
  price: number
  quantity?: number
  organizer_name: string
}

export interface ProductResponseSupply {
  id: number
  article: number
  name: string
  category: ProductCategory
  price: number
}

export interface ProductsResponse {
  products: ProductResponse[]
}

// Типы для поставок
export interface SupplyCreateRequest {
  supplier_id: number
  delivery_address: string
  total_price: number
  supply_products: {
    product_id: number
    quantity: number
  }[]
}

export type SupplyStatus = "assembled" | "in_delivery" | "adopted" | "delivered" | "cancelled"

export interface SupplyResponse {
  id: number
  supplier: {
    id: number
    name: string
  }
  company: {
    id: number
    name: string
  }
  supply_products: {
    product: ProductResponseSupply
    quantity: number
  }[]
  couriers_phone: string
  article: number
  delivery_address: string
  total_price: number
  status: SupplyStatus
  create_datetime: string
  delivery_datetime: string
}

export interface SuppliesResponse {
  supplies: SupplyResponse[]
}

export interface SupplyStatusUpdate {
  status: "assembled" | "in_delivery" | "adopted" | "delivered"
}

export interface SupplyAssembleCancelled {
  status: "cancelled" | "assembled"
}

// Типы для поставщиков
export interface SupplierResponse {
  id: number
  name: string
  address: string
  inn: string
  bank_details: string
}

export interface SuppliersResponse {
  organizers: SupplierResponse[]
}

// Типы для расходов склада
export type ExpenseCategory =
  | "hair_coloring"
  | "hair_care"
  | "hair_styling"
  | "consumables"
  | "perming"
  | "eyebrows_and_eyelashes"
  | "manicure_and_pedicure"
  | "tools_and_equipment"

export interface Expense {
  product_id: number
  organizer_name: string
  article: number
  product_name: string
  category: ExpenseCategory
  description: string
  quantity: number
}

export interface Expenses {
  expenses: Expense[]
}
