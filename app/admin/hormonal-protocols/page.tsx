"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { HormonalProtocol } from "./hormonal-protocols";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";

const HormonalProtocolPage = () => {
  const { isLoading, data } = useQuery("hormonalProtocols", async () => {
    const res = await api.get<HormonalProtocol[]>("/hormoneProtocol");
    return res.data;
  });
  const rows = data || [];
  return (
    <div>
      <PageHeader title="Protocolos Hormonais" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link
            className="w-full md:w-32"
            href="/admin/hormonal-protocols/new"
            passHref
          >
            <Button className="w-full md:w-32">Novo Protocolo</Button>
          </Link>
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default HormonalProtocolPage;
