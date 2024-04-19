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
import { useEffect, useState } from "react";
import Link from "next/link";
import Diet from "../../diets/diets";
import { Train } from "../../trains/train";
import { HormonalProtocol } from "../../hormonal-protocols/hormonal-protocols";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "react-query";
import { TbTrashFilled } from "react-icons/tb";
import ExtraCompounds from "../../extra-compounds/extra-compounds";
import MultipleSelect from "@/components/multiple-select";

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

  const trains = trainsData || [];

  const { data: hormonalProtocolsData } = useQuery({
    queryKey: ["hormonalProtocols"],
    queryFn: async () => {
      const response = await api.get<HormonalProtocol[]>(`/hormoneProtocol`);
      return response.data;
    },
  });

  const hormonalProtocols = hormonalProtocolsData || [];

  const { data: extraCompoundsData } = useQuery({
    queryKey: ["extraCompounds"],
    queryFn: async () => {
      const response = await api.get<ExtraCompounds[]>(`/extraCompound`);
      return response.data;
    },
  });

  const extraCompounds = extraCompoundsData || [];

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

  useEffect(() => {
    console.log(trainsSelected);
  }, [trainsSelected]);

  const weekDays = [
    WeekDay.MONDAY,
    WeekDay.TUESDAY,
    WeekDay.WEDNESDAY,
    WeekDay.THURSDAY,
    WeekDay.FRIDAY,
    WeekDay.SATURDAY,
    WeekDay.SUNDAY,
  ];

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
                Adicionar Treino
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
                onClick={() => router.push("/admin/trains/new")}
              >
                Adicionar Composto
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
