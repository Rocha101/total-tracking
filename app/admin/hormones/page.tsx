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
      <div className="w-full flex items-center justify-end">
        <Link href="/admin/hormones/new" passHref>
          <Button>Novo Hormônio</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={rows} />
    </div>
  );
};

export default HormonesPage;
