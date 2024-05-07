import React, { SetStateAction } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { TbCheck, TbLoader2, TbX } from "react-icons/tb";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ConfirmationDialogProps {
  onConfirm: () => void;
  title: string;
  content: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{content}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button onClick={() => onOpenChange(false)} variant="destructive">
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
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{content}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
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
          <Button onClick={() => onOpenChange(false)} variant="destructive">
            <TbX className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ConfirmationDialog;
