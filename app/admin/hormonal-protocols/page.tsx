"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { HormonalProtocol } from "./hormonal-protocols";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HormonalProtocolPage = () => {
  const [rows, setRows] = useState<HormonalProtocol[]>([]);

  useEffect(() => {
    api
      .get("/hormoneProtocol")
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
      <PageHeader title="Protocolos Hormonais" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link href="/admin/hormonal-protocols/new" passHref>
            <Button size="sm">Novo Protocolo</Button>
          </Link>
        }
      />
    </div>
  );
};

export default HormonalProtocolPage;
