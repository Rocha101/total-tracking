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
      <div className="w-full flex items-center justify-end">
        <Link href="/admin/hormonal-protocols/new" passHref>
          <Button>Novo Hormônio</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={rows} />
    </div>
  );
};

export default HormonalProtocolPage;
