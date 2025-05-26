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
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Типы данных
type Product = {
  id: string
  name: string
  category: string
  articleNumber: string
  supplier: string
  price: string
}

// Примерные данные
const data: Product[] = [
  {
    id: "1",
    name: "Шампунь для окрашенных волос",
    category: "Уход за волосами",
    articleNumber: "SH-1001",
    supplier: "L'Oréal Professional",
    price: "1200 ₽",
  },
  {
    id: "2",
    name: "Маска для волос",
    category: "Уход за волосами",
    articleNumber: "MH-2002",
    supplier: "Kérastase",
    price: "1800 ₽",
  },
  {
    id: "3",
    name: "Крем для лица",
    category: "Уход за волосами",
    articleNumber: "CF-3003",
    supplier: "Clarins",
    price: "2500 ₽",
  },
  {
    id: "4",
    name: "Сыворотка антивозрастная",
    category: "Уход за волосами",
    articleNumber: "SA-4004",
    supplier: "Janssen Cosmetics",
    price: "3200 ₽",
  },
  {
    id: "5",
    name: "Крем для ног",
    category: "Маникюр и педикюр",
    articleNumber: "CF-5005",
    supplier: "Gehwol",
    price: "950 ₽",
  },
  {
    id: "6",
    name: "Масло для ногтей",
    category: "Маникюр и педикюр",
    articleNumber: "NO-6006",
    supplier: "Gehwol",
    price: "750 ₽",
  },
  {
    id: "7",
    name: "Пилинг для лица",
    category: "Уход за волосами",
    articleNumber: "PF-7007",
    supplier: "Janssen Cosmetics",
    price: "1900 ₽",
  },
  {
    id: "8",
    name: "Альгинатная маска",
    category: "Уход за волосами",
    articleNumber: "AM-8008",
    supplier: "Janssen Cosmetics",
    price: "1500 ₽",
  },
  {
    id: "9",
    name: "Термозащита для волос",
    category: "Стайлинг для волос",
    articleNumber: "TH-9009",
    supplier: "L'Oréal Professional",
    price: "1100 ₽",
  },
  {
    id: "10",
    name: "Масло для волос",
    category: "Уход за волосами",
    articleNumber: "OH-1010",
    supplier: "Kérastase",
    price: "2200 ₽",
  },
]

// Определение колонок
export const columns: ColumnDef<Product>[] = [
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
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "articleNumber",
    header: "Артикул",
    cell: ({ row }) => <div>{row.getValue("articleNumber")}</div>,
  },
  {
    accessorKey: "supplier",
    header: "Поставщик",
    cell: ({ row }) => <div>{row.getValue("supplier")}</div>,
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
]

export function ProductsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Поиск по названию..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
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
    </div>
  )
}
