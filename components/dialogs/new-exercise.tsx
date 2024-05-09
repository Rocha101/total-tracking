import { useMediaQuery } from "@/hooks/use-media-query";
import NewExerciseForm from "../forms/new-exercise";

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

interface NewExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewExerciseDialog = ({ open, onOpenChange }: NewExerciseDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] md:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Exercício</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar um novo exercício.
            </DialogDescription>
          </DialogHeader>
          <NewExerciseForm onSubmitOk={() => onOpenChange(false)} isDialog />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Novo Exercício</DrawerTitle>
          <DrawerDescription>
            Preencha os campos abaixo para adicionar um novo exercício.
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[80vh] overflow-auto pt-0 p-4">
          <NewExerciseForm onSubmitOk={() => onOpenChange(false)} isDialog />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NewExerciseDialog;
