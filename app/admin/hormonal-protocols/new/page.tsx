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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { TbCaretUpDownFilled, TbCheck, TbTrashFilled } from "react-icons/tb";
import { ScrollArea } from "@/components/ui/scroll-area";
import Hormone from "../../hormones/hormones";
import NewHormoneDialog from "@/components/dialogs/new-hormone";
import { useMutation, useQuery } from "react-query";
import { cn } from "@/lib/utils";

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
  const [openSelectHormone, setOpenSelectHormone] = useState(false);

  const handleOpenChangeNewHormone = () => {
    setOpenNewHormone(false);
  };

  const createCompoundMutation = useMutation(
    (values: Zod.infer<typeof hormonalProtocolSchema>) =>
      api.post("/hormoneProtocol", values),
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

    createCompoundMutation.mutate(hormoneProtocol);
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

  const addTrainExercise = (hormoneId: string) => {
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

  console.log(hormones);

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
            <Popover
              open={openSelectHormone}
              onOpenChange={setOpenSelectHormone}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="button"
                  className="w-[200px] justify-between"
                >
                  Selecione o Hormônio
                  <TbCaretUpDownFilled className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Buscar hormônio..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>Nenhum Hormônio Encontrado</CommandEmpty>
                    <CommandGroup>
                      <CommandItem onSelect={() => setOpenNewHormone(true)}>
                        Criar Hormônio
                      </CommandItem>
                      {hormones.length > 0 &&
                        hormones.map((hormone) => (
                          <CommandItem
                            key={hormone.id}
                            value={hormone.id}
                            onSelect={(currentValue) =>
                              addTrainExercise(currentValue)
                            }
                          >
                            <TbCheck
                              className={cn(
                                "h-4 w-4 mr-2",
                                protocolHormones.find(
                                  (item) => item.id === hormone.id
                                )
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {hormone.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

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
          <div className="w-full flex justify-end">
            <Button type="submit" className="w-full">
              Criar
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
