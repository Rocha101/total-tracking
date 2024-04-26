"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import Hormone from "./hormones";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";

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
          <Link className="w-full md:w-32" href="/admin/hormones/new" passHref>
            <Button className="w-full md:w-32">Novo Hormônio</Button>
          </Link>
        }
        isLoading={isLoading}
        onDoubleClick={(row) => router.push(`/admin/hormones/edit/${row.id}`)}
      />
    </div>
  );
};

export default HormonesPage;
