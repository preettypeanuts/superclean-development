import * as React from "react";
import { Input } from "./ui/input"; // pastikan path-nya sesuai
import { cn } from '../utils';
import { formatRupiah } from "../../../utils/formatRupiah";

interface RupiahInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  onValueChange?: (value: number) => void; // callback untuk nilai aslinya (angka)
}

const parseRupiah = (value: string) => {
  return parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
};

const RupiahInput = React.forwardRef<HTMLInputElement, RupiahInputProps>(
  ({ className, icon, onChange, onValueChange, ...props }, ref) => {
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
      <Input
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        icon={icon}
        className={cn(className)}
        {...props}
      />
    );
  }
);

RupiahInput.displayName = "RupiahInput";

export { RupiahInput };
