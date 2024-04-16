"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number, enum as enumValidator, infer } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "react-query";
import { TbLoader2, TbTrashFilled } from "react-icons/tb";
import { useAuth } from "@/context/auth";
import { Protocol } from "../../columns";
import Diet from "@/app/admin/diets/diets";
import { Train } from "@/app/admin/trains/train";
import { HormonalProtocol } from "@/app/admin/hormonal-protocols/hormonal-protocols";

enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

const protocolSchema = object({
  name: string(),
  description: string().optional(),
  diet: string().optional(),
  train: string().array().optional(),
  hormonalProtocol: string().optional(),
  clientId: string().optional(),
  extraCompound: string().optional(),
});

const NewProtocolPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { account } = useAuth();
  const clientId = account?.account.id;
  const protocolId = params.id;
  const form = useForm<Zod.infer<typeof protocolSchema>>({
    resolver: zodResolver(protocolSchema),
    defaultValues: {},
  });
  const [loading, setLoading] = useState(true);

  const createProtocolMutation = useMutation(
    (values: Zod.infer<typeof protocolSchema>) =>
      api.put(`/protocol/${protocolId}`, values),
    {
      onSuccess: (res) => {
        console.log(res);
        toast("Protocolo atualizado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast("Erro ao atualizar Protocolo!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof protocolSchema>) => {
    const protocol = {
      ...values,
      train: trainsSelected.map((train) => train.id),
    };

    createProtocolMutation.mutate(protocol);
  };

  const { data: protocolData } = useQuery({
    queryKey: ["protocol", { protocolId }],
    queryFn: async () => {
      const response = await api.get<Protocol>(`/protocol/${protocolId}`);
      return response.data;
    },
    enabled: !!protocolId,
  });

  const protocol = protocolData;

  const { data: dietsData } = useQuery({
    queryKey: ["diets"],
    queryFn: async () => {
      const response = await api.get<Diet[]>(`/diet`);
      return response.data;
    },
  });

  const diets = dietsData || [];

  const { data: trainsData } = useQuery({
    queryKey: ["trains"],
    queryFn: async () => {
      const response = await api.get<Train[]>(`/train`);
      return response.data;
    },
  });

  const trains = useMemo(() => trainsData || [], [trainsData]);

  const { data: hormonalProtocolsData } = useQuery({
    queryKey: ["hormonalProtocols"],
    queryFn: async () => {
      const response = await api.get<HormonalProtocol[]>(`/hormoneProtocol`);
      return response.data;
    },
  });

  const hormonalProtocols = hormonalProtocolsData || [];

  const [trainsSelected, setTrainsSelected] = useState<Train[]>([]);

  const addTrainSelected = (trainId: string) => {
    const train = trains.find((item: Train) => item.id === trainId);
    const alreadyExistsIndex = trainsSelected.findIndex(
      (item) => item.id === trainId
    );

    if (!train) return;

    if (alreadyExistsIndex !== -1) {
      setTrainsSelected((prev) => [
        ...prev.slice(0, alreadyExistsIndex),
        ...prev.slice(alreadyExistsIndex + 1),
      ]);
    } else setTrainsSelected((prev) => [...prev, train]);
  };

  const removeTrainSelected = (trainId: string) => {
    setTrainsSelected(trainsSelected.filter((item) => item.id !== trainId));
  };

  const updateFormValues = async ({
    protocol,
    form,
    trains,
    setTrainsSelected,
  }: {
    protocol: Protocol | undefined;
    form: any;
    trains: Train[];
    setTrainsSelected: any;
  }) => {
    if (protocol) {
      console.log(protocol);

      form.reset({
        name: protocol.name,
        description: protocol.description,
        diet: protocol.diets[0]?.id,
        hormonalProtocol: protocol.hormonalProtocols[0]?.id,
        clientId: protocol.clientId,
      });

      const trainIds = protocol.trains.map((train) => train.id);
      const trainsSelected = trains.filter((train) =>
        trainIds.includes(train.id)
      );
      setTrainsSelected(trainsSelected);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await updateFormValues({ protocol, form, trains, setTrainsSelected });
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [protocol, form, trains, setTrainsSelected]);

  useEffect(() => {
    if (clientId) {
      form.setValue("clientId", clientId);
    }
  }, [clientId, form]);

  const weekDays = [
    WeekDay.MONDAY,
    WeekDay.TUESDAY,
    WeekDay.WEDNESDAY,
    WeekDay.THURSDAY,
    WeekDay.FRIDAY,
    WeekDay.SATURDAY,
    WeekDay.SUNDAY,
  ];

  if (loading) {
    return (
      <div className="w-full h-96 bg-card flex items-center justify-center">
        <TbLoader2 className="animate-spin h-10 w-10" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={`Editar Protocolo`} backlink />
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Emagrecimento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Seca tudo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dieta</FormLabel>

                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <Link href="/admin/diets/new">
                      <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        Nova Dieta
                      </div>
                    </Link>
                    {diets.map((diet) => (
                      <SelectItem key={diet.id} value={diet.id}>
                        {diet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hormonalProtocol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protocolo Hormonal</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <Link href="/admin/hormonal-protocols/new">
                      <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        Novo Protocolo Hormonal
                      </div>
                    </Link>
                    {hormonalProtocols.map((hormonalProtocol) => (
                      <SelectItem
                        key={hormonalProtocol.id}
                        value={hormonalProtocol.id}
                      >
                        {hormonalProtocol.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label>Adicionar Treinos</Label>
            <Select
              onValueChange={(value) => addTrainSelected(value)}
              value={"Adicionar treino"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <Link href="/admin/trains/new">
                  <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    Novo Treino
                  </div>
                </Link>
                {trains.map((train) => {
                  const weekDaysSelected = train.weekDays;

                  return (
                    <SelectItem
                      key={train.id}
                      value={train.id}
                      className="w-full h-full flex flex-row justify-between items-start"
                    >
                      <span>{train.name}</span>

                      <div className="flex mt-2">
                        {weekDays.map((day) => (
                          <Badge
                            key={day}
                            variant={
                              weekDaysSelected.includes(day)
                                ? "default"
                                : "secondary"
                            }
                            className="rounded-none text-[0.6rem]"
                          >
                            {
                              {
                                [WeekDay.MONDAY]: "S",
                                [WeekDay.TUESDAY]: "T",
                                [WeekDay.WEDNESDAY]: "Q",
                                [WeekDay.THURSDAY]: "Q",
                                [WeekDay.FRIDAY]: "S",
                                [WeekDay.SATURDAY]: "S",
                                [WeekDay.SUNDAY]: "D",
                              }[day as keyof typeof WeekDay]
                            }
                          </Badge>
                        ))}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Selecionados</Label>
            <div className="flex flex-wrap gap-2">
              {trainsSelected.map((train) => {
                const weekDaysSelected = train.weekDays;
                return (
                  <Card key={train.id} className="w-full relative">
                    <CardHeader className="w-full flex flex-row justify-between items-start">
                      <CardTitle>{train.name}</CardTitle>
                      <CardDescription>{train.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="flex flex-col gap-2">
                        <span>{train.description}</span>
                        <div className="flex mt-2">
                          {weekDays.map((day) => (
                            <Badge
                              key={day}
                              variant={
                                weekDaysSelected.includes(day)
                                  ? "default"
                                  : "secondary"
                              }
                              className="rounded-none text-[0.6rem]"
                            >
                              {
                                {
                                  [WeekDay.MONDAY]: "S",
                                  [WeekDay.TUESDAY]: "T",
                                  [WeekDay.WEDNESDAY]: "Q",
                                  [WeekDay.THURSDAY]: "Q",
                                  [WeekDay.FRIDAY]: "S",
                                  [WeekDay.SATURDAY]: "S",
                                  [WeekDay.SUNDAY]: "D",
                                }[day as keyof typeof WeekDay]
                              }
                            </Badge>
                          ))}
                        </div>
                      </CardDescription>
                    </CardContent>

                    <Button
                      type="button"
                      onClick={() => removeTrainSelected(train.id)}
                      variant="outline"
                      size="icon"
                      className="absolute top-1/2 transform -translate-y-1/2 right-8"
                    >
                      <TbTrashFilled />
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>

          <Button type="submit" className="w-full">
            {createProtocolMutation.isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewProtocolPage;
