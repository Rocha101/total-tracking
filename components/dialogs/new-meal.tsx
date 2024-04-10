import MealForm from "../forms/new-meal";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NewMealDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

const NewMealDialog = ({ open, onOpenChange }: NewMealDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Refeição</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar uma nova refeição.
          </DialogDescription>
        </DialogHeader>
        <MealForm onSubmitOk={onOpenChange} isDialog />
      </DialogContent>
    </Dialog>
  );
};

export default NewMealDialog;
