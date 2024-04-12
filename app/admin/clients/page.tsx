"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { Account } from "../exercises/exercise";
import { useRouter } from "next/navigation";

const ClientPage = () => {
  const router = useRouter();
  const [rows, setRows] = useState<Account[]>([]);

  useEffect(() => {
    api
      .get("/account/clients")
      .then((response) => {
        console.log(response);
        setRows(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
      });
  }, []);
  return (
    <div>
      <PageHeader title="Clientes" />
      <DataTable
        columns={columns}
        data={rows}
        onDoubleClick={(row) =>
          router.push(`/admin/clients/protocol?clientId=${row.id}`)
        }
      />
    </div>
  );
};

export default ClientPage;
