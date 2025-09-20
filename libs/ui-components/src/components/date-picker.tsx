"use client"

import { Input } from "@ui-components/components/ui/input"
import { Button } from "libs/ui-components/src/components/ui/button"
import { Calendar } from "libs/ui-components/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "libs/ui-components/src/components/ui/popover"
import { formatDateCalendar } from "libs/utils/formatDate"
import { CalendarIcon } from "lucide-react"
import { cn } from "../utils"

interface DatePickerProps {
  label?: string;
  value?: Date | null;
  onChange?: (date: Date | undefined) => void;
  startFrom?: Date;
  endTo?: Date;
  withTime?: boolean;
  defaultTime?: string;
  onChangeTime?: (time: string) => void;
  disabled?: boolean;
}

export function DatePicker({ label, value, onChange, startFrom, endTo, withTime, defaultTime = "00:00", onChangeTime, disabled }: DatePickerProps) {
  return (
    <div className="min-w-[200px] flex space-x-2 w-full justify-start text-left font-normal">
      <Popover>
        <PopoverTrigger disabled={disabled} asChild>
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

      {withTime && (
        <div className="flex flex-col gap-3">
          <Input
            disabled={disabled}
            className='w-max [&::-webkit-calendar-picker-indicator]:bg-black [&::-webkit-calendar-picker-indicator]:cursor-pointer'
            defaultValue={defaultTime}
            onChange={(e) => {
              if (onChangeTime) {
                onChangeTime(e.target.value);
              }
            }}
            type="time"
          />
        </div>
      )}
    </div>
  )
}
