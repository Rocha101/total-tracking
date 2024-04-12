"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import Hormone from "./hormones";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HormonesPage = () => {
  const [rows, setRows] = useState<Hormone[]>([]);

  useEffect(() => {
    api
      .get("/hormone")
      .then((response) => {
        console.log(response);
        setRows(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
      });
  }, []);
  return (
    <div>
      <PageHeader title="Hormônios" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link href="/admin/hormones/new" passHref>
            <Button size="sm">Novo Hormônio</Button>
          </Link>
        }
      />
    </div>
  );
};

export default HormonesPage;
