"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Minus } from "lucide-react"
import { Icons } from "@/components/icons"

// Типы данных для товара
type Product = {
  id: string
  name: string
  category: string
  price: number
  available: number
  articleNumber: string
}

// Типы данных для поставщика
type Supplier = {
  id: string
  name: string
}

// Типы данных для выбранного товара
type SelectedProduct = {
  id: string
  quantity: number
}

// Схема валидации формы
const formSchema = z.object({
  supplier: z.string({
    required_error: "Выберите поставщика",
  }),
  address: z.string({
    required_error: "Введите адрес доставки",
  }),
  selectedProducts: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().min(1, "Количество должно быть больше 0"),
      }),
    )
    .min(1, "Выберите хотя бы один товар"),
})

export function CreateDeliveryForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<string>("")
  const [totalAmount, setTotalAmount] = useState<number>(0)

  // Инициализация формы
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: "",
      address: "",
      selectedProducts: [],
    },
  })

  // Загрузка списка поставщиков (имитация)
  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    const mockSuppliers: Supplier[] = [
      { id: "1", name: "L'Oréal Professional" },
      { id: "2", name: "Clarins" },
      { id: "3", name: "Gehwol" },
      { id: "4", name: "Janssen Cosmetics" },
      { id: "5", name: "Kérastase" },
      { id: "6", name: "Dermalogica" },
      { id: "7", name: "Babor" },
    ]
    setSuppliers(mockSuppliers)
  }, [])

  // Загрузка списка товаров при выборе поставщика
  useEffect(() => {
    if (selectedSupplier) {
      // В реальном приложении здесь будет запрос к API с фильтрацией по поставщику
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "Шампунь для окрашенных волос",
          category: "Уход за волосами",
          price: 1200,
          available: 45,
          articleNumber: "SH-1001",
        },
        {
          id: "2",
          name: "Маска для волос",
          category: "Уход за волосами",
          price: 1800,
          available: 30,
          articleNumber: "MH-2002",
        },
        {
          id: "3",
          name: "Крем для лица",
          category: "Уход за кожей",
          price: 2500,
          available: 20,
          articleNumber: "CF-3003",
        },
        {
          id: "4",
          name: "Сыворотка антивозрастная",
          category: "Уход за кожей",
          price: 3200,
          available: 15,
          articleNumber: "SA-4004",
        },
        {
          id: "5",
          name: "Крем для ног",
          category: "Маникюр и педикюр",
          price: 950,
          available: 50,
          articleNumber: "CF-5005",
        },
        {
          id: "6",
          name: "Масло для ногтей",
          category: "Маникюр и педикюр",
          price: 750,
          available: 40,
          articleNumber: "NO-6006",
        },
        {
          id: "7",
          name: "Пилинг для лица",
          category: "Уход за кожей",
          price: 1900,
          available: 25,
          articleNumber: "PF-7007",
        },
        {
          id: "8",
          name: "Альгинатная маска",
          category: "Уход за кожей",
          price: 1500,
          available: 35,
          articleNumber: "AM-8008",
        },
      ]
      setProducts(mockProducts)
      // Сбрасываем выбранные товары при смене поставщика
      setSelectedProducts([])
      form.setValue("selectedProducts", [])
      setTotalAmount(0)
    }
  }, [selectedSupplier, form])

  // Обновление общей суммы при изменении выбранных товаров
  useEffect(() => {
    let total = 0
    selectedProducts.forEach((selectedProduct) => {
      const product = products.find((p) => p.id === selectedProduct.id)
      if (product) {
        total += product.price * selectedProduct.quantity
      }
    })
    setTotalAmount(total)
  }, [selectedProducts, products])

  // Обработчик выбора поставщика
  const handleSupplierChange = (value: string) => {
    setSelectedSupplier(value)
    form.setValue("supplier", value)
  }

  // Обработчик выбора товара
  const handleProductSelect = (productId: string, isChecked: boolean) => {
    if (isChecked) {
      // Добавляем товар в список выбранных
      const newSelectedProduct = { id: productId, quantity: 1 }
      const updatedSelectedProducts = [...selectedProducts, newSelectedProduct]
      setSelectedProducts(updatedSelectedProducts)
      form.setValue("selectedProducts", updatedSelectedProducts)
    } else {
      // Удаляем товар из списка выбранных
      const updatedSelectedProducts = selectedProducts.filter((p) => p.id !== productId)
      setSelectedProducts(updatedSelectedProducts)
      form.setValue("selectedProducts", updatedSelectedProducts)
    }
  }

  // Обработчик изменения количества товара
  const handleQuantityChange = (productId: string, change: number) => {
    const updatedSelectedProducts = selectedProducts.map((product) => {
      if (product.id === productId) {
        const selectedProduct = products.find((p) => p.id === productId)
        if (selectedProduct) {
          // Проверяем, что новое количество не меньше 1 и не больше доступного
          const newQuantity = Math.max(1, Math.min(product.quantity + change, selectedProduct.available))
          return { ...product, quantity: newQuantity }
        }
      }
      return product
    })
    setSelectedProducts(updatedSelectedProducts)
    form.setValue("selectedProducts", updatedSelectedProducts)
  }

  // Проверка, выбран ли товар
  const isProductSelected = (productId: string) => {
    return selectedProducts.some((p) => p.id === productId)
  }

  // Получение количества выбранного товара
  const getSelectedQuantity = (productId: string) => {
    const selectedProduct = selectedProducts.find((p) => p.id === productId)
    return selectedProduct ? selectedProduct.quantity : 0
  }

  // Обработчик отправки формы
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Имитация задержки создания поставки
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Подготовка данных для отправки
      const deliveryData = {
        supplier: suppliers.find((s) => s.id === values.supplier)?.name,
        address: values.address,
        products: values.selectedProducts.map((sp) => {
          const product = products.find((p) => p.id === sp.id)
          return {
            id: sp.id,
            name: product?.name,
            quantity: sp.quantity,
            price: product?.price,
            total: (product?.price || 0) * sp.quantity,
          }
        }),
        totalAmount,
      }

      console.log("Данные поставки:", deliveryData)
      alert("Поставка успешно создана")
      router.push("/deliveries")
    } catch (error) {
      console.error("Ошибка при создании поставки:", error)
      alert("Произошла ошибка при создании поставки")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {/* Выбор поставщика */}
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Поставщик</FormLabel>
                    <Select onValueChange={handleSupplierChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите поставщика" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Выберите поставщика из списка</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Список товаров */}
              {selectedSupplier && (
                <div className="space-y-4">
                  <FormLabel>Товары</FormLabel>
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted font-medium text-sm">
                      <div className="col-span-1"></div>
                      <div className="col-span-2">Артикул</div>
                      <div className="col-span-3">Название товара</div>
                      <div className="col-span-2">Категория</div>
                      <div className="col-span-2">Цена за ед.</div>
                      <div className="col-span-2">Количество</div>
                    </div>
                    <div className="divide-y">
                      {products.map((product) => (
                        <div key={product.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                          <div className="col-span-1">
                            <Checkbox
                              checked={isProductSelected(product.id)}
                              onCheckedChange={(checked) => handleProductSelect(product.id, checked as boolean)}
                            />
                          </div>
                          <div className="col-span-2 text-sm">{product.articleNumber}</div>
                          <div className="col-span-3 font-medium">{product.name}</div>
                          <div className="col-span-2 text-sm text-muted-foreground">{product.category}</div>
                          <div className="col-span-2 text-sm">{product.price.toLocaleString()} ₽</div>
                          <div className="col-span-2 flex items-center space-x-2">
                            {isProductSelected(product.id) ? (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(product.id, -1)}
                                  disabled={getSelectedQuantity(product.id) <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{getSelectedQuantity(product.id)}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(product.id, 1)}
                                  disabled={getSelectedQuantity(product.id) >= product.available}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">Не выбрано</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {form.formState.errors.selectedProducts && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.selectedProducts.message}
                    </p>
                  )}
                </div>
              )}

              {/* Адрес доставки */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес доставки</FormLabel>
                    <FormControl>
                      <Textarea placeholder="г. Москва, ул. Ленина, д. 10" className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Укажите полный адрес доставки</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Итоговая сумма */}
              {selectedProducts.length > 0 && (
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-medium">Итого:</span>
                  <span className="text-xl font-bold">{totalAmount.toLocaleString()} ₽</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/deliveries")}>
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: "#f97316",
                  color: "white",
                  borderColor: "#f97316",
                }}
                className="hover:bg-[#ea580c]"
              >
                {isSubmitting ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Создание...
                  </>
                ) : (
                  "Создать поставку"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
