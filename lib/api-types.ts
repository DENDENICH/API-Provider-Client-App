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

export interface AuthResponseAfterRegister {
  access_token: string
  type_token: string
  next_route: "organizers/register" | "/"
}

export interface AuthResponseAfterLogin {
  access_token: string
  type_token: string
  role_organizer: "company" | "supplier" | "not_have_organizer"
  user_type: "admin" | "manager" | "employee"
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

// Тип для кода привязки
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

// Остальные типы остаются без изменений...
