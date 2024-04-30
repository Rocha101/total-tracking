import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface ConfirmationDialogProps {
  onConfirm: () => void;
  title: string;
  content: string;
  open: boolean;
  onOpenChange: () => void;
  loading?: boolean;
}

const ConfirmationDialog = ({
  onConfirm,
  title,
  content,
  open,
  onOpenChange,
  loading,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{content}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button onClick={onOpenChange} variant="destructive">
            Cancelar
          </Button>
          <Button onClick={onConfirm}>
            {loading ? "Confirmando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
