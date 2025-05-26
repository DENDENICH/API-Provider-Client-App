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
import { ArrowUpDown, Eye, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

// Типы данных для товара
// TODO: Обновить типы в соответствии с API бэкенда
type Product = {
  id: string
  name: string
  category: string
  articleNumber: string
  price: string
  stock: number
}

// Примерные данные для демонстрации
// TODO: Заменить на получение данных с сервера
const data: Product[] = [
  {
    id: "1",
    name: "Шампунь для окрашенных волос",
    category: "Уход за волосами",
    articleNumber: "SH-1001",
    price: "1200.00 ₽",
    stock: 45,
  },
  {
    id: "2",
    name: "Маска для волос",
    category: "Уход за волосами",
    articleNumber: "MH-2002",
    price: "1800.00 ₽",
    stock: 30,
  },
  {
    id: "3",
    name: "Крем для лица",
    category: "Уход за кожей",
    articleNumber: "CF-3003",
    price: "2500.00 ₽",
    stock: 20,
  },
  {
    id: "4",
    name: "Сыворотка антивозрастная",
    category: "Уход за кожей",
    articleNumber: "SA-4004",
    price: "3200.00 ₽",
    stock: 15,
  },
  {
    id: "5",
    name: "Крем для ног",
    category: "Маникюр и педикюр",
    articleNumber: "CF-5005",
    price: "950.00 ₽",
    stock: 50,
  },
  // ... другие товары
]

export function ManageProductsTable() {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Состояние для хранения списка товаров
  // TODO: Заменить на получение данных с сервера через useEffect
  const [products, setProducts] = React.useState<Product[]>(data)

  // Состояние для модального окна редактирования количества
  const [isStockDialogOpen, setIsStockDialogOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const [newStockValue, setNewStockValue] = React.useState<number>(0)
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Функция для открытия модального окна редактирования количества
  const handleOpenStockDialog = (product: Product) => {
    setSelectedProduct(product)
    setNewStockValue(product.stock)
    setIsStockDialogOpen(true)
  }

  // Функция для обновления количества товара
  const handleUpdateStock = async () => {
    if (!selectedProduct) return

    setIsUpdating(true)
    try {
      // В реальном приложении здесь будет API-запрос
      // Пример: await fetch(`/api/products/${selectedProduct.id}/stock`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ stock: newStockValue })
      // })

      // Имитация задержки запроса
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Обновляем список товаров
      setProducts((prev) =>
        prev.map((product) => (product.id === selectedProduct.id ? { ...product, stock: newStockValue } : product)),
      )

      // Закрываем модальное окно
      setIsStockDialogOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Ошибка при обновлении количества товара:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Функция для удаления товара
  // TODO: Заменить на вызов API для удаления товара
  const handleDeleteProduct = (id: string) => {
    if (confirm(`Вы уверены, что хотите удалить товар?`)) {
      // API запрос на удаление товара
      // Пример: await fetch(`/api/products/${id}`, { method: 'DELETE' })

      // Обновление UI после успешного удаления
      setProducts((prev) => prev.filter((product) => product.id !== id))
      alert(`Товар успешно удален`)
    }
  }

  // Определение колонок таблицы
  const columns: ColumnDef<Product>[] = [
    // Колонка с действиями (просмотр и удаление)
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => router.push(`/products/manage/${product.id}`)}
              title="Просмотр"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => handleDeleteProduct(product.id)}
              title="Удалить"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
    // Колонка с названием товара
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
    // ... другие колонки
    {
      accessorKey: "category",
      header: "Категория",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "articleNumber",
      header: "Артикул",
      cell: ({ row }) => <div>{row.getValue("articleNumber")}</div>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Цена
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("price")}</div>,
    },
    // Колонка с количеством товара на складе
    {
      accessorKey: "stock",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            В наличии
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const stock = Number.parseInt(row.getValue("stock"))
        const product = row.original
        return (
          <Button
            variant="link"
            className={`p-0 h-auto ${stock === 0 ? "text-red-500" : stock < 10 ? "text-yellow-500" : ""}`}
            onClick={() => handleOpenStockDialog(product)}
          >
            {stock} шт.
          </Button>
        )
      },
    },
  ]

  // Инициализация таблицы с помощью TanStack Table
  const table = useReactTable({
    data: products,
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
            {selectedProduct && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product-name" className="text-right">
                    Товар
                  </Label>
                  <div id="product-name" className="col-span-3 font-medium">
                    {selectedProduct.name}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product-article" className="text-right">
                    Артикул
                  </Label>
                  <div id="product-article" className="col-span-3">
                    {selectedProduct.articleNumber}
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
