"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import Hormone from "./hormones";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { TbCirclePlus } from "react-icons/tb";

const HormonesPage = () => {
  const router = useRouter();
  const { isLoading, data: rows = [] } = useQuery("hormones", async () => {
    const res = await api.get<Hormone[]>("/hormone");
    return res.data;
  });
  return (
    <div>
      <PageHeader title="Hormônios" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Button
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/hormones/new")}
          >
            <TbCirclePlus className="h-4 w-4 mr-2" />
            Novo Hormônio
          </Button>
        }
        isLoading={isLoading}
        onDoubleClick={(row) => router.push(`/admin/hormones/edit/${row.id}`)}
      />
    </div>
  );
};

export default HormonesPage;
