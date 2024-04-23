"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Protocol } from "./columns";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ProtocolPage = () => {
  const router = useRouter();
  const { isLoading, data } = useQuery("protocols", async () => {
    const res = await api.get<Protocol[]>("/protocol");
    return res.data;
  });
  const rows = data || [];
  return (
    <div>
      <PageHeader title="Protocolos" />
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        onDoubleClick={(row) =>
          router.push(`/admin/protocols/view?protocolId=${row.id}`)
        }
        actions={
          <Button onClick={() => router.push("/admin/protocols/new")}>
            Novo Protocolo
          </Button>
        }
      />
    </div>
  );
};

export default ProtocolPage;
