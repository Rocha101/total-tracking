"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import Hormone from "./hormones";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";

const HormonesPage = () => {
  const { isLoading, data } = useQuery("hormones", async () => {
    const res = await api.get<Hormone[]>("/hormone");
    return res.data;
  });
  const rows = data || [];
  return (
    <div>
      <PageHeader title="Hormônios" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link href="/admin/hormones/new" passHref>
            <Button>Novo Hormônio</Button>
          </Link>
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default HormonesPage;
