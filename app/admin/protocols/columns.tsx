import { ColumnDef } from "@tanstack/react-table";

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
];
