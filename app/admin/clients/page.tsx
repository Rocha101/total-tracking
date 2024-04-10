"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Account } from "@prisma/client";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";

const ClientPage = () => {
  const [rows, setRows] = useState<Account[]>([]);

  useEffect(() => {
    api
      .get("/account")
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
      <DataTable columns={columns} data={rows} />
    </div>
  );
};

export default ClientPage;
