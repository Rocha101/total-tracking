"use client";

import { useState } from "react";
import PageHeader from "@/components/page-header";
import api from "@/app/utils/api";
import ProtocolCards from "@/components/protocol-cards";
import { useAuth } from "@/context/auth";
import { useQuery } from "react-query";
import { Protocol } from "@/app/admin/protocols/columns";
import ExtraCompounds from "@/app/admin/extra-compounds/extra-compounds";
import { HormonalProtocol } from "@/app/admin/hormonal-protocols/hormonal-protocols";
import Diet from "@/app/admin/diets/diets";
import { Train } from "@/app/admin/trains/train";
import { TbLoader2 } from "react-icons/tb";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { account } = useAuth();
  const clientId = account?.account.id;
  const [trainWeekDay, setTrainWeekDay] = useState<WeekDay>(
    () => WeekDay.MONDAY
  );

  const { isLoading: protocolLoading, data: protocolData } = useQuery({
    queryKey: ["protocol", { clientId }],
    queryFn: async () => {
      const response = await api.get<Protocol>(`/protocol/clients/${clientId}`);

      return response.data;
    },
    enabled: !!clientId,
  });

  const protocol = protocolData;
  const protocolId = protocolData ? protocolData.id : null;

  const { isLoading: extraCompoundLoading, data: extraCompoundData } = useQuery(
    {
      queryKey: ["extraCompound", { protocolId: protocolId }],
      queryFn: async () => {
        const response = await api.get<ExtraCompounds[]>(
          `/extraCompound/protocol/${protocolId}`
        );
        return response.data;
      },
      enabled: !!protocolId,
    }
  );

  const extraCompounds = extraCompoundData || [];

  const { isLoading: hormoneProtocolLoading, data: hormonalProtocolData } =
    useQuery({
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

  const { isLoading: dietLoading, data: dietData } = useQuery({
    queryKey: ["diet", { protocolId: protocolId }],
    queryFn: async () => {
      const response = await api.get<Diet[]>(`/diet/protocol/${protocolId}`);
      return response.data[0];
    },
    enabled: !!protocolId,
  });

  const diet = dietData;

  const { isLoading: trainLoading, data: trainData } = useQuery({
    queryKey: ["train", { protocolId: protocolId }],
    queryFn: async () => {
      const response = await api.get<Train[]>(`/train/protocol/${protocolId}`);
      return response.data;
    },
    enabled: !!protocolId,
  });

  const train = trainData || [];

  const loading =
    protocolLoading ||
    extraCompoundLoading ||
    hormoneProtocolLoading ||
    dietLoading ||
    trainLoading;

  return (
    <div className="h-full">
      <PageHeader title={`Protocolo ${account?.account.name || ""}`} />

      <ProtocolCards
        protocol={protocol}
        diet={diet}
        train={train}
        hormonalProtocol={hormonalProtocol}
        extraCompounds={extraCompounds}
        trainWeekDay={trainWeekDay}
        setTrainWeekDay={setTrainWeekDay}
        loading={loading}
      />
    </div>
  );
};

export default ClientProtocol;
