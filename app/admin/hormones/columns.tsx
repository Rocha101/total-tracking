import { ColumnDef } from "@tanstack/react-table";
import Hormone from "./hormones";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots } from "react-icons/tb";
import api from "@/app/utils/api";
import { toast } from "sonner";

import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";

const HormoneActionRows = ({ hormoneId }: { hormoneId: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteHormone = (id: string) => {
    return api.delete(`/hormone/${id}`);
  };

  const deleteMutation = useMutation(deleteHormone, {
    onSuccess: () => {
      toast("Hormônio excluído com sucesso!");
      queryClient.invalidateQueries("hormones");
    },
    onError: (error) => {
      console.error(error);
      toast("Erro ao excluir hormônio");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(hormoneId);
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
          Excluir hormônio
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/hormones/edit/${hormoneId}`)}
        >
          Editar hormônio
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Hormone>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Descrição",
    accessorKey: "description",
  },
  {
    header: "Quantidade",
    accessorKey: "quantity",
    cell: ({ row }) => `${row.original.quantity} ${row.original.unit}`,
  },
  {
    header: "Concentração",
    accessorKey: "concentration",
    cell: ({ row }) =>
      `${row.original.concentration || ""} ${
        row.original.concentrationUnit
          ? row.original.concentrationUnit?.split("_")?.join("/")
          : ""
      }`,
  },
  {
    header: "Tipo",
    accessorKey: "hormoneType",
    cell: ({ row }) =>
      `${
        {
          NINETEEN_NOR: "19-Nor",
          DHT: "DHT",
          TESTOSTERONE: "Testosterona",
          PEPTIDE: "Peptídeo",
          INSULIN: "Insulina",
          TIREOID: "Tireoide",
        }[row.original.hormoneType]
      }`,
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
    cell: ({ row }) => <HormoneActionRows hormoneId={row.original.id} />,
  },
];
