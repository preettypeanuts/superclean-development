import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

const defaultOptions = [10, 20, 50, 100];

interface SelectDataProps {
    label: string;
    totalData: number;
    currentLimit: number;
    onLimitChange: (value: string) => void;
}

export const SelectData = ({ label, totalData, currentLimit, onLimitChange }: SelectDataProps) => {
    // Filter limit agar tidak melebihi total data & batas maksimum 100
    const availableOptions = defaultOptions.filter(opt => opt <= Math.min(totalData, 100));

    // Pastikan limit terakhir adalah total data jika belum ada dalam opsi
    if (totalData <= 100 && !availableOptions.includes(totalData)) {
        availableOptions.push(totalData);
    }

    return (
        <div className="flex gap-2 items-center">
            <Select value={String(currentLimit)} onValueChange={onLimitChange}>
                <SelectTrigger className="w-fit">
                    <SelectValue placeholder={String(currentLimit)} />
                </SelectTrigger>
                <SelectContent>
                    {availableOptions.map((value, idx) => (
                        <SelectItem key={idx} value={String(value)}>
                            {value} {value === totalData ? "(Semua data)" : ""}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Label className="text-sm opacity-70">
                {label}
            </Label>
        </div>
    );
};