import FoodForm from "../forms/new-food";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NewFoodDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

const NewFoodDialog = ({ open, onOpenChange }: NewFoodDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]  max-w-[95vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Refeição</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar uma nova refeição.
          </DialogDescription>
        </DialogHeader>
        <FoodForm onSubmitOk={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

export default NewFoodDialog;
