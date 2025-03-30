import { Button } from "../../../ui-components/src/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../ui-components/src/components/ui/dialog"
import { Input } from "../../../ui-components/src/components/ui/input"
import { Label } from "../../../ui-components/src/components/ui/label"
import { api } from "../../../utils/apiClient";

interface ModalProfileProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user?: {
        fullname: string;
        username: string;
        role: string;
        branch: string;
    } | null;
}

export function ModalProfile({ isOpen, onOpenChange, user }: ModalProfileProps) {
    const handleLogout = async () => {
        try {
            localStorage.removeItem("access_token"); 
            window.location.href = "/login";
            await api.post("/auth/logout", {});
        } catch (error) {
            console.error("Logout gagal:", error);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Profil Pengguna
                    </DialogTitle>
                    <DialogDescription>
                        Informasi pengguna yang sedang login.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="name" className="w-1/4">Name</Label>
                        <div id="name" className="w-full bg-lightColor dark:bg-darkColor shadow-main py-2 px-3 rounded-xl text-sm">
                            {user?.fullname || ""}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="username" className="w-1/4">Username</Label>
                        <div id="username" className="w-full bg-lightColor dark:bg-darkColor shadow-main py-2 px-3 rounded-xl text-sm">
                            {user?.username || ""}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="role" className="w-1/4">Akses</Label>
                        <div id="role" className="w-full bg-lightColor dark:bg-darkColor shadow-main py-2 px-3 rounded-xl text-sm">
                            {user?.role || ""}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="branch" className="w-1/4">Cabang</Label>
                        <div id="branch" className="w-full bg-lightColor dark:bg-darkColor shadow-main py-2 px-3 rounded-xl text-sm">
                            {user?.branch || ""}
                        </div>
                    </div>
                    
                </div>
                <DialogFooter>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
