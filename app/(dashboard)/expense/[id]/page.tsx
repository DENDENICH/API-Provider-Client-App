"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

// Типы данных для товара на складе
type ExpenseItem = {
  id: string
  articleNumber: string
  name: string
  organization: string
  category: string
  quantity: number
  description?: string
}

// Примерные данные для демонстрации
const data: ExpenseItem[] = [
  {
    id: "1",
    articleNumber: "SH-1001",
    name: "Шампунь для окрашенных волос",
    organization: "L'Oréal Professional",
    category: "Уход за волосами",
    quantity: 45,
    description: "Профессиональный шампунь для окрашенных волос. Сохраняет цвет и придает блеск.",
  },
  {
    id: "2",
    articleNumber: "MH-2002",
    name: "Маска для волос",
    organization: "Kérastase",
    category: "Уход за волосами",
    quantity: 30,
    description: "Интенсивная восстанавливающая маска для поврежденных волос.",
  },
  {
    id: "3",
    articleNumber: "CF-3003",
    name: "Крем для лица",
    organization: "Clarins",
    category: "Уход за кожей",
    quantity: 20,
    description: "Увлажняющий крем для лица с антивозрастным эффектом.",
  },
  {
    id: "4",
    articleNumber: "SA-4004",
    name: "Сыворотка антивозрастная",
    organization: "Janssen Cosmetics",
    category: "Уход за кожей",
    quantity: 15,
    description: "Антивозрастная сыворотка с гиалуроновой кислотой и пептидами.",
  },
  {
    id: "5",
    articleNumber: "CF-5005",
    name: "Крем для ног",
    organization: "Gehwol",
    category: "Маникюр и педикюр",
    quantity: 50,
    description: "Увлажняющий и смягчающий крем для ног с маслом авокадо.",
  },
  {
    id: "6",
    articleNumber: "NO-6006",
    name: "Масло для ногтей",
    organization: "Gehwol",
    category: "Маникюр и педикюр",
    quantity: 40,
    description: "Укрепляющее масло для ногтей с витаминами A, E и F.",
  },
  {
    id: "7",
    articleNumber: "PF-7007",
    name: "Пилинг для лица",
    organization: "Janssen Cosmetics",
    category: "Уход за кожей",
    quantity: 25,
    description: "Энзимный пилинг для глубокого очищения кожи лица.",
  },
  {
    id: "8",
    articleNumber: "AM-8008",
    name: "Альгинатная маска",
    organization: "Janssen Cosmetics",
    category: "Уход за кожей",
    quantity: 35,
    description: "Альгинатная маска для лица с эффектом лифтинга.",
  },
  {
    id: "9",
    articleNumber: "TH-9009",
    name: "Термозащита для волос",
    organization: "L'Oréal Professional",
    category: "Стайлинг для волос",
    quantity: 28,
    description: "Спрей для термозащиты волос при укладке феном или утюжком.",
  },
  {
    id: "10",
    articleNumber: "OH-1010",
    name: "Масло для волос",
    organization: "Kérastase",
    category: "Уход за волосами",
    quantity: 22,
    description: "Питательное масло для сухих и поврежденных волос.",
  },
]

export default function ExpenseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [item, setItem] = useState<ExpenseItem | null>(null)

  // Загрузка данных о товаре
  useEffect(() => {
    const fetchItemData = async () => {
      setIsLoading(true)
      try {
        // В реальном приложении здесь будет запрос к API
        // Имитация задержки загрузки данных
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Поиск товара по ID
        const foundItem = data.find((item) => item.id === params.id)
        setItem(foundItem || null)
      } catch (error) {
        console.error("Ошибка при загрузке данных о товаре:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItemData()
  }, [params.id])

  // Отображение индикатора загрузки
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Информация о товаре</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  // Если товар не найден
  if (!item) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Информация о товаре</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground">Товар не найден</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Вернуться назад
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Отображение информации о товаре
  return (
    <div className="flex flex-col gap-6">
      {/* Заголовок страницы с кнопкой возврата */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Информация о товаре</h2>
      </div>

      {/* Основная информация о товаре */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Название</p>
              <p className="text-lg font-semibold">{item.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Артикул</p>
              <p>{item.articleNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Организация</p>
              <p>{item.organization}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Категория</p>
              <p>{item.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">В наличии</p>
              <p
                className={`font-medium ${
                  item.quantity === 0 ? "text-red-500" : item.quantity < 10 ? "text-yellow-500" : "text-green-500"
                }`}
              >
                {item.quantity} шт.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Описание</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{item.description || "Описание отсутствует"}</p>
          </CardContent>
        </Card>
      </div>

      {/* История поставок (можно добавить в будущем) */}
      <Card>
        <CardHeader>
          <CardTitle>История поставок</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>История поставок будет доступна в ближайшее время</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
