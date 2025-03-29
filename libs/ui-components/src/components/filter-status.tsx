"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LuListFilter } from "react-icons/lu";

interface FilterStatusProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export function FilterStatus({ statusFilter, setStatusFilter }: FilterStatusProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon={<LuListFilter size={16} />} iconPosition="left" variant="outline">
          {statusFilter === "1" ? "Aktif" : statusFilter === "0" ? "Tidak Aktif" : "Semua"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 border-none">
        <DropdownMenuRadioGroup value={statusFilter} className="space-y-1" onValueChange={setStatusFilter}>
            <DropdownMenuRadioItem value="" className={statusFilter === "" ? "bg-mainColor/50 dark:bg-mainColor/30" : ""}>
            Semua
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="1" className={statusFilter === "1" ? "bg-mainColor/50 dark:bg-mainColor/30" : ""}>
            Aktif
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="0" className={statusFilter === "0" ? "bg-mainColor/50 dark:bg-mainColor/30" : ""}>
            Tidak Aktif
            </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
