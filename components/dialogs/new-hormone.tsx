import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewHormoneForm from "../forms/new-hormone";

interface NewHormoneDialogProps {
  open: boolean;
  onOpenChange: () => void;
}

const NewHormoneDialog = ({ open, onOpenChange }: NewHormoneDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Hormônio</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar um novo hormônio.
          </DialogDescription>
        </DialogHeader>
        <NewHormoneForm onSubmitOk={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

export default NewHormoneDialog;
