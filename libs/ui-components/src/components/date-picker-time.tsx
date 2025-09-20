"use client"
import { Button } from "libs/ui-components/src/components/ui/button"
import { Calendar } from "libs/ui-components/src/components/ui/calendar"
import { Input } from "libs/ui-components/src/components/ui/input"
import { Label } from "libs/ui-components/src/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "libs/ui-components/src/components/ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface FormErrors {
  date?: string;
  time?: string;
}

interface FormData {
  date?: Date;
  time?: string;
}

type FormFieldKeys = keyof FormData;

type DatePickerTimeProps = {
  startFrom?: Date;
  endTo?: Date;
  onChange?: (data: FormData) => void;
  disabled?: boolean;
  value?: FormData;
};

export const DateTimePicker = ({ startFrom, endTo, onChange, disabled, value }: DatePickerTimeProps) => {
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({});

  const defaultTime = "09:30";

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | undefined>(defaultTime);

  useEffect(() => {
    if (value) {
      console.log(value, value.date, value.time);


      setDate(value.date);
      setTime(value.time ? value.time : defaultTime);
    } else {
      setDate(undefined);
      setTime(defaultTime);
    }
  }, [value]);

  const renderFormField = (
    label: string,
    fieldName: FormFieldKeys,
    required: boolean = true,
    children: React.ReactNode
  ): JSX.Element => (
    <div className="flex items-start space-x-4">
      <Label className="w-2/4 font-semibold mt-2">
        {label}
      </Label>
      <div className="flex-1">
        {children}
        {errors[fieldName] && (
          <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
        )}
      </div>
    </div>
  );
  return (
    <form className="space-y-4">
      <div className="flex flex-col gap-3">
        {renderFormField("Tanggal", "date", true,
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
                disabled={disabled}
              >
                {date ? date.toLocaleDateString('en-GB') : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date)
                  setOpen(false)
                  onChange?.({ date, time: time });
                }}
                disabled={{
                  before: startFrom ? startFrom : new Date(1900, 0, 1),
                  after: endTo ? endTo : new Date(2100, 11, 31)
                }}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {renderFormField("Jam", "time", true,
          <Input
            type="time"
            disabled={disabled}
            id="time"
            step="1"
            defaultValue={defaultTime}
            value={time}
            onChange={(e) => {
              const timeValue = e.target.value;
              setTime(timeValue);
              onChange?.({ date, time: timeValue });
            }}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        )}

      </div>
    </form>
  )
}
