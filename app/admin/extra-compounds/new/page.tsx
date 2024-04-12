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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useEffect, useState } from "react";
import Link from "next/link";

const extraCompoundSchema = object({
  name: string(),
  description: string().optional(),
  quantity: number(),
  concentration: number(),
  unit: enumValidator(["MG", "ML", "UI", "UNIT"]),
  concentrationUnit: enumValidator(["MG_ML", "MG"]).optional(),
  protocolId: string().optional(),
  accountId: string().optional(),
});

const NewExtraCompound = () => {
  const router = useRouter();
  const form = useForm<Zod.infer<typeof extraCompoundSchema>>({
    resolver: zodResolver(extraCompoundSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: 0,
      concentration: 0,
      unit: "MG",
    },
  });

  const onSubmit = (values: Zod.infer<typeof extraCompoundSchema>) => {
    console.log(values);
    const extraCompound = {
      ...values,
      concentrationUnit: getConcentrationUnit(),
    };

    api
      .post("/extraCompound", extraCompound)
      .then((res) => {
        console.log(res);
        toast("Composto criado com sucesso!");
        router.push("/admin/extra-compounds");
      })
      .catch((err) => {
        console.log(err);
        toast("Erro ao criar Composto!");
      });
  };

  const unitWatch = form.watch("unit");

  const getConcentrationUnit = () => {
    switch (unitWatch) {
      case "ML":
        return "MG_ML";
      case "UNIT":
        return "MG";
      default:
        return undefined;
    }
  };

  const concentrationUnit = getConcentrationUnit();

  return (
    <div>
      <PageHeader title="Novo Composto" backlink />
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
                  <Input placeholder="Vitamina K2" {...field} />
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
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(parseFloat(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MG">MG</SelectItem>
                        <SelectItem value="ML">ML</SelectItem>
                        <SelectItem value="UI">UI</SelectItem>
                        <SelectItem value="UNIT">UNIDADE</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {concentrationUnit && (
            <div className="flex">
              <FormField
                control={form.control}
                name="concentration"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Concentração</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(parseFloat(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Unidade</FormLabel>
                <FormControl>
                  <Input value={concentrationUnit} disabled />
                </FormControl>
              </FormItem>
            </div>
          )}

          <Button type="submit" className="w-full">
            Criar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewExtraCompound;
