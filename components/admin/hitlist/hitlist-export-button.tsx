"use client"

import { Download } from "lucide-react"
import { useHitlistAdmin } from "@/hooks/admin/hitlist/use-hitlist-admin"

export default function HitlistExportButton() {
  const { isExporting, handleExport } = useHitlistAdmin()

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-md shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      {isExporting ? "Exporting..." : "Export Top 20 CSV"}
    </button>
  )
}