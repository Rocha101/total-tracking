import NewExerciseForm from "../forms/new-exercise";
import FoodForm from "../forms/new-food";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NewExerciseDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

const NewExerciseDialog = ({ open, onOpenChange }: NewExerciseDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Exercício</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar um novo exercício.
          </DialogDescription>
        </DialogHeader>
        <NewExerciseForm />
      </DialogContent>
    </Dialog>
  );
};

export default NewExerciseDialog;
