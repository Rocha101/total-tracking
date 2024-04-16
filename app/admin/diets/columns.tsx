import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots } from "react-icons/tb";
import api from "@/app/utils/api";
import { toast } from "sonner";
import Diet from "./diets";
import { useMutation, useQueryClient } from "react-query";

const DietRowActions = ({ dietId }: { dietId: string }) => {
  const queryClient = useQueryClient();

  const deleteDiet = (id: string) => {
    return api.delete(`/diet/${id}`);
  };

  const deleteMutation = useMutation(deleteDiet, {
    onSuccess: () => {
      toast("Dieta excluída com sucesso!");
      queryClient.invalidateQueries("diets");
    },
    onError: (error) => {
      console.error(error);
      toast("Erro ao excluir dieta");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(dietId);
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
          Excluir dieta
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href={`/admin/diets/${dietId}`}
            className=" pointer-events-none"
          >
            Editar dieta
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Diet>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Descrição",
    accessorKey: "description",
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
    cell: ({ row }) => <DietRowActions dietId={row.original.id} />,
  },
];
