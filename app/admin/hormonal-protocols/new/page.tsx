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
import { TbDeviceFloppy, TbLoader2, TbPlus } from "react-icons/tb";
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
import { object, string } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useState } from "react";
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
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-2">
            <PageHeader title="Novo Protocolo Hormonal" backlink />
            <Button type="submit">
              {createHormonalProtocolMutation.isLoading ? (
                <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
              ) : (
                <TbDeviceFloppy className="h-4 w-4 mr-2" />
              )}
              {createHormonalProtocolMutation.isLoading
                ? "Salvando..."
                : "Salvar"}
            </Button>
          </div>

          <Card className="">
            <CardHeader>
              <CardTitle>Detalhes do protocolo hormonal</CardTitle>
              <CardDescription>
                Informações básicas do protocolo hormonal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
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
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <CardTitle>Hormônios do protocolo</CardTitle>
              <CardDescription>
                Selecione os hormônios que compõem o protocolo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
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
                  {protocolHormones.length === 0 && (
                    <div className="min-h-[200px] h-full col-span-1 sm:col-span-2 md:col-span-4 border border-dashed rounded-md flex flex-col items-center justify-center">
                      <p className="text-lg text-muted-foreground">
                        Nenhum hormônio selecionado
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
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
