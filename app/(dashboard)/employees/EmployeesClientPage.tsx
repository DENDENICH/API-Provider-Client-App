"use client"

import { EmployeesTable } from "@/components/employees-table"
import { InviteEmployeeForm } from "@/components/invite-employee-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

export default function EmployeesClientPage() {
  const { role } = useAuth()
  const [activeTab, setActiveTab] = useState("employees")

  const organizationType = role === "company" ? "компании" : "поставщика"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Сотрудники</h2>
      </div>

      <Tabs defaultValue="employees" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="employees">Список сотрудников</TabsTrigger>
          <TabsTrigger value="invite">Добавить сотрудника</TabsTrigger>
        </TabsList>
        <TabsContent value="employees" className="mt-4">
          <EmployeesTable />
        </TabsContent>
        <TabsContent value="invite" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Добавить сотрудника</CardTitle>
              <CardDescription>Добавьте нового сотрудника в вашу организацию</CardDescription>
            </CardHeader>
            <CardContent>
              <InviteEmployeeForm organizationType={organizationType} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
