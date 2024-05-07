"use client";

import PageHeader from "@/components/page-header";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/app/utils/api";
import { useQuery } from "react-query";
import { HormonalProtocol } from "../../hormonal-protocols";
import { TbEdit, TbLoader2 } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getConcentrationUnit from "@/app/utils/getConcentrationUnit";
import getUnit from "@/app/utils/getUnit";
const ViewHormonalProtocol = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const hormonalProtocolId = params.id;
  const { isLoading: hormoneProtocolLoading, data: hormonalProtocol } =
    useQuery({
      queryKey: ["hormoneProtocol", { hormonalProtocolId }],
      queryFn: async () => {
        const response = await api.get<HormonalProtocol>(
          `/hormoneProtocol/${hormonalProtocolId}`
        );
        console.log(response.data);
        return response.data;
      },
      enabled: !!hormonalProtocolId,
    });

  if (hormoneProtocolLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <TbLoader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Protocolo Hormonal" backlink />

      <div className="flex flex-col gap-3">
        <div className="flex justify-end gap-3">
          <Link href={`/admin/hormonal-protocols/edit/${hormonalProtocolId}`}>
            <Button size="sm">
              <TbEdit className="mr-2" />
              Editar
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{hormonalProtocol?.name}</CardTitle>
            <CardDescription>{hormonalProtocol?.description}</CardDescription>
          </CardHeader>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">
          {hormonalProtocol?.hormones.map((hormone) => (
            <Card
              key={hormone.id}
              className="flex shadow-none border-l-4 border-l-primary"
            >
              <CardHeader className="w-full">
                <CardTitle>{hormone.name}</CardTitle>
                <CardDescription>{hormone.description}</CardDescription>
              </CardHeader>
              <CardContent className="w-full space-y-1.5 flex flex-col items-end justify-end pt-6">
                <p className="text-sm text-muted-foreground">
                  {hormone.quantity}{" "}
                  <span className="text-xs">{getUnit(hormone.unit)}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {hormone.concentration}{" "}
                  <span className="text-xs">
                    {getConcentrationUnit(hormone.concentrationUnit)}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewHormonalProtocol;
