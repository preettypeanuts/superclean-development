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
  startFrom?: Date;
  endTo?: Date;
}

export function DatePicker({ label, value, onChange, startFrom, endTo }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "min-w-[200px] w-full justify-start text-left font-normal",
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
          timeZone="UTC"
          disabled={{
            before: startFrom ? startFrom : new Date(1900, 0, 1),
            after: endTo ? endTo : new Date(2100, 11, 31)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
