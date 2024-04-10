"use client";

import { DataTable } from "@/components/data-table/data-table";
import { HormonalProtocol } from "@prisma/client";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";

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
      <DataTable columns={columns} data={rows} />
    </div>
  );
};

export default HormonalProtocolPage;
