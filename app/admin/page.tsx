"use client";

import PageHeader from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="h-full">
      <PageHeader
        title="Seja bem-vindo ao painel de administração"
        description="Aqui você pode acompanhar as metricas dos seus protocolos e clientes"
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
        <Card>
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Acompanhe a quantidade de clientes cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">10</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protocolos</CardTitle>
            <CardDescription>
              Acompanhe a quantidade de protocolos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">10</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protocolos em andamento</CardTitle>
            <CardDescription>
              Acompanhe a quantidade de protocolos em andamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">10</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protocolos finalizados</CardTitle>
            <CardDescription>
              Acompanhe a quantidade de protocolos finalizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">10</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
