"use client"

import * as React from "react"
import { X, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Option {
  label: string
  value: string
  disabled?: boolean
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
  placeholder?: string
  disabled?: boolean
  maxDisplay?: number
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Select options...",
  disabled = false,
  maxDisplay = 3,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedOptions = options.filter((option) => selected.includes(option.value))
  const unselectedOptions = options.filter((option) => !selected.includes(option.value))

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value))
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < unselectedOptions.length) {
          handleSelect(unselectedOptions[highlightedIndex].value)
        }
        break
      case "ArrowDown":
        event.preventDefault()
        setHighlightedIndex((prev) =>
          prev < unselectedOptions.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        event.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : unselectedOptions.length - 1
        )
        break
      case "Escape":
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setHighlightedIndex(-1)
    }
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
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
        <div className="flex flex-1 flex-wrap gap-1">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <>
              {selectedOptions.slice(0, maxDisplay).map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="group cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(option.value)
                  }}
                >
                  {option.label}
                  <X className="ml-1 h-3 w-3 opacity-60 group-hover:opacity-100" />
                </Badge>
              ))}
              {selectedOptions.length > maxDisplay && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  +{selectedOptions.length - maxDisplay} more
                </Badge>
              )}
            </>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-2xl border border-gray-200/50 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10">
          <div className="max-h-60 overflow-auto p-2">
            {unselectedOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
            ) : (
              unselectedOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-sm",
                    highlightedIndex === index
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900"
                      : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-gray-900",
                    option.disabled && "cursor-not-allowed opacity-50"
                  )}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 mr-3 transition-colors">
                    {selected.includes(option.value) && (
                      <Check className="h-3 w-3 text-blue-600" />
                    )}
                  </div>
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
