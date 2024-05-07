import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots, TbEdit, TbEye, TbTrash } from "react-icons/tb";
import api from "@/app/utils/api";
import { toast } from "sonner";
import Diet from "./diets";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { useState } from "react";

const DietRowActions = ({ dietId }: { dietId: string }) => {
  "use client";
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const deleteDiet = (id: string) => {
    return api.delete(`/diet/${id}`);
  };

  const deleteMutation = useMutation(deleteDiet, {
    onSuccess: () => {
      toast.success("Dieta excluída com sucesso!");
      queryClient.invalidateQueries("diets");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao excluir dieta");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(dietId);
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
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <TbTrash className="h-4 w-4 mr-2" />
            Excluir dieta
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/diets/edit/${dietId}`)}
          >
            <TbEdit className="h-4 w-4 mr-2" />
            Editar dieta
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/diets/view/${dietId}`)}
          >
            <TbEye className="h-4 w-4 mr-2" />
            Ver dieta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        title="Excluir dieta"
        content="Tem certeza que deseja excluir esta dieta?"
        onConfirm={handleDelete}
        open={open}
        onOpenChange={() => setOpen(false)}
        loading={deleteMutation.isLoading}
      />
    </>
  );
};

export const columns: ColumnDef<Diet>[] = [
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
