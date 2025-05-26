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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
// Добавить импорт Checkbox в начало файла
import { Checkbox } from "@/components/ui/checkbox"

// Типы данных
// Изменить тип Delivery, добавив поле для выбора
type Delivery = {
  id: string
  number: string
  supplier: string
  orderDate: string
  products: string
  status: "processing" | "collected" | "delivering" | "delivered" | "accepted" | "canceled"
  customer: string
  courier: string
  address: string
  deliveryDate: string
  amount: string
  receipt?: string
  selected?: boolean // Новое поле для отслеживания выбора
}

// Обновленные данные для косметологической студии
const data: Delivery[] = [
  {
    id: "1",
    number: "12345",
    supplier: "L'Oréal Professional",
    orderDate: "2023-05-01",
    products: "Шампунь для окрашенных волос (10 шт.), Маска для волос (5 шт.)",
    status: "processing",
    customer: "Иванова А.С.",
    courier: "Петров П.П. +7(999)123-45-67",
    address: "г. Москва, ул. Ленина, д. 10",
    deliveryDate: "2023-05-05",
    amount: "15000 ₽",
  },
  {
    id: "2",
    number: "12344",
    supplier: "Clarins",
    orderDate: "2023-05-02",
    products: "Крем для лица (8 шт.), Сыворотка антивозрастная (5 шт.)",
    status: "collected",
    customer: "Сидорова Е.В.",
    courier: "Кузнецов К.К. +7(999)765-43-21",
    address: "г. Москва, ул. Пушкина, д. 15",
    deliveryDate: "2023-05-06",
    amount: "25000 ₽",
  },
  {
    id: "3",
    number: "12343",
    supplier: "Gehwol",
    orderDate: "2023-05-03",
    products: "Крем для ног (15 шт.), Масло для ногтей (10 шт.)",
    status: "delivering",
    customer: "Петрова П.П.",
    courier: "Иванов И.И. +7(999)111-22-33",
    address: "г. Москва, ул. Гагарина, д. 20",
    deliveryDate: "2023-05-07",
    amount: "12000 ₽",
  },
  {
    id: "4",
    number: "12342",
    supplier: "Janssen Cosmetics",
    orderDate: "2023-05-04",
    products: "Пилинг для лица (5 шт.), Альгинатная маска (10 шт.)",
    status: "delivered",
    customer: "Кузнецова К.К.",
    courier: "Сидоров С.С. +7(999)444-55-66",
    address: "г. Москва, ул. Королева, д. 25",
    deliveryDate: "2023-05-08",
    amount: "18000 ₽",
    receipt: "чек-12342.pdf",
  },
  {
    id: "5",
    number: "12341",
    supplier: "Kérastase",
    orderDate: "2023-05-05",
    products: "Термозащита для волос (12 шт.), Масло для волос (8 шт.)",
    status: "accepted",
    customer: "Иванова И.И.",
    courier: "Петрова П.П. +7(999)777-88-99",
    address: "г. Москва, ул. Циолковского, д. 30",
    deliveryDate: "2023-05-09",
    amount: "22000 ₽",
    receipt: "чек-12341.pdf",
  },
]

// Функция для отображения статуса
function StatusBadge({
  status,
  onStatusChange,
}: { status: Delivery["status"]; onStatusChange?: (newStatus: Delivery["status"]) => void }) {
  let badgeContent
  let badgeClass

  switch (status) {
    case "processing":
      badgeContent = "В обработке"
      badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      break
    case "collected":
      badgeContent = "Собран"
      badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-100"
      break
    case "delivering":
      badgeContent = "В доставке"
      badgeClass = "bg-orange-100 text-orange-800 hover:bg-orange-100"
      break
    case "delivered":
      badgeContent = "Доставлен"
      badgeClass = "bg-green-100 text-green-800 hover:bg-green-100"
      break
    case "accepted":
      badgeContent = "Принят"
      badgeClass = "bg-green-500 text-white hover:bg-green-600"
      break
    case "canceled":
      badgeContent = "Отменен"
      badgeClass = "bg-red-100 text-red-800 hover:bg-red-100"
      break
    default:
      return null
  }

  if (onStatusChange) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge variant="outline" className={`cursor-pointer ${badgeClass}`}>
            {badgeContent}
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Изменить статус</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onStatusChange("processing")}>В обработке</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("collected")}>Собран</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("delivering")}>В доставке</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("delivered")}>Доставлен</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("accepted")}>Принят</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("canceled")}>Отменен</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Badge variant="outline" className={badgeClass}>
      {badgeContent}
    </Badge>
  )
}

