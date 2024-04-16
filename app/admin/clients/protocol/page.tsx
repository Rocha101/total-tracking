"use client";

import { useState } from "react";
import PageHeader from "@/components/page-header";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/app/utils/api";
import { Protocol } from "../../protocols/columns";
import Diet from "../../diets/diets";
import { Train } from "../../trains/train";
import { HormonalProtocol } from "../../hormonal-protocols/hormonal-protocols";
import ExtraCompounds from "../../extra-compounds/extra-compounds";
import { useAuth } from "@/context/auth";
import { useQuery } from "react-query";
import ProtocolCards from "@/components/protocol-cards";
import { Button } from "@/components/ui/button";
import { TbEdit } from "react-icons/tb";

enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

const ClientProtocol = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const { account } = useAuth();
  const [trainWeekDay, setTrainWeekDay] = useState<WeekDay>(
    () => WeekDay.MONDAY
  );

  const { data: protocolData } = useQuery({
    queryKey: ["protocol", { clientId }],
    queryFn: async () => {
      const response = await api.get<Protocol>(`/protocol/clients/${clientId}`);
      return response.data;
    },
    enabled: !!clientId,
  });

  const protocol = protocolData;
  const protocolId = protocolData ? protocolData.id : null;

  const { data: extraCompoundData } = useQuery({
    queryKey: ["extraCompound", { protocolId: protocolId }],
    queryFn: async () => {
      const response = await api.get<ExtraCompounds[]>(
        `/extraCompound/protocol/${protocolId}`
      );
      return response.data;
    },
    enabled: !!protocolId,
  });

  const extraCompounds = extraCompoundData || [];

  const { data: hormonalProtocolData } = useQuery({
    queryKey: ["hormonalProtocol", { protocolId: protocolId }],
    queryFn: async () => {
      const response = await api.get<HormonalProtocol[]>(
        `/hormonalProtocol/protocol/${protocolId}`
      );
      return response.data[0];
    },
    enabled: !!protocolId,
  });

  const hormonalProtocol = hormonalProtocolData;

  const { data: dietData } = useQuery({
    queryKey: ["diet", { protocolId: protocolId }],
    queryFn: async () => {
      const response = await api.get<Diet[]>(`/diet/protocol/${protocolId}`);
      return response.data[0];
    },
    enabled: !!protocolId,
  });

  const diet = dietData;

  const { data: trainData } = useQuery({
    queryKey: ["train", { protocolId: protocolId }],
    queryFn: async () => {
      const response = await api.get<Train[]>(`/train/protocol/${protocolId}`);
      return response.data;
    },
    enabled: !!protocolId,
  });

  const train = trainData || [];

  return (
    <div className="h-full">
      <PageHeader title={`Protocolo ${account?.account.name || ""}`} backlink />
      <ProtocolCards
        protocol={protocol}
        diet={diet}
        train={train}
        hormonalProtocol={hormonalProtocol}
        extraCompounds={extraCompounds}
        trainWeekDay={trainWeekDay}
        setTrainWeekDay={setTrainWeekDay}
        extraActions={
          <Button
            size="sm"
            onClick={() => router.push(`/admin/protocols/edit/${protocol?.id}`)}
          >
            <TbEdit className="mr-2" />
            Editar
          </Button>
        }
      />
    </div>
  );
};

export default ClientProtocol;
