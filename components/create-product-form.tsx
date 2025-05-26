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
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Textarea } from "@/components/ui/textarea"

// Компонент для ввода цены
const PriceInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { onValueChange: (value: string) => void }
>(({ onValueChange, ...props }, ref) => {
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

// Схема валидации формы
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
  stock: z.number().min(0, {
    message: "Количество не может быть отрицательным",
  }),
  description: z.string().optional(),
})

export function CreateProductForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Инициализация формы
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      price: "",
      stock: 0,
      description: "",
    },
  })

  // Обработчик отправки формы
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Имитация задержки создания товара
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Генерация артикула
      const prefix = values.name.substring(0, 2).toUpperCase()
      const randomNum = Math.floor(1000 + Math.random() * 9000)
      const articleNumber = `${prefix}-${randomNum}`

      console.log({ ...values, articleNumber })
      alert(`Товар "${values.name}" успешно создан с артикулом ${articleNumber}`)

      router.push("/products/manage")
    } catch (error) {
      console.error("Ошибка при создании товара:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

              <FormField
                control={form.control}
                name="price"
                render={({ field: { onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Цена за единицу</FormLabel>
                    <FormControl>
                      <PriceInput placeholder="0.00 ₽" onValueChange={onChange} {...fieldProps} />
                    </FormControl>
                    <FormDescription>Введите цену в рублях (например, 1200.00)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field: { onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Количество в наличии</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        onChange={(e) => onChange(Number.parseInt(e.target.value) || 0)}
                        {...fieldProps}
                        value={fieldProps.value?.toString()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/products/manage")}>
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
                  "Создать товар"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
