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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TbPlus, TbTrashFilled } from "react-icons/tb";
import { ScrollArea } from "@/components/ui/scroll-area";
import Hormone from "../../../hormones/hormones";
import NewHormoneDialog from "@/components/dialogs/new-hormone";
import { useMutation, useQuery } from "react-query";
import MultipleSelect from "@/components/multiple-select";
import { Label } from "@/components/ui/label";
import { HormonalProtocol } from "../../hormonal-protocols";

const hormonalProtocolSchema = object({
  name: string({
    required_error: "Nome é obrigatório",
  }),
  description: string().optional(),
  protocolId: string().optional(),
  accountId: string().optional(),
  hormones: string().array(),
});

const NewHormonalProtocolPage = ({ params }: { params: { id: string } }) => {
  const hormonalProtocolId = params.id;
  const router = useRouter();
  const form = useForm<Zod.infer<typeof hormonalProtocolSchema>>({
    resolver: zodResolver(hormonalProtocolSchema),
    defaultValues: {
      hormones: [],
    },
  });
  const [openNewHormone, setOpenNewHormone] = useState(false);
  const [openSelectHormone, setOpenSelectHormone] = useState(false);

  const handleOpenChangeNewHormone = () => {
    setOpenNewHormone(false);
  };

  const updateHormonalProtocolMutation = useMutation(
    (values: Zod.infer<typeof hormonalProtocolSchema>) =>
      api.put(`/hormoneProtocol/${hormonalProtocolId}`, values),
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

  const onSubmit = (values: Zod.infer<typeof hormonalProtocolSchema>) => {
    const hormoneProtocol = {
      ...values,
      hormones: protocolHormones.map((hormone) => hormone.id),
    };

    updateHormonalProtocolMutation.mutate(hormoneProtocol);
  };

  const { isLoading: isLoadingHormones, data: hormones = [] } = useQuery(
    "hormones",
    async () => {
      const res = await api.get<Hormone[]>("/hormone");
      return res.data;
    }
  );

  const [protocolHormones, setProtocolHormones] = useState<Hormone[]>([]);

  const addHormone = (hormoneId: string) => {
    const hormone = hormones?.find((item: Hormone) => item.id === hormoneId);
    const alreadyExistsIndex = protocolHormones.findIndex(
      (item) => item.id === hormoneId
    );

    if (!hormone) return;
    if (alreadyExistsIndex !== -1) {
      setProtocolHormones((prev) => [
        ...prev.slice(0, alreadyExistsIndex),
        ...prev.slice(alreadyExistsIndex + 1),
      ]);
    } else {
      setProtocolHormones((prev) => [...prev, hormone]);
    }
  };

  const removeProtocolHormone = (hormoneId: string) => {
    setProtocolHormones(
      protocolHormones.filter((item) => item.id !== hormoneId)
    );
  };

  const { data: hormonalProtocol } = useQuery(
    ["hormonalProtocol", hormonalProtocolId],
    async () => {
      const res = await api.get<HormonalProtocol>(
        `/hormoneProtocol/${hormonalProtocolId}`
      );
      return res.data;
    },
    {
      enabled: !!hormonalProtocolId,
    }
  );

  useEffect(() => {
    if (hormonalProtocol) {
      form.reset({
        name: hormonalProtocol?.name || "",
        description: hormonalProtocol?.description || "",
        hormones: hormonalProtocol.hormones.map((hormone) => hormone.id),
      });

      setProtocolHormones(hormonalProtocol.hormones);
    }
  }, [form, hormonalProtocol]);

  return (
    <div>
      <PageHeader title="Editar Protocolo Hormonal" backlink />
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
                  <Input
                    placeholder="Nome do protocolo Ex.: Bulking"
                    {...field}
                  />
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
                  <Input placeholder="Ex.: Semana 1-3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Label>Selecione os hormônios que compõem o protocolo</Label>
          <div className="h-full flex flex-col gap-3">
            <div className="flex">
              <MultipleSelect
                open={openSelectHormone}
                onOpenChange={setOpenSelectHormone}
                options={hormones}
                selectedOptions={protocolHormones}
                handleSelect={addHormone}
                add
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-tl-none rounded-bl-none border-l-0"
                onClick={() => setOpenNewHormone(true)}
              >
                <TbPlus className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="w-full h-full">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-1">
                {protocolHormones.map((hormone: Hormone) => {
                  return (
                    <Card key={hormone.id} className="relative">
                      <CardHeader className="w-full flex flex-row justify-between items-start">
                        <CardTitle>{hormone.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="flex flex-col gap-2">
                          <span>{hormone.description}</span>
                          <span>{`${hormone.quantity} ${hormone.unit}`}</span>
                          <span>
                            {`${hormone.concentration || ""}${
                              hormone.concentrationUnit
                                ? hormone.concentrationUnit
                                    ?.split("_")
                                    ?.join("/")
                                : ""
                            }
                            `}
                          </span>
                        </CardDescription>
                      </CardContent>

                      <Button
                        type="button"
                        onClick={() => removeProtocolHormone(hormone.id)}
                        variant="destructive"
                        size="icon"
                        className="absolute top-1/2 transform -translate-y-1/2 right-8"
                      >
                        <TbTrashFilled />
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          <div className="w-full flex justify-end">
            <Button type="submit" className="w-full">
              {updateHormonalProtocolMutation.isLoading
                ? "Salvando..."
                : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
      <NewHormoneDialog
        open={openNewHormone}
        onOpenChange={handleOpenChangeNewHormone}
      />
    </div>
  );
};

export default NewHormonalProtocolPage;
