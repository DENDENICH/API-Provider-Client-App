"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Icons } from "@/components/icons"
import { Textarea } from "@/components/ui/textarea"

// Компонент для ввода цены с форматированием
const PriceInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { onValueChange: (value: string) => void }
>(({ onValueChange, ...props }, ref) => {
  // Обработчик изменения значения в поле ввода цены
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Удаляем все нецифровые символы, кроме точки
    let value = e.target.value.replace(/[^\d.]/g, "")

    // Проверяем, что точка только одна
    const dotCount = (value.match(/\./g) || []).length
    if (dotCount > 1) {
      const parts = value.split(".")
      value = parts[0] + "." + parts.slice(1).join("")
    }

    // Ограничиваем до двух знаков после точки
    if (value.includes(".")) {
      const parts = value.split(".")
      if (parts[1].length > 2) {
        value = parts[0] + "." + parts[1].substring(0, 2)
      }
    }

    // Форматируем цену
    let formattedValue = value
    if (value) {
      // Если нет точки, добавляем .00
      if (!value.includes(".")) {
        formattedValue = value + ".00"
      }
      // Если есть точка, но только один знак после, добавляем 0
      else if (value.split(".")[1].length === 1) {
        formattedValue = value + "0"
      }

      // Добавляем символ рубля
      formattedValue = formattedValue + " ₽"
    }

    // Обновляем значение в форме
    onValueChange(value)

    // Устанавливаем отформатированное значение в поле ввода
    e.target.value = formattedValue
  }

  return <Input ref={ref} onChange={handleChange} {...props} />
})
PriceInput.displayName = "PriceInput"

// Схема валидации формы с использованием Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Название должно содержать не менее 2 символов",
  }),
  category: z.string({
    required_error: "Выберите категорию",
  }),
  price: z.string().min(1, {
    message: "Введите цену",
  }),
  description: z.string().optional(),
})

// Компонент формы редактирования товара
export function EditProductForm({ product, onSuccess }: { product: any; onSuccess?: () => void }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Инициализация формы с использованием react-hook-form и zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description || "",
    },
  })

  // Обработчик отправки формы
  // TODO: Заменить на вызов API для обновления товара
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Подготовка данных для отправки на сервер
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("category", values.category)
      formData.append("price", values.price)
      if (values.description) formData.append("description", values.description)

      // API запрос для обновления товара
      // Пример:
      // const response = await fetch(`/api/products/${product.id}`, {
      //   method: 'PUT',
      //   body: formData
      // })
      // if (!response.ok) throw new Error('Ошибка при обновлении товара')

      // Имитация задержки обновления товара
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Обновленные данные товара:", values)
      alert(`Товар "${values.name}" успешно обновлен`)

      // Перенаправление после успешного обновления
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/products/manage")
      }
    } catch (error) {
      console.error("Ошибка при обновлении товара:", error)
      alert("Произошла ошибка при обновлении товара. Пожалуйста, попробуйте снова.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Рендер формы редактирования товара
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Поле для ввода названия товара */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input placeholder="Введите название товара" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Поле для выбора категории товара */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Категория</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Окрашивание волос">Окрашивание волос</SelectItem>
                    <SelectItem value="Уход за волосами">Уход за волосами</SelectItem>
                    <SelectItem value="Стайлинг для волос">Стайлинг для волос</SelectItem>
                    <SelectItem value="Расходники">Расходники</SelectItem>
                    <SelectItem value="Химическая завивка">Химическая завивка</SelectItem>
                    <SelectItem value="Брови">Брови</SelectItem>
                    <SelectItem value="Маникюр и педикюр">Маникюр и педикюр</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Поле для ввода цены товара */}
          <FormField
            control={form.control}
            name="price"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Цена за единицу</FormLabel>
                <FormControl>
                  <PriceInput
                    placeholder="0.00 ₽"
                    onValueChange={onChange}
                    defaultValue={`${value} ₽`}
                    {...fieldProps}
                  />
                </FormControl>
                <FormDescription>Введите цену в рублях (например, 1200.00)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Поле для ввода описания товара */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea placeholder="Введите описание товара" className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Кнопки отмены и сохранения */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
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
                Сохранение...
              </>
            ) : (
              "Сохранить изменения"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
