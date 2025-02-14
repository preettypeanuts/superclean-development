import { BsThreeDotsVertical } from "react-icons/bs"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function DropdownTable() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="rotate-90" variant={"ghost"} size={"icon"}>
                    <BsThreeDotsVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Export details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Delete user
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
