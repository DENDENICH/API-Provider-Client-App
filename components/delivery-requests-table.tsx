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
import { ArrowUpDown, ChevronDown, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

// Типы данных для запроса на поставку
// TODO: Обновить типы в соответствии с API бэкенда
type DeliveryRequest = {
  id: string
  number: string
  customer: string
  requestDate: string
  products: string
  quantity: number
  status: "pending" | "accepted" | "rejected"
  address: string
  amount: string
}

// Примерные данные для демонстрации
// TODO: Заменить на получение данных с сервера
const data: DeliveryRequest[] = [
  {
    id: "1",
    number: "REQ-12345",
    customer: "Салон красоты 'Элегант'",
    requestDate: "2023-05-01",
    products: "Шампунь для окрашенных волос, Маска для волос",
    quantity: 15,
    status: "pending",
    address: "г. Москва, ул. Ленина, д. 10",
    amount: "15000 ₽",
  },
  // ... другие запросы
]

// Функция для отображения статуса запроса
function getStatusBadge(status: DeliveryRequest["status"]) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Ожидает
        </Badge>
      )
    case "accepted":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          Принят
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          Отклонен
        </Badge>
      )
    default:
      return null
  }
}

export function DeliveryRequestsTable() {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Состояние для хранения списка запросов на поставку
  // TODO: Заменить на получение данных с сервера через useEffect
  const [requests, setRequests] = React.useState<DeliveryRequest[]>(data)

  // Функция для принятия запроса на поставку
  // TODO: Заменить на вызов API для принятия запроса
  const handleAccept = (id: string) => {
    // API запрос на принятие запроса
    // Пример: await fetch(`/api/delivery-requests/${id}/accept`, { method: 'POST' })

    // Обновление UI после успешного принятия
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === id) {
          return { ...request, status: "accepted" as const }
        }
        return request
      }),
    )
    alert(`Запрос ${id} принят. Создана поставка.`)
  }

  // Функция для отклонения запроса на поставку
  // TODO: Заменить на вызов API для отклонения запроса
  const handleReject = (id: string) => {
    // API запрос на отклонение запроса
    // Пример: await fetch(`/api/delivery-requests/${id}/reject`, { method: 'POST' })

    // Обновление UI после успешного отклонения
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id === id) {
          return { ...request, status: "rejected" as const }
        }
        return request
      }),
    )
    alert(`Запрос ${id} отклонен.`)
  }

  // Определение колонок таблицы
  const columns: ColumnDef<DeliveryRequest>[] = [
    // Колонка с номером запроса
    {
      accessorKey: "number",
      header: "Номер",
      cell: ({ row }) => <div className="font-medium">#{row.getValue("number")}</div>,
    },
    // Колонка с заказчиком
    {
      accessorKey: "customer",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Заказчик
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("customer")}</div>,
    },
    {
      accessorKey: "requestDate",
      header: "Дата запроса",
      cell: ({ row }) => {
        const date = new Date(row.getValue("requestDate"))
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
      accessorKey: "quantity",
      header: "Количество",
      cell: ({ row }) => <div>{row.getValue("quantity")} шт.</div>,
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "amount",
      header: "Сумма",
      cell: ({ row }) => <div className="font-medium">{row.getValue("amount")}</div>,
    },
    // ... другие колонки

    // Колонка с действиями
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const request = row.original

        return (
          <div className="flex items-center gap-2">
            {/* Кнопка просмотра запроса */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/delivery-requests/${request.id}`)}
              className="h-8"
            >
              Просмотр
            </Button>
            {/* Кнопки принятия и отклонения запроса (только для запросов в статусе "pending") */}
            {request.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAccept(request.id)}
                  className="h-8 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300"
                >
                  <Check className="h-4 w-4 mr-1" /> Принять
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(request.id)}
                  className="h-8 bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
                >
                  <X className="h-4 w-4 mr-1" /> Отклонить
                </Button>
              </>
            )}
          </div>
        )
      },
    },
  ]

  // Инициализация таблицы с помощью TanStack Table
  const table = useReactTable({
    data: requests,
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

  // Рендер таблицы с запросами на поставку
  return (
    <div className="w-full">
      {/* Поле поиска по номеру запроса и выбор отображаемых колонок */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Поиск по номеру..."
          value={(table.getColumn("number")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("number")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
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
                      : column.id === "customer"
                        ? "Заказчик"
                        : column.id === "requestDate"
                          ? "Дата запроса"
                          : column.id === "products"
                            ? "Товары"
                            : column.id === "quantity"
                              ? "Количество"
                              : column.id === "status"
                                ? "Статус"
                                : column.id === "amount"
                                  ? "Сумма"
                                  : column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Таблица с запросами на поставку */}
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
        <div className="flex-1 text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} запросов</div>
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
