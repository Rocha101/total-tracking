import { ColumnDef } from "@tanstack/react-table";
import { Exercise } from "./exercise";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots } from "react-icons/tb";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import api from "@/app/utils/api";

enum SetType {
  WARM_UP = "WARM_UP",
  WORKING = "WORKING",
  FEEDER = "FEEDER",
  TOP = "TOP",
  BACK_OFF = "BACK_OFF",
}

import { useMutation, useQueryClient } from "react-query";

const ExerciseRowActions = ({ exerciseId }: { exerciseId: string }) => {
  const queryClient = useQueryClient();

  const deleteExercise = (id: string) => {
    return api.delete(`/exercise/${id}`);
  };

  const deleteMutation = useMutation(deleteExercise, {
    onSuccess: () => {
      toast("Exercício excluído com sucesso!");
      queryClient.invalidateQueries("exercises");
    },
    onError: (error) => {
      console.error(error);
      toast("Erro ao excluir exercício");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(exerciseId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <TbDots className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDelete}>
          Excluir exercício
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href={`/admin/clients/edit/${exerciseId}`}
            className=" pointer-events-none"
          >
            Editar exercício
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Exercise>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Descrição",
    accessorKey: "description",
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
