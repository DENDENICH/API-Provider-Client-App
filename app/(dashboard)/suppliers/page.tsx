import type { Metadata } from "next"
import { SuppliersTable } from "@/components/suppliers-table"
import { AddSupplierForm } from "@/components/add-supplier-form"

export const metadata: Metadata = {
  title: "Поставщики",
  description: "Управление поставщиками",
}

export default function SuppliersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Поставщики</h2>
      </div>

      <AddSupplierForm />

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-4">Список поставщиков</h3>
        <SuppliersTable />
      </div>
    </div>
  )
}
