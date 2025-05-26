"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

// Добавьте импорт Dialog и связанных компонентов, а также Label и Icons
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

// Типы данных для товара на ��кладе
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

export function ExpenseTable() {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Добавьте следующие состояния после объявления состояний sorting, columnFilters и т.д.:
  const [isStockDialogOpen, setIsStockDialogOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<ExpenseItem | null>(null)
  const [newStockValue, setNewStockValue] = React.useState<number>(0)
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Добавьте следующие функции перед определением колонок:

  // Функция для открытия модального окна редактирования количества
  const handleOpenStockDialog = (item: ExpenseItem) => {
    setSelectedItem(item)
    setNewStockValue(item.quantity)
    setIsStockDialogOpen(true)
  }

  // Функция для обновления количества товара
  const handleUpdateStock = async () => {
    if (!selectedItem) return

    setIsUpdating(true)
    try {
      // В реальном приложении здесь будет API-запрос
      // Пример: await fetch(`/api/expense/${selectedItem.id}/stock`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ quantity: newStockValue })
      // })

      // Имитация задержки запроса
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Обновляем список товаров
      const updatedData = data.map((item) =>
          item.id === selectedItem.id ? { ...item, quantity: newStockValue } : item,
      )

      // В реальном приложении здесь будет обновление состояния через API
      // Для демонстрации просто показываем сообщение
      alert(`Количество товара "${selectedItem.name}" обновлено до ${newStockValue} шт.`)

      // Закрываем модальное окно
      setIsStockDialogOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error("Ошибка при обновлении количества товара:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Определение колонок таблицы
  const columns: ColumnDef<ExpenseItem>[] = [
    {
      accessorKey: "articleNumber",
      header: "Артикул",
      cell: ({ row }) => <div>{row.getValue("articleNumber")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Название
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "organization",
      header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Организация
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("organization")}</div>,
    },
    {
      accessorKey: "category",
      header: "Категория",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Количество
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row }) => {
        const quantity = Number.parseInt(row.getValue("quantity"))
        const item = row.original
        return (
            <Button
                variant="link"
                className={`p-0 h-auto ${quantity === 0 ? "text-red-500" : quantity < 10 ? "text-yellow-500" : ""}`}
                onClick={() => handleOpenStockDialog(item)}
            >
              {quantity} шт.
            </Button>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original

        return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Открыть меню</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/expense/${item.id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Просмотр
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        )
      },
    },
  ]

  // Инициализация таблицы с помощью TanStack Table
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Рендер таблицы с товарами
  return (
      <div className="w-full">
        {/* Поле поиска по названию товара */}
        <div className="flex items-center py-4">
          <Input
              placeholder="Поиск по названию..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="max-w-sm"
          />
        </div>

        {/* Таблица с товарами */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                    ))}
                  </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Нет результатов.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Пагинация */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} товаров</div>
          <div className="space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
              Назад
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Вперед
            </Button>
          </div>
        </div>
        {/* Модальное окно для редактирования количества товара */}
        <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Изменить количество товара</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedItem && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="item-name" className="text-right">
                        Товар
                      </Label>
                      <div id="item-name" className="col-span-3 font-medium">
                        {selectedItem.name}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="item-article" className="text-right">
                        Артикул
                      </Label>
                      <div id="item-article" className="col-span-3">
                        {selectedItem.articleNumber}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="item-organization" className="text-right">
                        Организация
                      </Label>
                      <div id="item-organization" className="col-span-3">
                        {selectedItem.organization}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="stock-value" className="text-right">
                        Количество
                      </Label>
                      <div className="col-span-3">
                        <Input
                            id="stock-value"
                            type="number"
                            min="0"
                            value={newStockValue}
                            onChange={(e) => setNewStockValue(Number(e.target.value))}
                            className="w-20"
                        />
                      </div>
                    </div>
                  </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStockDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpdateStock} disabled={isUpdating}>
                {isUpdating ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                ) : (
                    "Сохранить"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
