"use client";

import { useState, useRef, useEffect } from "react";
import { FileSpreadsheet, Loader2, ChevronDown, Download } from "lucide-react";

const CATEGORIES = [
  { key: "CULTURAL", label: "Culturals", desc: "Dance, Music, Drama & Literary" },
  { key: "SPORTS", label: "Sports", desc: "Athletics, Futsal, Cricket & Indoor" },
  { key: "CREATIVE_MEDIA", label: "Creative Media", desc: "Short Film, Photography & Design" },
  { key: "FOOD_FEST", label: "Food Fest", desc: "Culinary & MasterChef Competitions" },
  { key: "ALL", label: "All Categories", desc: "Complete Festival Category-Wise Sheets" },
];

export function CategoryExcelExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadingCat, setDownloadingCat] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (categoryKey: string, categoryLabel: string) => {
    setDownloadingCat(categoryKey);

    try {
      const response = await fetch(`/api/admin/export/category?category=${categoryKey}`, {
        method: "GET",
      });

      if (!response.ok) {
        let errorMsg = `Export failed (HTTP ${response.status})`;
        try {
          const json = await response.json();
          if (json.error) errorMsg = json.error;
        } catch {
          // ignore
        }
        throw new Error(errorMsg);
      }

      // Extract filename from Content-Disposition header if available
      let filename = `Aaroh_2K26_${categoryLabel.replace(/\s+/g, "_")}_Registrations.xlsx`;
      const disposition = response.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      // Convert to blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsOpen(false);
    } catch (err: any) {
      console.error("Export error:", err);
      alert(`Export Error (${categoryLabel}):\n${err.message || "Could not generate Excel file."}`);
    } finally {
      setDownloadingCat(null);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        disabled={downloadingCat !== null}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 bg-[#171310] hover:bg-[#231b14] text-[#E5BE45] border border-[#D4A72C]/40 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md hover:border-[#E5BE45] disabled:opacity-50"
      >
        {downloadingCat ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E5BE45]" />
        ) : (
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#E5BE45]" />
        )}
        <span>{downloadingCat ? "Exporting Excel..." : "Download Excel (Category)"}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#171310] border border-[#D4A72C]/40 rounded-lg shadow-2xl z-50 overflow-hidden divide-y divide-white/10 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3 bg-[#111111]/80">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#E5BE45] uppercase block">
              CATEGORY-WISE REGISTRATIONS
            </span>
            <span className="text-[11px] text-white/60 block mt-0.5">
              Select category to export all registrations in a single sheet
            </span>
          </div>

          <div className="p-1 space-y-0.5">
            {CATEGORIES.map((cat) => {
              const isCurrent = downloadingCat === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  disabled={downloadingCat !== null}
                  onClick={() => handleExport(cat.key, cat.label)}
                  className="w-full text-left px-3 py-2.5 rounded hover:bg-white/10 transition-colors flex items-center justify-between group disabled:opacity-50"
                >
                  <div>
                    <strong className="text-white text-xs block group-hover:text-[#E5BE45] transition-colors">
                      {cat.label}
                    </strong>
                    <span className="text-[10px] text-white/50 block">
                      {cat.desc}
                    </span>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#E5BE45]" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-white/40 group-hover:text-[#E5BE45] transition-colors" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
