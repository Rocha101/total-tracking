"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import Diet from "./diets";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";

const DietPage = () => {
  const router = useRouter();
  const { isLoading, data } = useQuery("diets", async () => {
    const res = await api.get<Diet[]>("/diet");
    return res.data;
  });
  const rows = data || [];
  return (
    <div>
      <PageHeader title="Dietas" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link className="w-full md:w-32" href="/admin/diets/new" passHref>
            <Button className="w-full">Nova Dieta</Button>
          </Link>
        }
        isLoading={isLoading}
        onDoubleClick={(row) => {
          router.push(`/admin/diets/view/${row.id}`);
        }}
      />
    </div>
  );
};

export default DietPage;
