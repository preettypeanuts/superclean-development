"use client"
import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "libs/ui-components/src/components/ui/button"
import { Calendar } from "libs/ui-components/src/components/ui/calendar"
import { Input } from "libs/ui-components/src/components/ui/input"
import { Label } from "libs/ui-components/src/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "libs/ui-components/src/components/ui/popover"

interface FormErrors {
    date?: string;
    time?: string;
}

interface FormData {
    date?: Date;
    time?: string;
}

type FormFieldKeys = keyof FormData;

export const DateTimePicker = () => {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [errors, setErrors] = useState<FormErrors>({});

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
                            >
                                {date ? date.toLocaleDateString() : "Select date"}
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
                        id="time"
                        step="1"
                        defaultValue="10:30:00"
                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                )}

            </div>
        </form>
    )
}