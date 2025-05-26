"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const { role } = useAuth()

  // Общие пункты меню для всех ролей
  const commonLinks = [
    { href: "/dashboard", label: "Главная" },
    { href: "/deliveries", label: "Поставки" },
    { href: "/employees", label: "Сотрудники" }, // Добавляем новый пункт меню
  ]

  // Пункты меню для компаний
  const companyLinks = [
    { href: "/suppliers", label: "Поставщики" },
    { href: "/products", label: "Товары" },
    { href: "/expense", label: "Склад" }, // Добавляем новый пункт меню
  ]

  // Пункты меню для поставщиков
  const supplierLinks = [
    { href: "/delivery-requests", label: "Запросы на поставку" },
    { href: "/products/manage", label: "Управление товарами" },
  ]

  // Выбираем нужные пункты меню в зависимости от роли
  const links = [
    ...commonLinks,
    ...(role === "company" ? companyLinks : []),
    ...(role === "supplier" ? supplierLinks : []),
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === link.href || pathname.startsWith(`${link.href}/`) ? "text-primary" : "text-muted-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
