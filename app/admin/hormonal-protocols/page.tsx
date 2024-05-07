"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { HormonalProtocol } from "./hormonal-protocols";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { TbCirclePlus } from "react-icons/tb";

const HormonalProtocolPage = () => {
  const router = useRouter();
  const { isLoading, data: rows = [] } = useQuery(
    "hormonalProtocols",
    async () => {
      const res = await api.get<HormonalProtocol[]>("/hormoneProtocol");
      return res.data;
    }
  );
  return (
    <div>
      <PageHeader title="Protocolos Hormonais" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Button
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/hormonal-protocols/new")}
          >
            <TbCirclePlus className="h-4 w-4 mr-2" />
            Novo Protocolo
          </Button>
        }
        onDoubleClick={(row) =>
          router.push(`/admin/hormonal-protocols/view/${row.id}`)
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default HormonalProtocolPage;
