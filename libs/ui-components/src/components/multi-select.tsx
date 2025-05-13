"use client"
import { useState } from "react"
import { ArrowDown, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Command, CommandItem, CommandList } from "./ui/command"
import { CommandInput } from "cmdk"
import { IoIosArrowDown, IoMdArrowDown } from "react-icons/io"

const allStaff = ["Dani", "Ahmad", "Dewi", "Budi", "Sari"]

export default function MultiSelect() {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(["Dani", "Ahmad", "Dewi"])

    const toggleSelect = (name: string) => {
        setSelected((prev) =>
            prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
        )
    }

    const removeItem = (name: string) => {
        setSelected((prev) => prev.filter((item) => item !== name))
    }

    return (

        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full flex justify-start items-center flex-wrap gap-1 min-h-9 !px-2 !py-0">
                    {selected.length === 0 && <span className="text-muted-foreground">Pilih petugas</span>}
                    {selected.map((name) => (
                        <Badge
                            key={name}
                            variant="outline"
                            className="bg-baseLight/50 dark:bg-baseDark/80 text-teal-800 dark:text-baseLight dark:border-mainColor/70 border-mainColor rounded-full px-2 py-0.5"
                        >
                            {name}
                        </Badge>
                    ))}
                    <span className="ml-auto mr-1 opacity-85 text-muted-foreground">
                        <IoIosArrowDown size={3}/>
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-[390px]">
                <Command>
                    <CommandInput className="border px-2 mb-2 h-9 rounded-lg dark:bg-black" placeholder="Cari petugas..." />
                    <CommandList>
                        {allStaff.map((name) => (
                            <CommandItem
                                key={name}
                                onSelect={() => toggleSelect(name)}
                                className="cursor-pointer"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="col-span-1">
                                        {name}
                                    </div>
                                    <div className={`${selected.includes(name) ? "opacity-100" : "opacity-0"}`}>
                                        <Check />
                                    </div>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
