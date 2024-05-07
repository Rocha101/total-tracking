import { ColumnDef } from "@tanstack/react-table";
import { Exercise } from "./exercise";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TbDots, TbEdit, TbTrash } from "react-icons/tb";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import api from "@/app/utils/api";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { useState } from "react";

enum SetType {
  WARM_UP = "WARM_UP",
  WORKING = "WORKING",
  FEEDER = "FEEDER",
  TOP = "TOP",
  BACK_OFF = "BACK_OFF",
}

const ExerciseRowActions = ({ exerciseId }: { exerciseId: string }) => {
  "use client";
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const deleteExercise = (id: string) => {
    return api.delete(`/exercise/${id}`);
  };

  const deleteMutation = useMutation(deleteExercise, {
    onSuccess: () => {
      toast.success("Exercício excluído com sucesso!");
      queryClient.invalidateQueries("exercises");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Erro ao excluir exercício");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(exerciseId);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <TbDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/admin/exercises/edit/${exerciseId}`)}
          >
            <TbEdit className="h-4 w-4 mr-2" />
            Editar exercício
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <TbTrash className="h-4 w-4 mr-2" />
            Excluir exercício
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        title="Excluir exercício"
        content="Tem certeza que deseja excluir este exercício ?"
        onConfirm={handleDelete}
        open={open}
        onOpenChange={(open) => setOpen(open)}
        loading={deleteMutation.isLoading}
      />
    </>
  );
};

export const columns: ColumnDef<Exercise>[] = [
  {
    header: "Nome",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex flex-col items-start">
        <span>{row.original.name}</span>
        <span className="text-xs text-gray-400">
          {row.original.description}
        </span>
      </div>
    ),
  },
  {
    header: "Séries",
    accessorKey: "sets",
    cell: ({ row }) => {
      const reps = row.original.sets.map((set) => {
        const reps = set.reps;
        return reps.map((rep) => {
          return `${
            {
              [SetType.WARM_UP]: "Aquecimento",
              [SetType.WORKING]: "Trabalho",
              [SetType.FEEDER]: "Feeder",
              [SetType.TOP]: "Top",
              [SetType.BACK_OFF]: "Back off",
            }[rep.setType] || ""
          }${rep.setType ? " - " : ""}${rep.quantity} x ${rep.weight}Kg`;
        });
      });

      return (
        <div className="flex flex-col items-start py-2">
          {reps.map((rep, index) => (
            <span key={index}>
              {index + 1}ª Série: {rep.join(" ")}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    header: "Data de Criação",
    accessorKey: "createdAt",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("pt-BR"),
  },
  {
    header: "Data de Atualização",
    accessorKey: "updatedAt",
    cell: ({ row }) =>
      new Date(row.original.updatedAt).toLocaleDateString("pt-BR"),
  },
  {
    header: "Ações",
    cell: ({ row }) => <ExerciseRowActions exerciseId={row.original.id} />,
  },
];
