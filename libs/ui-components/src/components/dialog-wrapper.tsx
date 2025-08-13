"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "libs/ui-components/src/components/ui/dialog";

interface DialogWrapperProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  headItem?: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
  hideCloseButton?: boolean;
}

export const DialogWrapper = ({
  open,
  onOpenChange = () => { },
  title,
  description,
  children,
  headItem,
  className = "max-w-[40rem] w-full overflow-hidden",
  hideHeader = false,
  hideCloseButton = false,
}: DialogWrapperProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${hideCloseButton ? "[&>button]:hidden" : ""} ${className}`}>
        {!hideHeader && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
            {headItem && headItem}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};
