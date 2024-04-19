"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import { Meal } from "./meals";
import { useQuery } from "react-query";

const MealPage = () => {
  const { isLoading, data } = useQuery("meals", async () => {
    const res = await api.get<Meal[]>("/meal");
    return res.data;
  });
  const rows = data || [];

  return (
    <div>
      <PageHeader title="Refeições" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link className="w-full md:w-32" href="/admin/meals/new" passHref>
            <Button className="w-full md:w-32">Nova Refeição</Button>
          </Link>
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default MealPage;