// Добавить в начало функции DeliveriesTable новые состояния для выбора строк
export function DeliveriesTable() {
  const { role } = useAuth()
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [deliveries, setDeliveries] = React.useState<Delivery[]>(data)
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]) // Новое состояние для выбранных строк

  // Добавить функцию для обработки выбора всех строк
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Выбрать все строки
      const allIds = deliveries.map((delivery) => delivery.id)
      setSelectedRows(allIds)
    } else {
      // Снять выбор со всех строк
      setSelectedRows([])
    }
  }

  // Добавить функцию для обработки выбора отдельной строки
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      // Добавить строку к выбранным
      setSelectedRows((prev) => [...prev, id])
    } else {
      // Удалить строку из выбранных
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id))
    }
  }

  // Добавить функцию для симуляции скачивания накладной
  const handleDownloadInvoice = () => {
    if (selectedRows.length === 0) {
      alert("Пожалуйста, выберите хотя бы одну поставку для формирования накладной")
      return
    }

    // Получить выбранные поставки
    const selectedDeliveries = deliveries.filter((delivery) => selectedRows.includes(delivery.id))

    // Сформировать текст накладной (в реальном приложении здесь будет генерация PDF или другого формата)
    let invoiceText = "НАКЛАДНАЯ\n\n"
    invoiceText += `Дата: ${new Date().toLocaleDateString("ru-RU")}\n`
    invoiceText += `Номер: INV-${Math.floor(Math.random() * 10000)}\n\n`
    invoiceText += "Список поставок:\n"

    selectedDeliveries.forEach((delivery, index) => {
      invoiceText += `${index + 1}. Поставка #${delivery.number} от ${new Date(delivery.orderDate).toLocaleDateString("ru-RU")}\n`
      invoiceText += `   Поставщик: ${delivery.supplier}\n`
      invoiceText += `   Товары: ${delivery.products}\n`
      invoiceText += `   Сумма: ${delivery.amount}\n\n`
    })

    invoiceText += `Общая сумма: ${selectedDeliveries
      .reduce((sum, delivery) => {
        const amount = Number.parseFloat(delivery.amount.replace(/[^\d.]/g, ""))
        return sum + amount
      }, 0)
      .toFixed(2)} ₽\n\n`

    invoiceText += "Подпись: ___________________"

    // Создать и скачать файл
    const blob = new Blob([invoiceText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Накладная_${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Сообщение об успешном скачивании
    alert("Накладная успешно сформирована и скачана")
  }

  const handleStatusChange = (id: string, newStatus: Delivery["status"]) => {
    setDeliveries((prev) =>
      prev.map((delivery) => {
        if (delivery.id === id) {
          return { ...delivery, status: newStatus }
        }
        return delivery
      }),
    )
    alert(`Статус поставки #${id} изменен на "${newStatus}"`)
  }

  // Добавить колонку с чекбоксами в начало массива columns
  const columns: ColumnDef<Delivery>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={selectedRows.length === deliveries.length && deliveries.length > 0}
          onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
          aria-label="Выбрать все"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedRows.includes(row.original.id)}
          onCheckedChange={(checked) => handleSelectRow(row.original.id, checked as boolean)}
          aria-label="Выбрать строку"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "number",
      header: "Номер",
      cell: ({ row }) => <div className="font-medium">#{row.getValue("number")}</div>,
    },
    // Показывать колонку "Поставщик" только для роли "company"
    ...(role === "company"
      ? [
          {
            accessorKey: "supplier",
            header: ({ column }) => {
              return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                  Поставщик
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              )
            },
            cell: ({ row }) => <div>{row.getValue("supplier")}</div>,
          } as ColumnDef<Delivery>,
        ]
      : []),
    {
      accessorKey: "orderDate",
      header: "Дата заказа",
      cell: ({ row }) => {
        const date = new Date(row.getValue("orderDate"))
        return <div>{date.toLocaleDateString("ru-RU")}</div>
      },
    },
    {
      accessorKey: "products",
      header: "Товары",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue("products")}>
          {row.getValue("products")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const delivery = row.original
        return (
          <StatusBadge
            status={delivery.status}
            onStatusChange={role === "supplier" ? (newStatus) => handleStatusChange(delivery.id, newStatus) : undefined}
          />
        )
      },
    },
    // Показывать колонку "Заказчик" только для роли "supplier"
    ...(role === "supplier"
      ? [
          {
            accessorKey: "customer",
            header: "Заказчик",
            cell: ({ row }) => <div>{row.getValue("customer")}</div>,
          } as ColumnDef<Delivery>,
        ]
      : []),
    {
      accessorKey: "amount",
      header: "Сумма",
      cell: ({ row }) => <div className="font-medium">{row.getValue("amount")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const delivery = row.original

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
              <DropdownMenuItem onClick={() => router.push(`/deliveries/${delivery.id}`)}>Просмотр</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: deliveries,
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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Поиск по номеру..."
          value={(table.getColumn("number")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("number")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />

        <div className="ml-4 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSelectAll(selectedRows.length !== deliveries.length)}
          >
            {selectedRows.length === deliveries.length ? "Снять выбор" : "Выбрать все"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {selectedRows.length > 0 ? `Выбрано: ${selectedRows.length}` : ""}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Колонки <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "number"
                      ? "Номер"
                      : column.id === "supplier"
                        ? "Поставщик"
                        : column.id === "orderDate"
                          ? "Дата заказа"
                          : column.id === "products"
                            ? "Товары"
                            : column.id === "status"
                              ? "Статус"
                              : column.id === "customer"
                                ? "Заказчик"
                                : column.id === "amount"
                                  ? "Сумма"
                                  : column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="ml-2" onClick={handleDownloadInvoice}>
          Сформировать накладную
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} поставок</div>
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
    </div>
  )
}
