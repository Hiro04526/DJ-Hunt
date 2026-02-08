"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { exportHitlistToCSV } from "@/app/actions/hitlist"

export default function HitlistExportButton() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      // 1. Call Server Action
      const result = await exportHitlistToCSV()

      if (result.success && result.csv) {
        // 2. Create Download Link
        const blob = new Blob([result.csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        
        const date = new Date().toISOString().split('T')[0]
        a.href = url
        a.download = `hitlist-top20-${date}.csv`
        
        document.body.appendChild(a)
        a.click()
        
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert("Failed to export: " + result.error)
      }
    } catch (e) {
      console.error(e)
      alert("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-md shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      {loading ? "Exporting..." : "Export Top 20 CSV"}
    </button>
  )
}