"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TbDeviceFloppy, TbLoader2 } from "react-icons/tb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { TbPlus } from "react-icons/tb";
import { Protocol } from "../../columns";
import Diet from "@/app/admin/diets/diets";
import { Train } from "@/app/admin/trains/train";
import { HormonalProtocol } from "@/app/admin/hormonal-protocols/hormonal-protocols";
import MultipleSelect from "@/components/multiple-select";
import ExtraCompounds from "@/app/admin/extra-compounds/extra-compounds";
import { Account } from "@/app/admin/exercises/exercise";
import SingleSelect from "@/components/single-select";

const protocolSchema = object({
  name: string({
    required_error: "Nome é obrigatório",
  }),
  description: string().optional(),
  diet: string().optional(),
  train: string().array().optional(),
  hormonalProtocol: string().optional(),
  clientId: string().optional(),
  extraCompound: string().optional(),
});

const EditProtocolPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const protocolId = params.id;
  const form = useForm<Zod.infer<typeof protocolSchema>>({
    resolver: zodResolver(protocolSchema),
    defaultValues: {},
  });

  const updateProtocolMutation = useMutation(
    (values: Zod.infer<typeof protocolSchema>) =>
      api.put(`/protocol/${protocolId}`, values),
    {
      onSuccess: (res) => {
        toast.success("Protocolo atualizado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao atualizar Protocolo!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof protocolSchema>) => {
    const protocol = {
      ...values,
      train: trainsSelected.map((train) => train.id),
    };

    updateProtocolMutation.mutate(protocol);
  };

  const { data: protocol } = useQuery({
    queryKey: ["protocol", { protocolId }],
    queryFn: async () => {
      const response = await api.get<Protocol>(`/protocol/${protocolId}`);
      return response.data;
    },
    enabled: !!protocolId,
  });

  const { data: diets = [] } = useQuery({
    queryKey: ["diets"],
    queryFn: async () => {
      const response = await api.get<Diet[]>(`/diet`);
      return response.data;
    },
  });

  const { data: trains = [] } = useQuery({
    queryKey: ["trains"],
    queryFn: async () => {
      const response = await api.get<Train[]>(`/train`);
      return response.data;
    },
  });

  const { data: hormonalProtocols = [] } = useQuery({
    queryKey: ["hormonalProtocols"],
    queryFn: async () => {
      const response = await api.get<HormonalProtocol[]>(`/hormoneProtocol`);
      return response.data;
    },
  });

  const { data: extraCompounds = [] } = useQuery({
    queryKey: ["extraCompounds"],
    queryFn: async () => {
      const response = await api.get<ExtraCompounds[]>(`/extraCompound`);
      return response.data;
    },
  });

  const { data: clientsData = [] } = useQuery("clients", async () => {
    const res = await api.get<Account[]>("/account/clients");
    return res.data;
  });

  const [trainsSelected, setTrainsSelected] = useState<Train[]>([]);
  const [extraCompoundsSelected, setExtraCompoundsSelected] = useState<
    ExtraCompounds[]
  >([]);

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

  const addExtraCompoundSelected = (extraCompoundId: string) => {
    const extraCompound = extraCompounds.find(
      (item: ExtraCompounds) => item.id === extraCompoundId
    );
    const alreadyExistsIndex = extraCompoundsSelected.findIndex(
      (item) => item.id === extraCompoundId
    );

    if (!extraCompound) return;

    if (alreadyExistsIndex !== -1) {
      setExtraCompoundsSelected((prev) => [
        ...prev.slice(0, alreadyExistsIndex),
        ...prev.slice(alreadyExistsIndex + 1),
      ]);
    } else setExtraCompoundsSelected((prev) => [...prev, extraCompound]);
  };

  useEffect(() => {
    const fetchEditData = async () => {
      if (protocol) {
        if (protocol.name) form.setValue("name", protocol.name);
        if (protocol.description)
          form.setValue("description", protocol.description);
        if (protocol.diets) form.setValue("diet", protocol.diets[0]?.id);
        if (protocol.hormonalProtocols)
          form.setValue("hormonalProtocol", protocol.hormonalProtocols[0]?.id);
        if (protocol.clientId) form.setValue("clientId", protocol.clientId);

        if (protocol.trains.length > 0) {
          const trainIds = protocol.trains.map((train) => train.id);
          const trainsSelected = trains.filter((train) =>
            trainIds.includes(train.id)
          );
          setTrainsSelected(trainsSelected);
        }

        if (protocol.extraCompounds.length > 0) {
          const extraCompoundIds = protocol.extraCompounds.map(
            (extraCompound) => extraCompound.id
          );
          const extraCompoundsSelected = extraCompounds.filter(
            (extraCompound) => extraCompoundIds.includes(extraCompound.id)
          );
          setExtraCompoundsSelected(extraCompoundsSelected);
        }
      }
    };

    fetchEditData();
  }, [protocol, form, trains, extraCompounds]);

  useEffect(() => {
    if (clientId) {
      form.setValue("clientId", clientId);
    }
  }, [clientId, form]);

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-2">
            <PageHeader title="Atualizar Protocolo" backlink />
            <Button type="submit">
              {updateProtocolMutation.isLoading ? (
                <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
              ) : (
                <TbDeviceFloppy className="h-4 w-4 mr-2" />
              )}
              {updateProtocolMutation.isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
          <Card className="">
            <CardHeader>
              <CardTitle>Detalhes do protolo</CardTitle>
              <CardDescription>Informações básicas do protolo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
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
              {!clientId && (
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <SingleSelect
                        options={clientsData}
                        selectedOption={
                          clientsData?.find(
                            (client) => client.id === field.value
                          ) || undefined
                        }
                        handleSelect={(itemId) => field.onChange(itemId)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="diet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dieta</FormLabel>
                    <div className="flex">
                      <SingleSelect
                        options={diets}
                        selectedOption={
                          diets.find((diet) => diet.id === field.value) ||
                          undefined
                        }
                        handleSelect={(itemId) => field.onChange(itemId)}
                        add
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-tl-none rounded-bl-none border-l-0"
                        onClick={() => router.push("/admin/diets/new")}
                      >
                        <TbPlus className="h-4 w-4" />
                      </Button>
                    </div>
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
                    <div className="flex">
                      <SingleSelect
                        options={hormonalProtocols}
                        selectedOption={
                          hormonalProtocols.find(
                            (hormonalProtocol) =>
                              hormonalProtocol.id === field.value
                          ) || undefined
                        }
                        handleSelect={(itemId) => field.onChange(itemId)}
                        add
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-tl-none rounded-bl-none border-l-0"
                        onClick={() =>
                          router.push("/admin/hormonal-protocols/new")
                        }
                      >
                        <TbPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="flex flex-col  gap-1">
                <FormLabel>Treinos</FormLabel>
                <div className="flex">
                  <MultipleSelect
                    options={trains}
                    selectedOptions={trainsSelected}
                    handleSelect={addTrainSelected}
                    add
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-tl-none rounded-bl-none border-l-0"
                    onClick={() => router.push("/admin/trains/new")}
                  >
                    <TbPlus className="h-4 w-4" />
                  </Button>
                </div>
              </FormItem>
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Outros Compostos</FormLabel>
                <div className="flex">
                  <MultipleSelect
                    options={extraCompounds}
                    selectedOptions={extraCompoundsSelected}
                    handleSelect={addExtraCompoundSelected}
                    add
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-tl-none rounded-bl-none border-l-0"
                    onClick={() => router.push("/admin/extra-compounds/new")}
                  >
                    <TbPlus className="h-4 w-4" />
                  </Button>
                </div>
              </FormItem>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default EditProtocolPage;
