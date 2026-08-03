"use client"

import { useState } from "react"
import { Download, RefreshCw, FileDown, ChevronDown } from "lucide-react"
import { HitlistExport } from "@/types/hitlist-admin"

interface ExportMenuProps {
  exports: HitlistExport[]
  isLoading: boolean
  downloadingId: number | null
  onDownload: (id: number) => void
}

export default function ExportMenu({ exports, isLoading, downloadingId, onDownload }: ExportMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#569429] hover:bg-[#63a92f] transition-colors text-m font-bold cursor-pointer"
      >
        <Download size={16} />
        Export CSV
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* backdrop, closes the menu on outside click */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-[#111] border border-[#222] rounded-xl shadow-xl z-20 custom-scrollbar">
            <div className="p-3 border-b border-[#222] sticky top-0 bg-[#111]">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Past Exports</p>
            </div>

            {isLoading ? (
              <div className="p-4 flex items-center justify-center text-gray-500 text-sm gap-2">
                <RefreshCw size={14} className="animate-spin" /> Loading...
              </div>
            ) : exports.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No exports yet. One is saved automatically each time a cycle resets.
              </div>
            ) : (
              <ul className="p-1">
                {exports.map((exp) => (
                  <li key={exp.id}>
                    <button
                      onClick={() => {
                        onDownload(exp.id)
                        setOpen(false)
                      }}
                      disabled={downloadingId === exp.id}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-[#222] transition-colors text-sm text-gray-200 disabled:opacity-50 cursor-pointer"
                    >
                      {downloadingId === exp.id ? (
                        <RefreshCw size={14} className="animate-spin text-[#569429] shrink-0" />
                      ) : (
                        <FileDown size={14} className="text-[#569429] shrink-0" />
                      )}
                      <span className="truncate">{exp.filename}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}