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
import { toast } from "sonner";
import api from "@/app/utils/api";
import { HormonalProtocol } from "../hormonal-protocols/hormonal-protocols";
import Diet from "../diets/diets";
import { Train } from "../trains/train";
import ExtraCompounds from "../extra-compounds/extra-compounds";

const deleteProtocol = (id: string) => {
  api
    .delete(`/protocol/${id}`)
    .then((response) => {
      console.log(response.data);
      toast("Protocolo excluída com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
      console.error(error);
    });
};

export type Protocol = {
  id: string;
  name: string;
  description: string;
  client: string;
  account: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  hormonalProtocols: HormonalProtocol[];
  diets: Diet[];
  trains: Train[];
  extraCompounds: ExtraCompounds[];
};

export const columns: ColumnDef<Protocol>[] = [
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
