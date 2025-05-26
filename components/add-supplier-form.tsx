"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Icons } from "@/components/icons"

const formSchema = z.object({
  inn: z
    .string()
    .min(10, {
      message: "ИНН должен содержать не менее 10 символов",
    })
    .max(12, {
      message: "ИНН должен содержать не более 12 символов",
    }),
})

export function AddSupplierForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [supplierFound, setSupplierFound] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inn: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setSupplierFound(null)

    try {
      // Имитация поиска поставщика по ИНН
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Для демонстрации создаем фиктивного поставщика
      if (values.inn === "1234567890") {
        setSupplierFound({
          name: "L'Oréal Professional",
          inn: "1234567890",
          address: "г. Москва, ул. Тверская, д. 10",
        })
      } else if (values.inn === "0987654321") {
        setSupplierFound({
          name: "Clarins",
          inn: "0987654321",
          address: "г. Москва, ул. Арбат, д. 25",
        })
      } else {
        // Случайный поставщик для других ИНН
        const suppliers = [
          { name: "Gehwol", inn: values.inn, address: "г. Москва, ул. Ленина, д. 15" },
          { name: "Janssen Cosmetics", inn: values.inn, address: "г. Москва, ул. Пушкина, д. 20" },
          { name: "Kérastase", inn: values.inn, address: "г. Москва, ул. Гагарина, д. 30" },
        ]
        setSupplierFound(suppliers[Math.floor(Math.random() * suppliers.length)])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSupplier = () => {
    // Здесь будет логика добавления поставщика
    alert(`Поставщик ${supplierFound.name} добавлен`)
    setSupplierFound(null)
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить поставщика</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="inn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ИНН поставщика</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите ИНН" {...field} />
                  </FormControl>
                  <FormDescription>Введите ИНН поставщика для поиска в системе</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: "#f97316",
                color: "white",
                borderColor: "#f97316",
              }}
              className="hover:bg-[#ea580c]"
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Найти поставщика
            </Button>
          </form>
        </Form>

        {supplierFound && (
          <div className="mt-6 p-4 border rounded-md">
            <h3 className="font-semibold text-lg mb-2">Найден поставщик:</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Название:</span> {supplierFound.name}
              </p>
              <p>
                <span className="font-medium">ИНН:</span> {supplierFound.inn}
              </p>
              <p>
                <span className="font-medium">Адрес:</span> {supplierFound.address}
              </p>
              <Button onClick={handleAddSupplier} className="mt-4">
                Заключить контракт
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
