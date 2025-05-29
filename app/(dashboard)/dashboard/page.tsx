"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanyDashboard } from "@/components/company-dashboard"
import { SupplierDashboard } from "@/components/supplier-dashboard"
import { NotOrganizerDashboard } from "@/components/not-organizer-dashboard"
import { Overview } from "@/components/overview"
import { RecentDeliveries } from "@/components/recent-deliveries"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  // Если у пользователя нет организации, показываем страницу с кодом привязки
  if (user?.organizerRole === "not_have_organizer") {
    return <NotOrganizerDashboard />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
      </div>

      {/* Отображаем соответствующий дашборд в зависимости от роли организации */}
      {user?.organizerRole === "company" ? (
        <CompanyDashboard />
      ) : user?.organizerRole === "supplier" ? (
        <SupplierDashboard />
      ) : null}

      {/* Отображаем карточки только для аутентифицированных пользователей */}
      {user && (
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
