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
import { useAuth } from "@/contexts/auth-context"

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/

const formSchema = z.object({
    email: z.string().email({
        message: "Пожалуйста, введите корректный email",
    }),
    password: z
        .string()
        .min(8, {
            message: "Пароль должен содержать не менее 8 символов",
        })
        .regex(passwordRegex, {
            message: "Пароль должен содержать буквы, цифры и специальные символы",
        }),
})

export function LoginForm() {
    const router = useRouter()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setError(null)

        try {
            await login(values.email, values.password)
            router.push("/dashboard")
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === "NEED_ORG_REGISTRATION") {
                    router.push("/register/company")
                    return
                }
                setError(err.message)
            } else {
                setError("Ошибка входа. Проверьте ваши учетные данные.")
            }
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error && <div className="text-sm font-medium text-destructive">{error}</div>}
                    <Button disabled={isLoading} className="w-full">
                        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Войти
                    </Button>
                </form>
            </Form>
        </div>
    )
}
