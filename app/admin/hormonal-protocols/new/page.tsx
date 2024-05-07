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
import { useState } from "react";
import { TbPlus } from "react-icons/tb";
import { ScrollArea } from "@/components/ui/scroll-area";
import Hormone from "../../hormones/hormones";
import NewHormoneDialog from "@/components/dialogs/new-hormone";
import { useMutation, useQuery } from "react-query";
import MultipleSelect from "@/components/multiple-select";
import { Label } from "@/components/ui/label";
import HormoneCard from "@/components/hormone-card";

const hormonalProtocolSchema = object({
  name: string({
    required_error: "Nome é obrigatório",
  }),
  description: string().optional(),
  protocolId: string().optional(),
  accountId: string().optional(),
  hormones: string().array(),
});

const NewHormonalProtocolPage = () => {
  const router = useRouter();
  const form = useForm<Zod.infer<typeof hormonalProtocolSchema>>({
    resolver: zodResolver(hormonalProtocolSchema),
    defaultValues: {
      hormones: [],
    },
  });
  const [openNewHormone, setOpenNewHormone] = useState(false);

  const handleOpenChangeNewHormone = () => {
    setOpenNewHormone(false);
  };

  const createHormonalProtocolMutation = useMutation(
    (values: Zod.infer<typeof hormonalProtocolSchema>) =>
      api.post("/hormoneProtocol", values),
    {
      onSuccess: (res) => {
        toast.success("Protocolo criado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao criar Protocolo!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof hormonalProtocolSchema>) => {
    const hormoneProtocol = {
      ...values,
      hormones: protocolHormones.map((hormone) => hormone.id),
    };

    createHormonalProtocolMutation.mutate(hormoneProtocol);
  };

  const { isLoading: isLoadingHormones, data: hormonesData } = useQuery(
    "hormones",
    async () => {
      const res = await api.get<Hormone[]>("/hormone");
      return res.data;
    }
  );
  const hormones = hormonesData || [];

  const [protocolHormones, setProtocolHormones] = useState<Hormone[]>([]);

  const addHormone = (hormoneId: string) => {
    const hormone = hormones.find((item: Hormone) => item.id === hormoneId);
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

  return (
    <div>
      <PageHeader title="Novo Protocolo Hormonal" backlink />
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
                    <HormoneCard
                      key={hormone.id}
                      hormone={hormone}
                      handleRemove={removeProtocolHormone}
                    />
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          <div className="w-full flex justify-end">
            <Button type="submit" className="w-full">
              {createHormonalProtocolMutation.isLoading
                ? "Criando..."
                : "Criar"}
            </Button>
          </div>
        </form>
      </Form>
      <NewHormoneDialog
        open={openNewHormone}
        onOpenChange={(open) => setOpenNewHormone(open)}
      />
    </div>
  );
};

export default NewHormonalProtocolPage;
