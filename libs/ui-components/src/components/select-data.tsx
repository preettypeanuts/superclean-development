import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const options = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

interface SelectDataProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export const SelectData = ({ label, value, onChange }: SelectDataProps) => {
  return (
    <div className="flex gap-2 items-center">
      <Select onValueChange={(val) => onChange(Number(val))} value={String(value)}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="10">{value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((el, idx) => (
            <SelectItem key={idx} value={el.value}>
              {el.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label className="text-sm opacity-70">{label}</Label>
    </div>
  );
};
