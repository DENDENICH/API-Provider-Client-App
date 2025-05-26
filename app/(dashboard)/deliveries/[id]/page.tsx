"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Printer } from "lucide-react"
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// Типы данных для товара в поставке
type DeliveryProduct = {
  id: string
  name: string
  quantity: number
  price: string
}

// Типы данных для поставки
type Delivery = {
  id: string
  number: string
  supplier: string
  orderDate: string
  products: DeliveryProduct[]
  status: "processing" | "collected" | "delivering" | "delivered" | "accepted" | "canceled"
  customer: string
  courier: string
  address: string
  deliveryDate: string
  amount: string
  receipt?: string
  notes?: string
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "refunded"
  trackingNumber?: string
}

// Функция для отображения статуса поставки
function StatusBadge({ status }: { status: Delivery["status"] }) {
  let badgeContent
  let badgeClass

  switch (status) {
    case "processing":
      badgeContent = "В обработке"
      badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      break
    case "collected":
      badgeContent = "Собран"
      badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-100"
      break
    case "delivering":
      badgeContent = "В доставке"
      badgeClass = "bg-orange-100 text-orange-800 hover:bg-orange-100"
      break
    case "delivered":
      badgeContent = "Доставлен"
      badgeClass = "bg-green-100 text-green-800 hover:bg-green-100"
      break
    case "accepted":
      badgeContent = "Принят"
      badgeClass = "bg-green-500 text-white hover:bg-green-600"
      break
    case "canceled":
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

// Функция для отображения статуса оплаты
function PaymentStatusBadge({ status }: { status: Delivery["paymentStatus"] }) {
  let badgeContent
  let badgeClass

  switch (status) {
    case "pending":
      badgeContent = "Ожидает оплаты"
      badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      break
    case "paid":
      badgeContent = "Оплачено"
      badgeClass = "bg-green-100 text-green-800 hover:bg-green-100"
      break
    case "refunded":
      badgeContent = "Возврат"
      badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-100"
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
  const [delivery, setDelivery] = useState<Delivery | null>(null)

  // Проверяем, не является ли текущий маршрут /deliveries/create
  useEffect(() => {
    if (params.id === "create") {
      router.push("/deliveries/create")
      return
    }

    // Загрузка данных о поставке
    const fetchDeliveryData = async () => {
      setIsLoading(true)
      try {
        // В реальном приложении здесь будет запрос к API
        // Имитация задержки загрузки данных
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Временные данные для демонстрации
        setDelivery({
          id: params.id,
          number: `${params.id.padStart(5, "0")}`,
          supplier: "L'Oréal Professional",
          orderDate: "2023-05-01",
          products: [
            {
              id: "1",
              name: "Шампунь для окрашенных волос",
              quantity: 10,
              price: "1200.00 ₽",
            },
            {
              id: "2",
              name: "Маска для волос",
              quantity: 5,
              price: "1800.00 ₽",
            },
            {
              id: "3",
              name: "Кондиционер для волос",
              quantity: 8,
              price: "950.00 ₽",
            },
          ],
          status: "delivering",
          customer: "Салон красоты 'Элегант'",
          courier: "Иванов Иван, +7 (999) 123-45-67",
          address: "г. Москва, ул. Ленина, д. 10",
          deliveryDate: "2023-05-05",
          amount: "25750.00 ₽",
          notes: "Доставка в рабочее время с 10:00 до 18:00",
          paymentMethod: "Безналичный расчет",
          paymentStatus: "paid",
          trackingNumber: "TRACK123456789",
        })
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

    fetchDeliveryData()
  }, [params.id, toast, router])

  // Если идентификатор "create", то мы уже перенаправили пользователя
  if (params.id === "create") {
    return null
  }

  // Функция для скачивания накладной
  const handleDownloadInvoice = () => {
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
            <Button className="mt-4" onClick={() => router.back()}>
              Вернуться назад
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
        <h2 className="text-3xl font-bold tracking-tight">Поставка #{delivery.number}</h2>
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
        <h1 className="text-3xl font-bold">Поставка #{delivery.number}</h1>
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
                <p>#{delivery.number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Дата заказа</p>
                <p>{new Date(delivery.orderDate).toLocaleDateString("ru-RU")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Поставщик</p>
                <p>{delivery.supplier}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Заказчик</p>
                <p>{delivery.customer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Дата доставки</p>
                <p>{new Date(delivery.deliveryDate).toLocaleDateString("ru-RU")}</p>
              </div>
              <div>
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
              <p>{delivery.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Курьер</p>
              <p>{delivery.courier}</p>
            </div>
            {delivery.trackingNumber && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Номер отслеживания</p>
                <p>{delivery.trackingNumber}</p>
              </div>
            )}
            {delivery.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Примечания</p>
                <p>{delivery.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Информация об оплате */}
      <Card>
        <CardHeader>
          <CardTitle>Информация об оплате</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Способ оплаты</p>
              <p>{delivery.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Статус оплаты</p>
              <PaymentStatusBadge status={delivery.paymentStatus} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Общая сумма</p>
              <p className="text-xl font-bold">{delivery.amount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <th className="h-10 px-4 text-center font-medium">Количество</th>
                  <th className="h-10 px-4 text-right font-medium">Цена за единицу</th>
                  <th className="h-10 px-4 text-right font-medium">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {delivery.products.map((product) => {
                  // Расчет суммы для каждого товара
                  const price = Number.parseFloat(product.price.replace(/[^\d.]/g, ""))
                  const total = price * product.quantity
                  const formattedTotal = `${total.toFixed(2)} ₽`

                  return (
                    <tr key={product.id} className="border-b">
                      <td className="p-4">{product.name}</td>
                      <td className="p-4 text-center">{product.quantity} шт.</td>
                      <td className="p-4 text-right">{product.price}</td>
                      <td className="p-4 text-right font-medium">{formattedTotal}</td>
                    </tr>
                  )
                })}
                <tr>
                  <td colSpan={3} className="p-4 text-right font-medium">
                    Итого:
                  </td>
                  <td className="p-4 text-right font-bold">{delivery.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* История статусов поставки */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>История статусов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800">
                <span className="text-xs font-bold">1</span>
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">Заказ создан</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(delivery.orderDate).toLocaleDateString("ru-RU")},{" "}
                  {new Date(delivery.orderDate).toLocaleTimeString("ru-RU")}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                <span className="text-xs font-bold">2</span>
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">Заказ обработан</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(new Date(delivery.orderDate).getTime() + 86400000).toLocaleDateString("ru-RU")},{" "}
                  {new Date(new Date(delivery.orderDate).getTime() + 86400000).toLocaleTimeString("ru-RU")}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-800">
                <span className="text-xs font-bold">3</span>
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">Передан в доставку</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(new Date(delivery.orderDate).getTime() + 172800000).toLocaleDateString("ru-RU")},{" "}
                  {new Date(new Date(delivery.orderDate).getTime() + 172800000).toLocaleTimeString("ru-RU")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
