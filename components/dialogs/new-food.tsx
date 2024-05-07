import FoodForm from "../forms/new-food";

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

interface NewFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewFoodDialog = ({ open, onOpenChange }: NewFoodDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]  max-w-[95vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Alimento</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar um novo alimento.
            </DialogDescription>
          </DialogHeader>
          <FoodForm onSubmitOk={() => onOpenChange(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Novo Alimento</DrawerTitle>
          <DrawerDescription>
            Preencha os campos abaixo para adicionar um novo alimento.
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[30rem] overflow-auto  pt-0 p-4">
          <FoodForm onSubmitOk={() => onOpenChange(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NewFoodDialog;
