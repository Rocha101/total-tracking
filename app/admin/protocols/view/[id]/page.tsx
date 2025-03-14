"use client";

import { useRef, useState } from "react";
import PageHeader from "@/components/page-header";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/app/utils/api";
import { Protocol } from "../../columns";
import Diet from "../../../diets/diets";
import { Train } from "../../../trains/train";
import { HormonalProtocol } from "../../../hormonal-protocols/hormonal-protocols";
import ExtraCompounds from "../../../extra-compounds/extra-compounds";
import { useAuth } from "@/context/auth";
import { useQuery } from "react-query";
import ProtocolCards from "@/components/protocol-cards";
import { TbEdit, TbLoader2 } from "react-icons/tb";
import { Button } from "@/components/ui/button";

enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

const ViewMoreProtocol = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const router = useRouter();
  const protocolId = params.id;
  const { account } = useAuth();
  const [trainWeekDay, setTrainWeekDay] = useState<WeekDay>(
    () => WeekDay.MONDAY
  );

  const { isLoading: protocolLoading, data: protocol } = useQuery({
    queryKey: ["protocol", { protocolId }],
    queryFn: async () => {
      const response = await api.get<Protocol>(`/protocol/${protocolId}`);
      return response.data;
    },
    enabled: !!protocolId,
  });

  const { isLoading: extraCompoundLoading, data: extraCompounds = [] } =
    useQuery({
      queryKey: ["extraCompound", { protocolId: protocolId }],
      queryFn: async () => {
        const response = await api.get<ExtraCompounds[]>(
          `/extraCompound/protocol/${protocolId}`
        );

        console.log(response.data);

        return response.data;
      },
      enabled: !!protocolId,
    });

  const { isLoading: hormoneProtocolLoading, data: hormonalProtocol } =
    useQuery({
      queryKey: ["hormoneProtocol", { protocolId: protocolId }],
      queryFn: async () => {
        const response = await api.get<HormonalProtocol[]>(
          `/hormoneProtocol/protocol/${protocolId}`
        );
        return response.data[0];
      },
      enabled: !!protocolId,
    });

  const { isLoading: dietLoading, data: diet } = useQuery({
    queryKey: ["diet", { protocolId: protocolId }],
    queryFn: async () => {
      const response = await api.get<Diet[]>(`/diet/protocol/${protocolId}`);
      return response.data[0];
    },
    enabled: !!protocolId,
  });

  const { isLoading: trainLoading, data: train = [] } = useQuery({
    queryKey: ["train", { protocolId: protocolId }],
    queryFn: async () => {
      const response = await api.get<Train[]>(`/train/protocol/${protocolId}`);
      return response.data;
    },
    enabled: !!protocolId,
  });

  const loading =
    protocolLoading ||
    extraCompoundLoading ||
    hormoneProtocolLoading ||
    dietLoading ||
    trainLoading;

  return (
    <div className="h-full">
      <PageHeader title={`Protocolo`} backlink />

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
            Atualizar
          </Button>
        }
        loading={loading}
      />
    </div>
  );
};

export default ViewMoreProtocol;
