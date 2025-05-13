"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@ui-components/components/ui/dialog";
import { Button } from "@ui-components/components/ui/button";
import { IoMdSave } from "react-icons/io";

interface ConfirmSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  icon?: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
}

export function ConfirmSaveDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = "Apakah Anda yakin ingin menyimpan data?",
  icon = <IoMdSave />,
  cancelLabel = "Batal",
  confirmLabel = "Simpan",
}: ConfirmSaveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex items-center justify-center">
          <div className="text-5xl p-3 bg-secondaryColor text-secondaryColorDark rounded-lg my-5">
            {icon}
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
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
            variant="main"
            className="w-1/2"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Menyimpan..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
