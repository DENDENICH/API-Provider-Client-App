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
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

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

// Типы данных
type Supplier = {
  id: string
  name: string
  inn: string
  address: string
  contractDate: string
}

// Примерные данные
const data: Supplier[] = [
  {
    id: "1",
    name: "L'Oréal Professional",
    inn: "1234567890",
    address: "г. Москва, ул. Тверская, д. 10",
    contractDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Clarins",
    inn: "0987654321",
    address: "г. Москва, ул. Арбат, д. 25",
    contractDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Gehwol",
    inn: "5678901234",
    address: "г. Москва, ул. Ленина, д. 15",
    contractDate: "2023-03-10",
  },
  {
    id: "4",
    name: "Janssen Cosmetics",
    inn: "4321098765",
    address: "г. Москва, ул. Пушкина, д. 20",
    contractDate: "2023-04-05",
  },
  {
    id: "5",
    name: "Kérastase",
    inn: "9876543210",
    address: "г. Москва, ул. Гагарина, д. 30",
    contractDate: "2023-05-12",
  },
]

// Определение колонок
export const columns: ColumnDef<Supplier>[] = [
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
    accessorKey: "inn",
    header: "ИНН",
    cell: ({ row }) => <div>{row.getValue("inn")}</div>,
  },
  {
    accessorKey: "address",
    header: "Адрес",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.getValue("address")}>
        {row.getValue("address")}
      </div>
    ),
  },
  {
    accessorKey: "contractDate",
    header: "Дата контракта",
    cell: ({ row }) => {
      const date = new Date(row.getValue("contractDate"))
      return <div>{date.toLocaleDateString("ru-RU")}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const supplier = row.original
      const [isDeleting, setIsDeleting] = React.useState(false)

      const handleDeleteContract = () => {
        setIsDeleting(true)
        // Имитация удаления контракта
        setTimeout(() => {
          alert(`Контракт с поставщиком ${supplier.name} расторгнут`)
          setIsDeleting(false)
        }, 1000)
      }

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
            <DropdownMenuItem onClick={handleDeleteContract} disabled={isDeleting} className="text-destructive">
              {isDeleting ? "Удаление..." : "Расторгнуть контракт"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function SuppliersTable() {
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
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} поставщиков
        </div>
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
