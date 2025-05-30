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
import { expensesService } from "@/lib/api-services"
import type { ProductResponse } from "@/lib/api-types"
import { useToast } from "@/hooks/use-toast"

export function ManageProductsTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Состояние для данных
  const [products, setProducts] = React.useState<ProductResponse[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Состояние для модального окна редактирования количества
  const [isStockDialogOpen, setIsStockDialogOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<ProductResponse | null>(null)
  const [newStockValue, setNewStockValue] = React.useState<number>(0)
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Загрузка товаров при монтировании компонента
  React.useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching products for management...")

      // Для поставщиков используем API expenses вместо products
      const response = await expensesService.getExpenses()
      console.log("Manage products API response:", response)

      // Преобразуем expenses в формат ProductResponse
      const transformedProducts: ProductResponse[] = response.expenses.map((expense) => ({
        id: expense.product_id,
        article: expense.article,
        name: expense.product_name,
        category: expense.category,
        description: expense.description,
        price: 0, // Цена не приходит в expenses, можно установить 0 или скрыть колонку
        quantity: expense.quantity,
        organizer_name: expense.supplier_name,
      }))

      setProducts(transformedProducts)

      toast({
        title: "Товары загружены",
        description: `Загружено ${transformedProducts.length} товаров`,
      })
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить список товаров",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для открытия модального окна редактирования количества
  const handleOpenStockDialog = (product: ProductResponse) => {
    setSelectedProduct(product)
    setNewStockValue(product.quantity || 0)
    setIsStockDialogOpen(true)
  }

  const handleUpdateStock = async () => {
    if (!selectedProduct) return

    setIsUpdating(true)
    try {
      console.log(`Updating stock for product ${selectedProduct.id} to ${newStockValue}`)

      // Используем API expenses для обновления количества
      await expensesService.updateExpenseQuantity(selectedProduct.id, newStockValue)

      setProducts((prev) =>
        prev.map((product) => (product.id === selectedProduct.id ? { ...product, quantity: newStockValue } : product)),
      )

      toast({
        title: "Количество обновлено",
        description: `Количество товара "${selectedProduct.name}" изменено на ${newStockValue} шт.`,
      })

      setIsStockDialogOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Error updating stock:", error)
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить количество товара",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteProduct = async (product: ProductResponse) => {
    if (!confirm(`Вы уверены, что хотите удалить товар "${product.name}"?`)) {
      return
    }

    try {
      console.log(`Deleting product ${product.id}`)

      // Используем API expenses для удаления
      await expensesService.deleteExpense(product.id)

      setProducts((prev) => prev.filter((p) => p.id !== product.id))

      toast({
        title: "Товар удален",
        description: `Товар "${product.name}" успешно удален`,
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить товар",
        variant: "destructive",
      })
    }
  }

  // Определение колонок таблицы
  const columns: ColumnDef<ProductResponse>[] = [
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
              onClick={() => handleDeleteProduct(product)}
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
    {
      accessorKey: "category",
      header: "Категория",
      cell: ({ row }) => {
        const category = row.getValue("category") as string
        const categoryMap: Record<string, string> = {
          hair_coloring: "Окрашивание волос",
          hair_care: "Уход за волосами",
          hair_styling: "Стайлинг для волос",
          consumables: "Расходники",
          perming: "Химическая завивка",
          eyebrows: "Брови",
          manicure_and_pedicure: "Маникюр и педикюр",
          tools_and_equipment: "Инструменты и оборудование",
        }
        return <div>{categoryMap[category] || category}</div>
      },
    },
    {
      accessorKey: "article",
      header: "Артикул",
      cell: ({ row }) => <div>{row.getValue("article")}</div>,
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
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency: "RUB",
        }).format(price)
        return <div className="font-medium">{formatted}</div>
      },
    },
    // Колонка с количеством товара на складе
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            В наличии
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const quantity = row.getValue("quantity") as number | null
        const product = row.original

        if (quantity === null || quantity === undefined) {
          return <div className="text-muted-foreground">—</div>
        }

        return (
          <Button
            variant="link"
            className={`p-0 h-auto ${quantity === 0 ? "text-red-500" : quantity < 10 ? "text-yellow-500" : ""}`}
            onClick={() => handleOpenStockDialog(product)}
          >
            {quantity} шт.
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

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input placeholder="Поиск по названию..." disabled className="max-w-sm" />
        </div>
        <div className="rounded-md border">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

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
                    {selectedProduct.article}
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
