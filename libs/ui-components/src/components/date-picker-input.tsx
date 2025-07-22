"use client"
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "../utils"
import { Button } from "libs/ui-components/src/components/ui/button"
import { Calendar } from "libs/ui-components/src/components/ui/calendar"
import { Input } from "libs/ui-components/src/components/ui/input"
import { Label } from "libs/ui-components/src/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "libs/ui-components/src/components/ui/popover"

interface DatePickerInputProps {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
  showTimeInput?: boolean;
  timeValue?: string;
  onTimeChange?: (time: string) => void;
  placeholder?: string;
  className: string;
}

// Helper function to format date for display (DD/MM/YYYY)
function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Helper function to check if date is valid
function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function DatePickerInput({ 
  label, 
  className,
  value, 
  onChange, 
  showTimeInput = false,
  timeValue = "10:30:00",
  onTimeChange,
  placeholder = "DD/MM/YYYY"
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false)
  
  // Convert string value to Date object (avoid timezone issues)
  const parseValueToDate = (dateString: string | undefined) => {
    if (!dateString) return undefined
    
    // If it's in YYYY-MM-DD format, parse it correctly
    const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (isoMatch) {
      const [, year, month, day] = isoMatch
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }
    
    // Fallback to regular Date parsing
    return new Date(dateString)
  }
  
  const dateValue = parseValueToDate(value)
  const [month, setMonth] = React.useState<Date | undefined>(dateValue)
  const [displayValue, setDisplayValue] = React.useState(formatDate(dateValue))
  
  // Update display value when value prop changes
  React.useEffect(() => {
    const date = parseValueToDate(value)
    setDisplayValue(formatDate(date))
    if (isValidDate(date)) {
      setMonth(date)
    }
  }, [value])
  
  // Handle input change with DD/MM/YYYY format
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value
    
    // Only allow numbers and forward slashes
    const cleanedValue = inputValue.replace(/[^\d/]/g, '')
    
    // Auto-format with slashes (DD/MM/YYYY)
    let formattedValue = cleanedValue
    
    // Add first slash after 2 digits
    if (cleanedValue.length >= 2 && cleanedValue.indexOf('/') === -1) {
      formattedValue = cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2)
    }
    
    // Add second slash after MM
    if (formattedValue.length >= 5 && formattedValue.split('/').length === 2) {
      const parts = formattedValue.split('/')
      if (parts[1].length >= 2) {
        formattedValue = parts[0] + '/' + parts[1].slice(0, 2) + '/' + parts[1].slice(2)
      }
    }
    
    // Limit length to DD/MM/YYYY format
    if (formattedValue.length > 10) return
    
    setDisplayValue(formattedValue)
    
    // Only parse and update if the format is complete DD/MM/YYYY
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    const match = formattedValue.match(dateRegex)
    
    if (match) {
      const [, day, month, year] = match
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      
      // Validate the date is reasonable and actually valid
      if (isValidDate(date) && 
          parseInt(day) >= 1 && parseInt(day) <= 31 &&
          parseInt(month) >= 1 && parseInt(month) <= 12 &&
          parseInt(year) >= 1900 && parseInt(year) <= 2100 &&
          date.getDate() === parseInt(day) && // Make sure day wasn't adjusted
          date.getMonth() === parseInt(month) - 1 && // Make sure month wasn't adjusted
          date.getFullYear() === parseInt(year)) { // Make sure year wasn't adjusted
        
        // Format to YYYY-MM-DD without timezone issues
        const formattedDate = `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        onChange?.(formattedDate)
        setMonth(date)
      }
    }
    // Don't try to parse incomplete input - let user type freely
  }
  
  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date && onChange) {
      // Format to YYYY-MM-DD without timezone issues
      const year = date.getFullYear().toString()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      
      onChange(formattedDate)
      setDisplayValue(formatDate(date))
      setMonth(date)
    }
    setOpen(false)
  }
  
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setOpen(true)
    }
  }

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col gap-3 flex-1">
        {label && (
          <Label htmlFor="date-input" className="px-1 font-semibold">
            {label}
          </Label>
        )}
        <div className="relative flex gap-2">
          <Input
            id="date-input"
            type="text"
            placeholder={placeholder}
            value={displayValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`${className} bg-background pr-10`}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                type="button"
                variant="ghost"
                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              >
                <CalendarIcon className="size-3.5" />
                <span className="sr-only">Select date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto overflow-hidden p-0" 
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={dateValue}
                captionLayout="dropdown"
                month={month}
                onMonthChange={setMonth}
                onSelect={handleDateSelect}
                initialFocus
                fromYear={1900}
                toYear={new Date().getFullYear() + 10}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {showTimeInput && (
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-picker" className="px-1 font-semibold">
            Time
          </Label>
          <Input
            type="time"
            id="time-picker"
            step="1"
            value={timeValue}
            onChange={(e) => onTimeChange?.(e.target.value)}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      )}
    </div>
  )
}