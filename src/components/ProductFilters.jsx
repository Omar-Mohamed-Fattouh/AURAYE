// src/components/ProductFilters.jsx
import { useMemo } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Search, ChevronDown } from "lucide-react";

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  onReset,
  sortBy,
  onSortChange,
  filters = [], // [{ key, label, value, onChange, options: [] }]
}) {
  return (
    <div className="w-full space-y-4 mb-6">
      {/* Search */}
      <div
        className="
          w-full 
          bg-gray-50 border border-gray-200 
          rounded-full px-4 py-2 
          flex items-center gap-2
          shadow-sm
          transition-all duration-200 ease-out
          focus-within:border-black focus-within:bg-white focus-within:shadow-md
        "
      >
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
        />
      </div>

      {/* Row: Reset + Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs md:text-sm">
        {/* Reset pill */}
        <button
          onClick={onReset}
          className="
            inline-flex items-center gap-2
            px-3 py-1.5 rounded-full
            border border-gray-300
            text-gray-700
            hover:bg-gray-100
            transition-all duration-150
            w-fit
          "
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          Reset filters
        </button>

        {/* Sort dropdown */}
        <SortDropdown sortBy={sortBy} onSortChange={onSortChange} />
      </div>

      {/* Filter dropdowns row */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 md:gap-3">
          {filters.map((filter) => (
            <FilterDropdown
              key={filter.key}
              label={filter.label}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Sort Dropdown (Navbar-style) ---------- */

function SortDropdown({ sortBy, onSortChange }) {
  const label = useMemo(() => {
    if (sortBy === "price-asc") return "Price: Low → High";
    if (sortBy === "price-desc") return "Price: High → Low";
    if (sortBy === "newest") return "Newest";
    return "Default";
  }, [sortBy]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="
          inline-flex items-center gap-2 
          px-4 py-2 rounded-full
          bg-black text-white text-xs md:text-sm
          hover:bg-black/90 
          transition
        "
      >
        <span>Sort by: {label}</span>
        <ChevronDown size={14} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="
          bg-[#111] text-white rounded-md p-2 
          shadow-xl min-w-[180px] 
          border border-white/10 
          flex flex-col gap-1
        "
        sideOffset={8}
      >
        <SortItem
          active={sortBy === "default"}
          onClick={() => onSortChange("default")}
        >
          Default
        </SortItem>
        <SortItem
          active={sortBy === "price-asc"}
          onClick={() => onSortChange("price-asc")}
        >
          Price: Low → High
        </SortItem>
        <SortItem
          active={sortBy === "price-desc"}
          onClick={() => onSortChange("price-desc")}
        >
          Price: High → Low
        </SortItem>
        <SortItem
          active={sortBy === "newest"}
          onClick={() => onSortChange("newest")}
        >
          Newest
        </SortItem>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function SortItem({ children, active, onClick }) {
  return (
    <DropdownMenu.Item
      onClick={onClick}
      className={`
        px-3 py-2 rounded-md text-xs md:text-sm cursor-pointer
        ${active ? "bg-white/15" : "hover:bg-white/10"}
        transition
      `}
    >
      {children}
    </DropdownMenu.Item>
  );
}

/* ---------- Filter Dropdown (Navbar-style) ---------- */

function FilterDropdown({ label, value, onChange, options }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className="
          flex items-center gap-2 
          px-4 py-2 rounded-full
          bg-black text-white text-xs md:text-sm
          hover:bg-black/90 
          transition
        "
      >
        <span>{label}:</span>
        <span className="font-semibold">
          {value === "all" ? "All" : value}
        </span>
        <ChevronDown size={14} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="
          bg-[#111] text-white rounded-md p-3 
          shadow-xl min-w-[200px] 
          border border-white/10 
          flex flex-col gap-1
        "
        sideOffset={8}
      >
        <DropdownMenu.Item
          onClick={() => onChange("all")}
          className={`
            px-3 py-2 rounded-md text-xs md:text-sm cursor-pointer
            ${value === "all" ? "bg-white/15" : "hover:bg:white/10"}
            transition
          `}
        >
          All
        </DropdownMenu.Item>

        {options.map((opt) => (
          <DropdownMenu.Item
            key={opt}
            onClick={() => onChange(opt)}
            className={`
              px-3 py-2 rounded-md text-xs md:text-sm cursor-pointer
              ${value === opt ? "bg:white/15" : "hover:bg:white/10"}
              transition
            `}
          >
            {opt}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
