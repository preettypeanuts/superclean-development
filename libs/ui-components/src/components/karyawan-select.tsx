"use client"
import { useState, useEffect, useCallback } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Command, CommandItem, CommandList } from "./ui/command"
import { CommandInput } from "cmdk"
import { Label } from "./ui/label"
import { apiClient } from "libs/utils/apiClient"
import { useParameterStore } from "@shared/utils/useParameterStore"

interface Karyawan {
    id: string;
    username: string;
    fullname: string;
    noWhatsapp?: string;
    branchId?: string;
    roleId?: string;
    joinDate?: string;
    lastLogin?: string | null;
    status?: number;
    birthDate?: string;
    createdAt?: string;
    createdBy?: string;
}

interface KaryawanSelectProps {
    label?: string;
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    labelClassName?: string;
    statusFilter?: number;
    branchFilter?: string;
    roleFilter?: string;
    disabled?: boolean;
}

export default function KaryawanSelect({
    label,
    id,
    value,
    onChange,
    placeholder = "Pilih karyawan",
    className = "",
    labelClassName = "",
    statusFilter = 0,
    branchFilter = "",
    roleFilter = "",
    disabled = false
}: KaryawanSelectProps) {
    const [open, setOpen] = useState(false)
    const [dataKaryawan, setDataKaryawan] = useState<Karyawan[]>([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [totalData, setTotalData] = useState(0)

    const limit = 999

    const { roleMapping, branchMapping } = useParameterStore();


    const fetchKaryawan = useCallback(async () => {
        setLoading(true);
        try {
            let url = `/user/page?search=${searchQuery}&page=1&limit=${limit}`;

            if (statusFilter !== 0) {
                url += `&status=${statusFilter}`;
            }
            if (branchFilter) {
                url += `&branchId=${branchFilter}`;
            }
            if (roleFilter) {
                url += `&roleId=${roleFilter}`;
            }

            const result = await apiClient(url);

            setDataKaryawan(result.data[0] || []);
            setTotalData(result.data[1] || 0);
        } catch (error) {
            console.error("Error fetching karyawan:", error);
            setDataKaryawan([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, statusFilter, branchFilter, roleFilter, limit]);

    // Fetch data saat komponen mount dan filter berubah
    useEffect(() => {
        if (open) {
            fetchKaryawan();
        }
    }, [open, fetchKaryawan]);

    // Fetch data saat search query berubah (dengan debounce)
    useEffect(() => {
        if (!open) return;

        const timeoutId = setTimeout(() => {
            fetchKaryawan();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, fetchKaryawan, open]);

    const handleSelect = (karyawanId: string) => {
        onChange(karyawanId);
        setOpen(false);
    }

    const getSelectedKaryawan = () => {
        return dataKaryawan.find(k => k.id === value);
    }
    const processedKaryawan = dataKaryawan.map((item) => ({
        ...item,
        roleId: roleMapping[item.roleId] || "Tidak Diketahui",
        cabang: branchMapping[item.branchId] || "Tidak Diketahui",
    }));
    const selectedKaryawan = getSelectedKaryawan();

    return (
        <div className={`flex items-center space-x-4 ${className}`}>
            {label && (
                <Label htmlFor={id} className={`w-1/2 font-semibold ${labelClassName}`}>
                    {label}
                </Label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between min-h-9"
                        disabled={disabled}
                        aria-expanded={open}
                    >
                        <span className={`truncate ${!selectedKaryawan ? "text-muted-foreground capitalize" : ""}`}>
                            {selectedKaryawan ? selectedKaryawan.fullname : placeholder}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-[400px] !p-2">
                    <Command shouldFilter={false}>
                        <CommandInput
                            className="border px-2 mb-2 h-9 rounded-lg dark:bg-black"
                            placeholder="Cari karyawan..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                            {loading ? (
                                <CommandItem disabled>
                                    <div className="flex items-center justify-center w-full py-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                        <span className="ml-2">Loading...</span>
                                    </div>
                                </CommandItem>
                            ) : dataKaryawan.length === 0 ? (
                                <CommandItem disabled>
                                    <div className="flex items-center justify-center w-full py-2 text-muted-foreground">
                                        {searchQuery ? "Tidak ada karyawan ditemukan" : "Tidak ada karyawan tersedia"}
                                    </div>
                                </CommandItem>
                            ) : (
                                <>
                                    {processedKaryawan.map((karyawan) => (
                                        <CommandItem
                                            key={karyawan.id}
                                            onSelect={() => handleSelect(karyawan.id)}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className={`mr-2 ${value === karyawan.id ? "opacity-100" : "opacity-0"}`}>
                                                    <Check className="h-4 w-4" />
                                                </div>
                                                <div className="flex justify-between min-w-0 w-full">
                                                    <div>
                                                        <div className="font-medium truncate">{karyawan.fullname}</div>
                                                        {(karyawan.roleId) && (
                                                            <div className="text-xs text-muted-foreground truncate">
                                                                {[karyawan.roleId].filter(Boolean).join(" • ")}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {(karyawan.cabang) && (
                                                        <div className="text-xs text-muted-foreground truncate">
                                                            {[karyawan.cabang].filter(Boolean).join(" • ")}
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </CommandItem>
                                    ))}
                                    {totalData > limit && (
                                        <CommandItem disabled>
                                            <div className="text-xs text-muted-foreground text-center w-full py-1">
                                                Menampilkan {dataKaryawan.length} dari {totalData} karyawan
                                            </div>
                                        </CommandItem>
                                    )}
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}