import * as React from "react";
import { Input } from "./ui/input"; // pastikan path-nya sesuai
import { cn } from '../utils';
import { formatRupiah } from "../../../utils/formatRupiah";

interface RupiahInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  loading?: boolean;
  onValueChange?: (value: number) => void; // callback untuk nilai aslinya (angka)
}

const parseRupiah = (value: string) => {
  return parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
};

const RupiahInput = React.forwardRef<HTMLInputElement, RupiahInputProps>(
  ({ className, icon, onChange, onValueChange, loading, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const formatted = formatRupiah(parseRupiah(rawValue));
      const numeric = parseRupiah(rawValue);

      setDisplayValue(formatted);

      if (onValueChange) {
        onValueChange(numeric);
      }

      if (onChange) {
        onChange(e);
      }
    };

    return (
      <>
        <div className="relative w-full">
          <Input
            ref={ref}
            type="text"
            value={displayValue}
            onChange={handleChange}
            icon={icon}
            className={cn("text-right", className)}
            {...props}
          />

          {loading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </>
    );
  }
);

RupiahInput.displayName = "RupiahInput";

export { RupiahInput };
