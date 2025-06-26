"use client"
import { useState } from "react"
import { Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Command, CommandItem, CommandList } from "./ui/command"
import { CommandInput } from "cmdk"
import { IoIosArrowDown } from "react-icons/io"

interface Staff {
    lookupKey: string;
    lookupValue: string;
}

interface MultiSelectProps {
    staffList: Staff[];
    selected: string[];
    onSelectionChange: (selected: string[]) => void;
    placeholder?: string;
    loading?: boolean;
}

export default function MultiSelect({
    staffList = [],
    selected = [],
    onSelectionChange,
    placeholder = "Pilih petugas",
    loading = false
}: MultiSelectProps) {
    const [open, setOpen] = useState(false)

    console.log('====================================');
    console.log(staffList);
    console.log('====================================');

    const toggleSelect = (staffKey: string) => {
        const newSelected = selected.includes(staffKey)
            ? selected.filter((item) => item !== staffKey)
            : [...selected, staffKey];
        onSelectionChange(newSelected);
    }

    const getStaffName = (staffKey: string) => {
        const staff = staffList.find(s => s.lookupKey === staffKey);
        return staff ? staff.lookupValue : staffKey;
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="relative w-full flex justify-start items-center min-h-9  overflow-hidden !p-0">
                    {/* Scrollable content container */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pr-[85px] pl-2">
                        {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
                        {selected.map((staffKey) => (
                            <Badge
                                key={staffKey}
                                variant="outline"
                                className="bg-baseLight/50 dark:bg-baseDark/80 text-teal-800 dark:text-baseLight dark:border-mainColor/70 border-mainColor rounded-full px-2 py-0.5 flex-shrink-0"
                            >
                                {getStaffName(staffKey)}
                            </Badge>
                        ))}
                    </div>

                    {/* Fixed gradient overlay */}
                    <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white dark:from-black to-transparent w-[85px] pointer-events-none z-10"></div>

                    {/* Fixed arrow icon */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                        <IoIosArrowDown size={16} className="text-muted-foreground opacity-85" />
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-[390px] !p-2">
                <Command>
                    <CommandInput className="border px-2 mb-2 h-9 rounded-lg dark:bg-black" placeholder="Cari petugas..." />
                    <CommandList>
                        {loading ? (
                            <CommandItem disabled>
                                <div className="flex items-center justify-center w-full py-2">
                                    Loading...
                                </div>
                            </CommandItem>
                        ) : staffList.length === 0 ? (
                            <CommandItem disabled>
                                <div className="flex items-center justify-center w-full py-2 text-muted-foreground">
                                    Tidak ada petugas tersedia
                                </div>
                            </CommandItem>
                        ) : (
                            staffList.map((staff) => (
                                <CommandItem
                                    key={staff.lookupKey}
                                    onSelect={() => toggleSelect(staff.lookupKey)}
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="col-span-1">
                                            {staff.lookupValue}
                                        </div>
                                        <div className={`${selected.includes(staff.lookupKey) ? "opacity-100" : "opacity-0"}`}>
                                            <Check />
                                        </div>
                                    </div>
                                </CommandItem>
                            ))
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}