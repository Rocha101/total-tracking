import { Account, Protocol } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Account>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
];
