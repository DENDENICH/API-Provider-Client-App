"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Схема валидации формы
const formSchema = z.object({
  position: z.string({
    required_error: "Выберите должность",
  }),
  inviteCode: z.string().min(1, {
    message: "Введите пригласительный код",
  }),
})

export function InviteEmployeeForm({ organizationType }: { organizationType: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Инициализация формы
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: "",
      inviteCode: "",
    },
  })

  // Обработчик отправки формы
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // В реальном приложении здесь будет API-запрос для добавления сотрудника
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Имитация успешного добавления
      toast({
        title: "Сотрудник добавлен",
        description: `Сотрудник успешно добавлен в вашу организацию.`,
      })

      // Перенаправление на страницу со списком сотрудников
      router.push("/employees")
    } catch (error) {
      console.error("Ошибка при добавлении сотрудника:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось добавить сотрудника. Проверьте пригласительный код.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Должность</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите должность" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="менеджер">Менеджер</SelectItem>
                    <SelectItem value="сотрудник">Сотрудник</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Должность нового сотрудника</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inviteCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пригласительный код</FormLabel>
                <FormControl>
                  <Input placeholder="Введите пригласительный код" {...field} />
                </FormControl>
                <FormDescription>Код приглашения для нового сотрудника</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                Добавление...
              </>
            ) : (
              "Добавить сотрудника"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
