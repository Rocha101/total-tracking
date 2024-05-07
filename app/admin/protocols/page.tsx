"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Protocol } from "./columns";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TbCirclePlus } from "react-icons/tb";

const ProtocolPage = () => {
  const router = useRouter();
  const { isLoading, data: rows = [] } = useQuery("protocols", async () => {
    const res = await api.get<Protocol[]>("/protocol");
    return res.data;
  });
  return (
    <div>
      <PageHeader title="Protocolos" />
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        onDoubleClick={(row) => router.push(`/admin/protocols/view/${row.id}`)}
        actions={
          <Button
            className="w-full sm:w-auto"
            onClick={() => router.push("/admin/protocols/new")}
          >
            <TbCirclePlus className="h-4 w-4 mr-2" />
            Novo Protocolo
          </Button>
        }
      />
    </div>
  );
};

export default ProtocolPage;
