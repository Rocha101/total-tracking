"use client";

import PageHeader from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "react-query";
import api from "../utils/api";
import { TbLoader2 } from "react-icons/tb";

const Dashboard = () => {
  const { isLoading: ClientsLoading, data: ClientsCount } = useQuery(
    "clientsCount",
    async () => {
      const res = await api.get("/account/clientsCountNumber");
      console.log(res);
      return res.data;
    }
  );

  const { isLoading: ProtocolsLoading, data: ProtocolsCount } = useQuery(
    "protocolsCount",
    async () => {
      const res = await api.get("/protocol/countNumber");
      console.log(res);
      return res.data;
    }
  );

  console.log(ClientsCount, ProtocolsCount);

  return (
    <div className="h-full">
      <PageHeader
        title="Seja bem-vindo ao painel de administração"
        description="Aqui você pode acompanhar as metricas dos seus protocolos e clientes"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <Card className="flex p-6 items-center justify-between">
          <div className="flex flex-col space-y-2">
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Quantidade de clientes cadastrados
            </CardDescription>
          </div>
          <div className="text-4xl font-bold">
            {ClientsLoading ? (
              <TbLoader2 className="h-10 w-10 animate-spin" />
            ) : (
              ClientsCount
            )}
          </div>
        </Card>

        <Card className="flex p-6 items-center justify-between">
          <div className="flex flex-col space-y-2">
            <CardTitle>Protocolos</CardTitle>
            <CardDescription>
              Quantidade de protocolos cadastrados
            </CardDescription>
          </div>
          <div className="text-4xl font-bold">
            {ProtocolsLoading ? (
              <TbLoader2 className="h-10 w-10 animate-spin" />
            ) : (
              ProtocolsCount
            )}
          </div>
        </Card>

        {/*  <Card>
          <CardHeader>
            <CardTitle>Protocolos em andamento</CardTitle>
            <CardDescription>
              Acompanhe a quantidade de protocolos em andamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">10</div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Dashboard;
