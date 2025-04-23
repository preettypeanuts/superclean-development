"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "../utils"
import { Button } from "libs/ui-components/src/components/ui/button"
import { Calendar } from "libs/ui-components/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "libs/ui-components/src/components/ui/popover"
import { formatDateAPI, formatDateCalendar } from "libs/utils/formatDate"

interface DatePickerProps {
  label?: string;
  value?: Date | null;
  onChange?: (date: Date | undefined) => void;
}

export function DatePicker({ label, value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value ? formatDateCalendar(value) : <span>{label ? label : "Pilih Tanggal"}</span>}
          <CalendarIcon className="ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
