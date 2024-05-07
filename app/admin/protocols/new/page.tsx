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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number, enum as enumValidator, infer } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useEffect, useState } from "react";
import Link from "next/link";
import Diet from "../../diets/diets";
import { Train } from "../../trains/train";
import { HormonalProtocol } from "../../hormonal-protocols/hormonal-protocols";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "react-query";
import { TbPlus, TbTrashFilled } from "react-icons/tb";
import ExtraCompounds from "../../extra-compounds/extra-compounds";
import MultipleSelect from "@/components/multiple-select";
import { Account } from "../../exercises/exercise";

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
  name: string({
    required_error: "Nome é obrigatório",
  }),
  description: string().optional(),
  diet: string().optional(),
  train: string().array().optional(),
  hormonalProtocol: string().optional(),
  clientId: string().optional(),
  extraCompound: string().array().optional(),
});

const NewProtocolPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const form = useForm<Zod.infer<typeof protocolSchema>>({
    resolver: zodResolver(protocolSchema),
    defaultValues: {},
  });
  const [openTrainSelect, setOpenTrainSelect] = useState(false);
  const [openExtraCompoundSelect, setOpenExtraCompoundSelect] = useState(false);

  const createProtocolMutation = useMutation(
    (values: Zod.infer<typeof protocolSchema>) => api.post("/protocol", values),
    {
      onSuccess: (res) => {
        console.log(res);
        toast("Protocolo criado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast("Erro ao criar Protocolo!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof protocolSchema>) => {
    const protocol = {
      ...values,
      train: trainsSelected.map((train) => train.id),
      extraCompound: extraCompoundsSelected.map(
        (extraCompound) => extraCompound.id
      ),
    };

    createProtocolMutation.mutate(protocol);
  };

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

  useEffect(() => {
    if (clientId) {
      form.setValue("clientId", clientId);
    }
  }, [clientId, form]);

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

  return (
    <div>
      <PageHeader title="Novo Protocolo" backlink />
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
          {!clientId && (
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientsData.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-tr-none rounded-br-none">
                        <SelectValue placeholder="Selecione um item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {diets.map((diet) => (
                        <SelectItem key={diet.id} value={diet.id}>
                          {diet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-tr-none rounded-br-none">
                        <SelectValue placeholder="Selecione um item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-tl-none rounded-bl-none border-l-0"
                    onClick={() => router.push("/admin/hormonal-protocols/new")}
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
                open={openTrainSelect}
                onOpenChange={setOpenTrainSelect}
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
                open={openExtraCompoundSelect}
                onOpenChange={setOpenExtraCompoundSelect}
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

          <Button type="submit" className="w-full">
            {createProtocolMutation.isLoading ? "Criando..." : "Criar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewProtocolPage;
