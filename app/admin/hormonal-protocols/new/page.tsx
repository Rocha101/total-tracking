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
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { TbTrashFilled } from "react-icons/tb";
import { ScrollArea } from "@/components/ui/scroll-area";
import Hormone from "../../hormones/hormones";
import NewHormoneDialog from "@/components/dialogs/new-hormone";

const hormonalProtocolSchema = object({
  name: string(),
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
      name: "",
      description: "",
      hormones: [],
    },
  });

  const [hormones, setHormones] = useState<Hormone[]>([]);
  const [openNewHormone, setOpenNewHormone] = useState(false);

  const handleOpenChangeNewHormone = () => {
    setOpenNewHormone(false);
    fetchHormones();
  };

  const onSubmit = (values: Zod.infer<typeof hormonalProtocolSchema>) => {
    console.log(values);

    const hormoneProtocol = {
      ...values,
      hormones: protocolHormones.map((hormone) => hormone.id),
    };

    api
      .post("/hormoneProtocol", hormoneProtocol)
      .then((res) => {
        console.log(res);
        toast("Protocolo criado com sucesso!");
        router.back();
      })
      .catch((err) => {
        console.log(err);
        toast("Erro ao criar Protocolo!");
      });
  };

  const fetchHormones = async () => {
    api
      .get("/hormone")
      .then((response) => {
        console.log(response);
        setHormones(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
      });
  };

  useEffect(() => {
    fetchHormones();
  }, []);

  const [protocolHormones, setProtocolHormones] = useState<Hormone[]>([]);

  const addTrainExercise = (hormoneId: string) => {
    const hormone = hormones.find((item: Hormone) => item.id === hormoneId);
    const alreadyExists = protocolHormones.filter(
      (item) => item.id === hormoneId
    );
    if (alreadyExists && alreadyExists.length > 0) return;
    if (!hormone) return;
    setProtocolHormones((prev) => [...prev, hormone]);
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
                  <Input placeholder="Protocolo Hormonal" {...field} />
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
                  <Input placeholder="Semana 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-sm">
            Selecione os hormônios que compõem o protocolo
          </div>
          <div className="h-full flex flex-col gap-3">
            <Select
              value="Adicionar Hormônio"
              onValueChange={(value: string) => addTrainExercise(value)}
            >
              <SelectTrigger>
                <SelectValue>Adicionar Hormônio</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <div
                  onClick={() => setOpenNewHormone(true)}
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  Novo Hormônio
                </div>
                {hormones.map((hormone: Hormone) => (
                  <SelectItem key={hormone.id} value={hormone.id}>
                    {hormone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ScrollArea className="w-full h-64">
              <div className="w-full flex flex-col gap-4 py-1">
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
            </ScrollArea>
          </div>

          <Button type="submit" className="w-full">
            Criar
          </Button>
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
