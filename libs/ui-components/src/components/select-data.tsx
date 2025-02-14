import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"


export const SelectData = () => {
    return (
        <Select>
            <SelectTrigger className="w-fit">
                <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="10" >10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
            </SelectContent>
        </Select>
    )
}