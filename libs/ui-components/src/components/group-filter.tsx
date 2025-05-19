import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Button } from "./ui/button";
import { FaFilter } from "react-icons/fa";
import { ReactNode } from "react";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";

type GroupFilterProps = {
  children: ReactNode;
  label?: string;
  icon?: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  withArrow?: boolean;
  className?: string;
  onApply?: () => void;
  onReset?: () => void;
  onCancel?: () => void;
};

export function GroupFilter({
  children,
  label = "Filter",
  icon = <FaFilter />,
  side = "bottom",
  align = "start",
  withArrow = true,
  className = "space-y-2",
  onApply,
  onReset,
  onCancel,
}: GroupFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = () => {
    onCancel?.();
    setIsOpen(false);
  };

  const handleApply = () => {
    onApply?.();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {icon}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className={className}>
        {children}
        <DropdownMenuSeparator className="!my-3 !-mx-5" />
        <div className="flex justify-between">
          <button
            className="text-destructive text-sm font-medium"
            onClick={() => {
              onReset?.();
            }}
          >
            Hapus Semua Filter
          </button>
          <div className="space-x-2">
            <Button type="button" variant="outline2" onClick={handleCancel}>
              Batal
            </Button>
            <Button type="submit" variant="main" onClick={handleApply}>
              Terapkan
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
