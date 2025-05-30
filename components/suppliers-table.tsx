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
import { suppliersService } from "@/lib/api-services"
import type { SupplierResponse } from "@/lib/api-types"
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"

// Определение колонок
export const columns: ColumnDef<SupplierResponse>[] = [
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
    accessorKey: "bank_details",
    header: "Банковские реквизиты",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate" title={row.getValue("bank_details")}>
        {row.getValue("bank_details")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const supplier = row.original
      const [isDeleting, setIsDeleting] = React.useState(false)
      const { toast } = useToast()

      const handleDeleteSupplier = async () => {
        setIsDeleting(true)
        try {
          await suppliersService.removeSupplier(supplier.id)
          toast({
            title: "Успешно",
            description: `Контракт с поставщиком ${supplier.name} расторгнут`,
          })
          // Обновляем данные
          window.location.reload()
        } catch (error) {
          console.error("Error deleting supplier:", error)
          toast({
            title: "Ошибка",
            description: "Не удалось расторгнуть контракт с поставщиком",
            variant: "destructive",
          })
        } finally {
          setIsDeleting(false)
        }
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
            <DropdownMenuItem onClick={handleDeleteSupplier} disabled={isDeleting} className="text-destructive">
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
  const [suppliers, setSuppliers] = React.useState<SupplierResponse[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { toast } = useToast()

  // Загрузка поставщиков при монтировании компонента
  React.useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true)
        console.log("Fetching suppliers...")
        const response = await suppliersService.getSuppliers()
        console.log("Suppliers response:", response)
        setSuppliers(response.organizers || [])
      } catch (error) {
        console.error("Error fetching suppliers:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список поставщиков",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuppliers()
  }, [toast])

  const table = useReactTable({
    data: suppliers,
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
        <div className="flex items-center justify-center py-8">
          <Icons.spinner className="h-8 w-8 animate-spin" />
          <span className="ml-2">Загрузка поставщиков...</span>
        </div>
      </div>
    )
  }

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
                  Нет поставщиков.
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
