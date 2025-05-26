"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { EditProductForm } from "@/components/edit-product-form"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)

  // Загрузка данных о товаре при монтировании компонента
  // TODO: Заменить на получение данных с сервера
  useEffect(() => {
    // Функция для загрузки данных о товаре
    const fetchProductData = async () => {
      setIsLoading(true)
      try {
        // API запрос для получения данных о товаре
        // Пример: const response = await fetch(`/api/products/${params.id}`)
        // const data = await response.json()
        // setProduct(data)

        // Имитация задержки загрузки данных
        setTimeout(() => {
          // Временные данные для демонстрации
          setProduct({
            id: params.id,
            name: "Шампунь для окрашенных волос",
            category: "Уход за волосами",
            articleNumber: "SH-1001",
            price: "1200.00",
            stock: 45,
            description: "Профессиональный шампунь для окрашенных волос. Сохраняет цвет и придает блеск.",
            image: null,
          })
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Ошибка при загрузке данных о товаре:", error)
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [params.id])

  // Отображение индикатора загрузки
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Редактирование товара</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  // Отображение формы редактирования товара
  return (
    <div className="flex flex-col gap-6">
      {/* Заголовок страницы с кнопкой возврата */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Редактирование товара</h2>
      </div>

      {/* Форма редактирования товара */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о товаре</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProductForm product={product} onSuccess={() => router.push(`/products/manage/${params.id}`)} />
        </CardContent>
      </Card>
    </div>
  )
}
