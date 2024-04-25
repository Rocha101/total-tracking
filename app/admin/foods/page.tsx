"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";

const FoodsPage = () => {
  const router = useRouter();
  const { isLoading, data: rows = [] } = useQuery("foods", async () => {
    const res = await api.get<Food[]>("/food");
    return res.data;
  });
  return (
    <div>
      <PageHeader title="Alimentos" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link className="w-full md:w-32" href="/admin/foods/new" passHref>
            <Button className="w-full">Novo Alimento</Button>
          </Link>
        }
        isLoading={isLoading}
        onDoubleClick={(row) => router.push(`/admin/foods/edit/${row.id}`)}
      />
    </div>
  );
};

export default FoodsPage;
