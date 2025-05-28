"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentDeliveries } from "@/components/recent-deliveries"
import { useAuth } from "@/contexts/auth-context"
import { CompanyDashboard } from "@/components/company-dashboard"
import { SupplierDashboard } from "@/components/supplier-dashboard"
import { NotOrganizerDashboard } from "@/components/not-organizer-dashboard"
import { useEffect } from "react"

export default function DashboardPage() {
  const { role, user } = useAuth()

  // Отладочная информация
  useEffect(() => {
    console.log("Dashboard - Current role:", role)
    console.log("Dashboard - Current user:", user)
    console.log("Dashboard - Role type:", typeof role)
  }, [role, user])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
      </div>

      {/* Временная отладочная информация */}
      <div className="bg-gray-100 p-4 rounded text-sm">
        <p>
          <strong>Debug info:</strong>
        </p>
        <p>Role: {role || "null"}</p>
        <p>Role type: {typeof role}</p>
        <p>User: {user ? JSON.stringify(user, null, 2) : "null"}</p>
      </div>

      {role === "company" ? (
        <CompanyDashboard />
      ) : role === "supplier" ? (
        <SupplierDashboard />
      ) : role === "not_have_organizer" ? (
        <NotOrganizerDashboard />
      ) : (
        <div className="text-center p-8">
          <p>Пожалуйста, войдите в систему для доступа к панели управления.</p>
          <p className="text-sm text-gray-500 mt-2">Текущая роль: {role || "не определена"}</p>
        </div>
      )}

      {/* Показываем карточки только для аутентифицированных пользователей с организацией */}
      {(role === "company" || role === "supplier") && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Обзор</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Недавние поставки</CardTitle>
              <CardDescription>Всего выполнено 12 поставок в этом месяце</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentDeliveries />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
