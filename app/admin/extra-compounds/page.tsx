"use client";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ExtraCompounds from "./extra-compounds";
import { useQuery } from "react-query";

const ExtraCompoundsPage = () => {
  const { isLoading, data } = useQuery("extraCompounds", async () => {
    const res = await api.get<ExtraCompounds[]>("/extraCompound");
    return res.data;
  });
  const rows = data || [];
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
          <Link
            className="w-full md:w-32"
            href="/admin/extra-compounds/new"
            passHref
          >
            <Button className="w-full">Novo Composto</Button>
          </Link>
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default ExtraCompoundsPage;
