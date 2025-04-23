// "use client";
// import { Button } from "./ui/button";
// import { DropdownMenu, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel } from "./ui/dropdown-menu";
// import { LuListFilter } from "react-icons/lu";

// interface FilterStatusProps {
//   statusFilter: string;
//   setStatusFilter: (status: string) => void;
// }

// export function FilterStatus({ statusFilter, setStatusFilter }: FilterStatusProps) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button icon={<LuListFilter size={16} />} iconPosition="left" variant="outline">
//           {statusFilter === "1" ? "Aktif" : statusFilter === "0" ? "Tidak Aktif" : "Status"}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-40 border-none">
//         <DropdownMenuRadioGroup value={statusFilter} className="space-y-1" onValueChange={setStatusFilter}>
//           <DropdownMenuRadioItem  value="" className={statusFilter === "" ? "bg-mainColor/50 dark:bg-mainColor/30" : ""}>
//             Semua
//           </DropdownMenuRadioItem>
//           <DropdownMenuRadioItem value="1" className={statusFilter === "1" ? "bg-mainColor/50 dark:bg-mainColor/30" : ""}>
//             Aktif
//           </DropdownMenuRadioItem>
//           <DropdownMenuRadioItem value="0" className={statusFilter === "0" ? "bg-mainColor/50 dark:bg-mainColor/30" : ""}>
//             Tidak Aktif
//           </DropdownMenuRadioItem>
//         </DropdownMenuRadioGroup>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

"use client";

import * as React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LuListFilter } from "react-icons/lu";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options?: FilterOption[];
  placeholder?: string;
  widthClass?: string;
}

export function FilterStatus({
  value,
  onChange,
  options = [
    { value: "", label: "Semua" },
    { value: "1", label: "Aktif" },
    { value: "0", label: "Tidak Aktif" },
  ],
  placeholder = "Status",
  widthClass = "w-40",
}: FilterDropdownProps) {
  const currentLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon={<LuListFilter size={16} />} iconPosition="left" variant="outline">
          {currentLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`${widthClass} border-none`}>
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((opt) => (
            <DropdownMenuRadioItem
              key={opt.value}
              value={opt.value}
              className={
                value === opt.value
                  ? "bg-mainColor/50 dark:bg-mainColor/30"
                  : ""
              }
            >
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
