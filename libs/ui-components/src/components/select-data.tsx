import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"

const options = [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
]

export const SelectData = () => {
    return (
        <Select>
            <SelectTrigger className="w-fit">
                <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
                {options.map((el, idx) => (
                    <SelectItem key={idx} value={el.value} >{el.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}