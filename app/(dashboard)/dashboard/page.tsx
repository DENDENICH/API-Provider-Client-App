"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentDeliveries } from "@/components/recent-deliveries"
import { useAuth } from "@/contexts/auth-context"
import { CompanyDashboard } from "@/components/company-dashboard"
import { SupplierDashboard } from "@/components/supplier-dashboard"

export default function DashboardPage() {
  const { role } = useAuth()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
      </div>

      {role === "company" ? (
        <CompanyDashboard />
      ) : role === "supplier" ? (
        <SupplierDashboard />
      ) : (
        <div className="text-center p-8">
          <p>Пожалуйста, войдите в систему для доступа к панели управления.</p>
        </div>
      )}

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
    </div>
  )
}
