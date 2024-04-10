import {
  Account,
  Exercise,
  HormonalProtocol,
  Hormone,
  Meal,
  Protocol,
  Train,
} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<HormonalProtocol>[] = [
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
