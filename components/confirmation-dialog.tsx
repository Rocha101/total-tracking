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
import { Separator } from "./ui/separator";
import { TbCheck, TbLoader2, TbX } from "react-icons/tb";

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
            <TbX className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-green-700 hover:bg-green-800"
          >
            {loading ? (
              <TbLoader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TbCheck className="h-4 w-4 mr-2" />
            )}

            {loading ? "Confirmando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
