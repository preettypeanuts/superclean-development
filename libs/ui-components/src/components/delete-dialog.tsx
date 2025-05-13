import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui-components/components/ui/dialog";
import { Button } from "@ui-components/components/ui/button";
import { IoMdTrash } from "react-icons/io";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  itemName?: string;
  icon?: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = "Apakah Anda yakin ingin menghapus item ini?",
  itemName = "item",
  icon = <IoMdTrash />,
  cancelLabel = "Batal",
  confirmLabel = "Hapus",
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex items-center justify-center">
          <div className="text-5xl p-3 bg-destructive/40 text-destructive-foreground dark:text-destructive rounded-lg my-5">
            {icon}
          </div>
          <DialogTitle className="text-center leading-snug">{title}</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2">
          <Button
            variant="outline2"
            className="w-1/2"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            className="w-1/2"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Menghapus..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
