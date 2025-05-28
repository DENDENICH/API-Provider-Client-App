"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, AlertCircle } from "lucide-react"
import { usersService } from "@/lib/api-services"
import { useToast } from "@/hooks/use-toast"
import { ErrorAlert } from "@/components/ui/error-alert"
import { ApiClientError } from "@/lib/api-client"

export function NotOrganizerDashboard() {
  const [linkCode, setLinkCode] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLinkCode = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Запрашиваем код привязки...")
        const response = await usersService.getLinkCode()
        console.log("Ответ от API:", response)
        setLinkCode(response.linkcode) // Исправлено: linkcode вместо link_code
      } catch (err) {
        console.error("Ошибка при получении кода привязки:", err)
        if (err instanceof ApiClientError) {
          setError(err.message)
        } else {
          setError("Не удалось получить код привязки. Попробуйте обновить страницу.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchLinkCode()
  }, [])

  const handleCopyCode = async () => {
    if (!linkCode) return

    try {
      await navigator.clipboard.writeText(linkCode.toString())
      setCopied(true)
      toast({
        title: "Код скопирован",
        description: "Код привязки скопирован в буфер обмена",
      })

      // Сбрасываем состояние через 2 секунды
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать код",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
        </div>
        <ErrorAlert error={error} onClose={() => setError(null)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
      </div>

      <div className="flex justify-center items-center min-h-[400px]">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-amber-500" />
            </div>
            <CardTitle className="text-2xl">Требуется привязка к организации</CardTitle>
            <CardDescription className="text-base">У вас пока нет учетной записи в организации</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Пожалуйста, поделитесь данным кодом с администратором организации для добавления вашей учетной записи в
                компанию
              </p>

              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : linkCode ? (
                <div className="space-y-4">
                  <div className="bg-muted p-6 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Ваш код привязки:</p>
                      <p className="text-4xl font-mono font-bold tracking-wider text-primary">
                        {linkCode.toString().padStart(10, "0")}
                      </p>
                    </div>
                  </div>

                  <Button onClick={handleCopyCode} className="w-full" variant={copied ? "secondary" : "default"}>
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Скопировано!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Скопировать код
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <p className="text-destructive">Не удалось загрузить код привязки</p>
              )}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground text-center">
                После добавления в организацию обновите страницу для доступа к полному функционалу
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
