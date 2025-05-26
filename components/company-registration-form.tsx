"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Название компании должно содержать не менее 2 символов",
  }),
  companyType: z.string({
    required_error: "Пожалуйста, выберите тип компании",
  }),
  address: z.string().min(5, {
    message: "Адрес должен содержать не менее 5 символов",
  }),
  inn: z.string().min(10, {
    message: "ИНН должен содержать не менее 10 символов",
  }),
  bankDetails: z.string().min(5, {
    message: "Банковские реквизиты должны содержать не менее 5 символов",
  }),
})

export function CompanyRegistrationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyType: "",
      address: "",
      inn: "",
      bankDetails: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Имитация задержки регистрации
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Здесь будет логика регистрации компании
    console.log(values)

    setIsLoading(false)

    // Перенаправление на дашборд после успешной регистрации
    router.push("/dashboard")
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название компании</FormLabel>
                <FormControl>
                  <Input placeholder="ООО 'Компания'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип компании</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип компании" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="company">Компания</SelectItem>
                    <SelectItem value="supplier">Поставщик</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес</FormLabel>
                <FormControl>
                  <Textarea placeholder="г. Москва, ул. Ленина, д. 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ИНН</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Банковские реквизиты</FormLabel>
                <FormControl>
                  <Textarea placeholder="Р/с 40702810123450101230 в Банке..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="w-full">
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Зарегистрировать компанию
          </Button>
        </form>
      </Form>
    </div>
  )
}
