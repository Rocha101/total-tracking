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

const protocolSchema = object({
  name: string(),
  description: string().optional(),
  diet: string().optional(),
  train: string().optional(),
  hormonalProtocol: string().optional(),
  clientId: string().optional(),
  extraCompound: string().optional(),
});

const NewProtocolPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const form = useForm<Zod.infer<typeof protocolSchema>>({
    resolver: zodResolver(protocolSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const [diets, setDiets] = useState<Diet[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [hormonalProtocols, setHormonalProtocols] = useState<
    HormonalProtocol[]
  >([]);

  const onSubmit = (values: Zod.infer<typeof protocolSchema>) => {
    console.log(values);

    api
      .post("/protocol", values)
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

  const fetchDiets = () => {
    api
      .get("/diet")
      .then((response) => {
        console.log(response);
        setDiets(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
      });
  };

  const fetchTrains = () => {
    api
      .get("/train")
      .then((response) => {
        console.log(response);
        setTrains(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
      });
  };

  const fetchHormonalProtocols = () => {
    api
      .get("/hormoneProtocol")
      .then((response) => {
        console.log(response);
        setHormonalProtocols(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
      });
  };

  useEffect(() => {
    fetchDiets();
    fetchTrains();
    fetchHormonalProtocols();
  }, []);

  useEffect(() => {
    if (clientId) {
      form.setValue("clientId", clientId);
    }
  }, [clientId, form]);

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
            name="train"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treino</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <Link href="/admin/trains/new">
                      <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        Novo Treino
                      </div>
                    </Link>
                    {trains.map((train) => (
                      <SelectItem key={train.id} value={train.id}>
                        {train.name}
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

          <Button type="submit" className="w-full">
            Criar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewProtocolPage;
