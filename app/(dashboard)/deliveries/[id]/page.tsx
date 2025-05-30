"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Printer } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { SupplyResponse } from "@/lib/api-types"

// Функция для отображения статуса поставки
function StatusBadge({ status }: { status: SupplyResponse["status"] }) {
  let badgeContent
  let badgeClass

  switch (status) {
    case "assembled":
      badgeContent = "Собран"
      badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-100"
      break
    case "in_delivery":
      badgeContent = "В доставке"
      badgeClass = "bg-orange-100 text-orange-800 hover:bg-orange-100"
      break
    case "delivered":
      badgeContent = "Доставлен"
      badgeClass = "bg-green-100 text-green-800 hover:bg-green-100"
      break
    case "adopted":
      badgeContent = "Принят"
      badgeClass = "bg-green-500 text-white hover:bg-green-600"
      break
    case "cancelled":
      badgeContent = "Отменен"
      badgeClass = "bg-red-100 text-red-800 hover:bg-red-100"
      break
    default:
      return null
  }

  return (
    <Badge variant="outline" className={badgeClass}>
      {badgeContent}
    </Badge>
  )
}

export default function DeliveryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [delivery, setDelivery] = useState<SupplyResponse | null>(null)

  // Проверяем, не является ли текущий маршрут /deliveries/create
  useEffect(() => {
    if (params.id === "create") {
      router.push("/deliveries/create")
      return
    }

    // Загрузка данных о поставке из localStorage
    const loadDeliveryData = () => {
      setIsLoading(true)
      try {
        console.log(`Loading delivery data for ID: ${params.id}`)

        // Получаем данные из localStorage
        const deliveryDataString = localStorage.getItem(`delivery_${params.id}`)

        if (!deliveryDataString) {
          console.error("Delivery data not found in localStorage")
          toast({
            title: "Ошибка",
            description: "Данные о поставке не найдены. Попробуйте вернуться к списку поставок.",
            variant: "destructive",
          })
          return
        }

        const deliveryData = JSON.parse(deliveryDataString) as SupplyResponse
        console.log("Delivery data loaded from localStorage:", deliveryData)

        setDelivery(deliveryData)
      } catch (error) {
        console.error("Ошибка при загрузке данных о поставке:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные о поставке",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDeliveryData()
  }, [params.id, toast, router])

  // Если идентификатор "create", то мы уже перенаправили пользователя
  if (params.id === "create") {
    return null
  }

  // Функция для скачивания накладной
  const handleDownloadInvoice = () => {
    if (!delivery) return

    let invoiceText = "НАКЛАДНАЯ\n\n"
    invoiceText += `Дата: ${new Date().toLocaleDateString("ru-RU")}\n`
    invoiceText += `Номер поставки: #${delivery.article}\n\n`

    invoiceText += "Информация о поставке:\n"
    invoiceText += `Поставщик: ${delivery.supplier.name}\n`
    invoiceText += `Заказчик: ${delivery.company.name}\n`
    invoiceText += `Адрес доставки: ${delivery.delivery_address}\n`
    invoiceText += `Статус: ${delivery.status}\n\n`

    invoiceText += "Товары:\n"
    delivery.supply_products.forEach((product, index) => {
      const totalPrice = product.product.price * product.quantity
      invoiceText += `${index + 1}. ${product.product.name}\n`
      invoiceText += `   Артикул: ${product.product.article}\n`
      invoiceText += `   Цена за единицу: ${product.product.price.toFixed(2)} ₽\n`
      invoiceText += `   Количество: ${product.quantity} шт.\n`
      invoiceText += `   Сумма: ${totalPrice.toFixed(2)} ₽\n\n`
    })

    invoiceText += `Общая сумма: ${delivery.total_price.toFixed(2)} ₽\n\n`
    invoiceText += "Подпись: ___________________"

    const blob = new Blob([invoiceText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Накладная_${delivery.article}_${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Накладная скачана",
      description: "Накладная успешно скачана",
    })
  }

  // Функция для печати информации о поставке
  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Детали поставки</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!delivery) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Детали поставки</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground">Поставка не найдена</p>
            <Button className="mt-4" onClick={() => router.push("/deliveries")}>
              Вернуться к списку поставок
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 print:p-10">
      {/* Заголовок страницы с кнопкой возврата и статусом поставки */}
      <div className="flex items-center gap-4 print:hidden">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Поставка #{delivery.article}</h2>
        <div className="ml-auto flex items-center gap-2">
          <StatusBadge status={delivery.status} />
          <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
            <Download className="h-4 w-4 mr-2" /> Скачать накладную
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Печать
          </Button>
        </div>
      </div>

      {/* Заголовок для печати */}
      <div className="hidden print:flex print:flex-col print:gap-2">
        <h1 className="text-3xl font-bold">Поставка #{delivery.article}</h1>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">Статус:</p>
          <StatusBadge status={delivery.status} />
        </div>
      </div>

      {/* Основная информация о поставке */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Информация о поставке</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Номер поставки</p>
                <p>#{delivery.article}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID поставки</p>
                <p>{delivery.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Поставщик</p>
                <p>{delivery.supplier.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Заказчик</p>
                <p>{delivery.company.name}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Статус</p>
                <StatusBadge status={delivery.status} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Информация о доставке</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Адрес доставки</p>
              <p>{delivery.delivery_address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Общая сумма</p>
              <p className="text-xl font-bold">{delivery.total_price.toFixed(2)} ₽</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Таблица с товарами в поставке */}
      <Card>
        <CardHeader>
          <CardTitle>Товары</CardTitle>
          <CardDescription>Список товаров в поставке</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-4 text-left font-medium">Название</th>
                  <th className="h-10 px-4 text-center font-medium">Артикул</th>
                  <th className="h-10 px-4 text-center font-medium">Количество</th>
                  <th className="h-10 px-4 text-right font-medium">Цена за единицу</th>
                  <th className="h-10 px-4 text-right font-medium">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {delivery.supply_products.map((item, index) => {
                  const total = item.product.price * item.quantity

                  return (
                    <tr key={index} className="border-b">
                      <td className="p-4">{item.product.name}</td>
                      <td className="p-4 text-center">{item.product.article}</td>
                      <td className="p-4 text-center">{item.quantity} шт.</td>
                      <td className="p-4 text-right">{item.product.price.toFixed(2)} ₽</td>
                      <td className="p-4 text-right font-medium">{total.toFixed(2)} ₽</td>
                    </tr>
                  )
                })}
                <tr>
                  <td colSpan={4} className="p-4 text-right font-medium">
                    Итого:
                  </td>
                  <td className="p-4 text-right font-bold">{delivery.total_price.toFixed(2)} ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
