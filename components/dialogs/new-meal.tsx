import MealForm from "../forms/new-meal";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

interface NewMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewMealDialog = ({ open, onOpenChange }: NewMealDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] md:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Refeição</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar uma nova refeição.
            </DialogDescription>
          </DialogHeader>
          <MealForm onSubmitOk={() => onOpenChange(false)} isDialog />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nova Refeição</DrawerTitle>
          <DrawerDescription>
            Preencha os campos abaixo para adicionar uma nova refeição.
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[80vh] overflow-auto pt-0 p-4">
          <MealForm onSubmitOk={() => onOpenChange(false)} isDialog />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NewMealDialog;
