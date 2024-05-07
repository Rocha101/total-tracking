"use client";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import ExtraCompounds from "./extra-compounds";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { TbCirclePlus } from "react-icons/tb";

const ExtraCompoundsPage = () => {
  const router = useRouter();
  const { isLoading, data: rows = [] } = useQuery(
    "extraCompounds",
    async () => {
      const res = await api.get<ExtraCompounds[]>("/extraCompound");
      return res.data;
    }
  );
  return (
    <div>
      <PageHeader
        title="Outros Compostos"
        description="Aqui você pode gerenciar vitaminas, suplementos e outros compostos em geral"
      />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Button
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/extra-compounds/new")}
          >
            <TbCirclePlus className="h-4 w-4 mr-2" />
            Novo Composto
          </Button>
        }
        isLoading={isLoading}
        onDoubleClick={(row) =>
          router.push(`/admin/extra-compounds/edit/${row.id}`)
        }
      />
    </div>
  );
};

export default ExtraCompoundsPage;
