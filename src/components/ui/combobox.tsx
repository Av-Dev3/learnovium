"use client"

import * as React from "react"
import { Check, ChevronDown, ChevronUp, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export interface ComboboxOption {
  label: string
  value: string
  disabled?: boolean
  description?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  allowClear?: boolean
  maxHeight?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  disabled = false,
  className,
  allowClear = false,
  maxHeight = "300px",
}: ComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedOption = options.find((option) => option.value === value)
  
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue)
    setIsOpen(false)
    setSearchQuery("")
    setHighlightedIndex(-1)
  }

  const handleClear = () => {
    onValueChange?.("")
    setSearchQuery("")
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return

    switch (event.key) {
      case "Enter":
        event.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex].value)
        }
        break
      case "ArrowDown":
        event.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        event.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case "Escape":
        setIsOpen(false)
        setSearchQuery("")
        setHighlightedIndex(-1)
        break
    }
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        setSearchQuery("")
        setHighlightedIndex(-1)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery("")
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div
        className={cn(
          "flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300/70 hover:bg-white/90 hover:shadow-md",
          isOpen && "border-blue-500 ring-2 ring-blue-500/20",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex flex-1 items-center">
          {selectedOption ? (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.description && (
                <span className="text-xs text-gray-500 truncate">
                  ({selectedOption.description})
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {allowClear && selectedOption && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 opacity-50 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-2xl border border-gray-200/50 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-0 bg-transparent focus:ring-0 focus:outline-none text-sm"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-[300px] overflow-auto p-2">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                {searchQuery ? "No options found" : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-start rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-sm",
                    highlightedIndex === index
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900"
                      : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-gray-900",
                    option.disabled && "cursor-not-allowed opacity-50",
                    option.value === value && "bg-blue-50 text-blue-900"
                  )}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 mr-3 mt-0.5 transition-colors">
                    {option.value === value && (
                      <Check className="h-3 w-3 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
