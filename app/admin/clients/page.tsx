"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { Account } from "../exercises/exercise";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import ReferralLink from "@/components/referral-link";

const ClientPage = () => {
  const router = useRouter();

  const { isLoading, data: rows = [] } = useQuery("clients", async () => {
    const res = await api.get<Account[]>("/account/clients");

    return res.data;
  });

  return (
    <div>
      <PageHeader title="Clientes" />
      <DataTable
        columns={columns}
        data={rows}
        onDoubleClick={(row) =>
          router.push(`/admin/clients/protocol/${row.id}`)
        }
        isLoading={isLoading}
        actions={<ReferralLink />}
      />
    </div>
  );
};

export default ClientPage;
