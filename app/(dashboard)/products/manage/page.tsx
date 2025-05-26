import type { Metadata } from "next"
import { ManageProductsTable } from "@/components/manage-products-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Управление товарами",
  description: "Управление товарами поставщика",
}

export default function ManageProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Управление товарами</h2>
        <Link href="/products/create">
          <Button
            style={{
              backgroundColor: "#f97316",
              color: "white",
              borderColor: "#f97316",
            }}
            className="hover:bg-[#ea580c]"
          >
            Добавить товар
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        <ManageProductsTable />
      </div>
    </div>
  )
}
