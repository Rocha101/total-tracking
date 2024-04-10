"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Protocol } from "./columns";
import { columns } from "./columns";
import api from "@/app/utils/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";

const ProtocolPage = () => {
  const [rows, setRows] = useState<Protocol[]>([]);

  useEffect(() => {
    api
      .get("/protocol")
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
      <PageHeader title="Protocolos" />
      <div className="w-full flex items-center justify-end">
        <Link href="/admin/protocols/new" passHref>
          <Button>Novo Protocolo</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={rows} />
    </div>
  );
};

export default ProtocolPage;
