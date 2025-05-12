import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type OptionNumber = { label: string; value: number };
type OptionString = { label: string; value: string };

type SelectFilterProps =
  | {
      label: string;
      id: string;
      value: number;
      optionsNumber: OptionNumber[];
      onChange: (value: number) => void;
      placeholder?: string;
      className?: string;
      labelClassName?: string;
      optionsString?: never;
    }
  | {
      label: string;
      id: string;
      value: string;
      optionsString: OptionString[];
      onChange: (value: string) => void;
      placeholder?: string;
      className?: string;
      labelClassName?: string;
      optionsNumber?: never;
    };

export const SelectFilter = ({
  label,
  id,
  value,
  optionsNumber,
  optionsString,
  placeholder = "Pilih salah satu",
  onChange,
  className = "",
  labelClassName = "",
}: SelectFilterProps) => {
  const options = optionsNumber
    ? optionsNumber.map((opt) => ({ label: opt.label, value: opt.value.toString() }))
    : optionsString!.map((opt) => ({ label: opt.label, value: opt.value }));

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <Label htmlFor={id} className={`w-1/2 font-semibold ${labelClassName}`}>
        {label}
      </Label>
      <Select
        value={value.toString()}
        onValueChange={(val) => {
          if (optionsNumber) {
            onChange(Number(val));
          } else {
            onChange(val);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
