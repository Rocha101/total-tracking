import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewHormoneForm from "../forms/new-hormone";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

interface NewHormoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewHormoneDialog = ({ open, onOpenChange }: NewHormoneDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] max-w-[95vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Hormônio</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar um novo hormônio.
            </DialogDescription>
          </DialogHeader>
          <NewHormoneForm onSubmitOk={() => onOpenChange(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Novo Hormônio</DrawerTitle>
          <DrawerDescription>
            Preencha os campos abaixo para adicionar um novo hormônio.
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[30rem] overflow-auto  pt-0 p-4">
          <NewHormoneForm onSubmitOk={() => onOpenChange(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NewHormoneDialog;
