"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function UserNav() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getRoleText = () => {
    switch (user?.role) {
      case "company":
        return "Компания"
      case "supplier":
        return "Поставщик"
      case "employee":
        return "Сотрудник"
      default:
        return ""
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt={user?.name || "Пользователь"} />
            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "ПЛ"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "Пользователь"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
            <p className="text-xs font-medium text-primary">{getRoleText()}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Удаляем пункты "Профиль" и "Настройки", оставляем только "Выйти" */}
        <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
