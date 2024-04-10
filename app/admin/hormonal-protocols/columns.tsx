import { ColumnDef } from "@tanstack/react-table";
import { HormonalProtocol } from "./hormonal-protocols";
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

const deleteProtocol = (id: string) => {
  api
    .delete(`/hormoneProtocol/${id}`)
    .then((response) => {
      console.log(response.data);
      toast("Protocolo excluído com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
      console.error(error);
    });
};

export const columns: ColumnDef<HormonalProtocol>[] = [
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
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <TbDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              deleteProtocol(row.original.id);
            }}
          >
            Excluir protocolo
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/admin/diets/${row.original.id}`}
              className=" pointer-events-none"
            >
              Editar protocolo
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
