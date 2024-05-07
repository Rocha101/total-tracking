"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import api from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const subscriptionSchema = z.object({
  planId: z.string({
    required_error: "Plano obrigatório",
  }),
});

const planSchema = z.object({
  name: z.string({
    required_error: "Nome obrigatório",
  }),
  price: z.number({
    required_error: "Preço obrigatório",
  }),
  duration: z.number({
    required_error: "Duração obrigatória",
  }),
});

const SubscriptionsPage = () => {
  const clientQuery = useQueryClient();
  const subscriptionForm = useForm<Zod.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {},
  });

  const planForm = useForm<Zod.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {},
  });

  const { data: plansData } = useQuery("plans", async () => {
    const res = await api.get("/plan");

    return res.data;
  });

  const plans = plansData || [];

  const { data: subscriptionData } = useQuery("subscriptions", async () => {
    const res = await api.get("/subscription");

    return res.data;
  });

  const subscriptions = subscriptionData || [];

  const createSubscriptionMutation = useMutation(
    (values: Zod.infer<typeof subscriptionSchema>) =>
      api.post("/subscription", values),
    {
      onSuccess: (res) => {
        toast.success("Assinatura criada com sucesso!");
        clientQuery.invalidateQueries("subscriptions");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao criar Assinatura!");
      },
    }
  );

  const createPlanMutation = useMutation(
    (values: Zod.infer<typeof planSchema>) => api.post("/plan", values),
    {
      onSuccess: (res) => {
        toast.success("Plano criado com sucesso!");
        clientQuery.invalidateQueries("plans");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao criar Plano!");
      },
    }
  );

  const deletePlanMutation = useMutation(
    (id: string) => api.delete(`/plan/${id}`),
    {
      onSuccess: (res) => {
        toast.success("Plano deletado com sucesso!");
        clientQuery.invalidateQueries("plans");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao deletar Plano!");
      },
    }
  );

  const deleteSubscriptionMutation = useMutation(
    (id: string) => api.delete(`/subscription/${id}`),
    {
      onSuccess: (res) => {
        toast.success("Assinatura deletada com sucesso!");
        clientQuery.invalidateQueries("subscriptions");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao deletar Assinatura!");
      },
    }
  );

  const onSubmitPlan = (values: Zod.infer<typeof planSchema>) => {
    createPlanMutation.mutate(values);
  };

  const onSubmitSubscription = (
    values: Zod.infer<typeof subscriptionSchema>
  ) => {
    createSubscriptionMutation.mutate(values);
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      toast.info("ID copiado para a área de transferência");
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Tabs defaultValue="subscriptions" className="w-[90vw]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
        </TabsList>
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Assinaturas</CardTitle>
              <CardDescription>Crie uma nova assinatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...subscriptionForm}>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={subscriptionForm.handleSubmit(onSubmitSubscription)}
                >
                  <FormField
                    control={subscriptionForm.control}
                    name="planId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plano</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione um plano" />
                            </SelectTrigger>
                            <SelectContent>
                              {plansData?.map((plan: any) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                  {plan.name} - R${plan.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Criar Assinatura</Button>
                </form>
              </Form>
            </CardContent>
            <div className="h-64 border-t overflow-auto flex flex-col justify-start">
              <Tabs defaultValue="valid" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="valid">Validas</TabsTrigger>
                  <TabsTrigger value="expired">Expiradas</TabsTrigger>
                </TabsList>
                <TabsContent value="valid">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Cliente</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Duração</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions?.validSubscriptions?.map(
                        (subscription: any) => (
                          <TableRow key={subscription.id}>
                            <TableCell className="w-[50%]">
                              {subscription?.account?.name}
                            </TableCell>
                            <TableCell>{subscription.plan.name}</TableCell>
                            <TableCell>{subscription.plan.price}</TableCell>
                            <TableCell>{subscription.plan.duration}</TableCell>
                            <TableCell>
                              <Button onClick={() => copyId(subscription.id)}>
                                Copiar ID
                              </Button>
                              <Button
                                onClick={() =>
                                  deleteSubscriptionMutation.mutate(
                                    subscription.id
                                  )
                                }
                              >
                                Deletar
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="expired">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Cliente</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Duração</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions?.expiredSubscriptions?.map(
                        (subscription: any) => (
                          <TableRow key={subscription.id}>
                            <TableCell className="w-[50%]">
                              {subscription?.account?.name}
                            </TableCell>
                            <TableCell>{subscription.plan.name}</TableCell>
                            <TableCell>{subscription.plan.price}</TableCell>
                            <TableCell>{subscription.plan.duration}</TableCell>
                            <TableCell>
                              <Button onClick={() => copyId(subscription.id)}>
                                Copiar ID
                              </Button>
                              <Button
                                onClick={() =>
                                  deleteSubscriptionMutation.mutate(
                                    subscription.id
                                  )
                                }
                              >
                                Deletar
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Planos</CardTitle>
              <CardDescription>
                Crie um novo plano de assinatura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...planForm}>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={planForm.handleSubmit(onSubmitPlan)}
                >
                  <FormField
                    control={planForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Plano mensal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={planForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="99.99"
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
                    control={planForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duração (meses)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(parseInt(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Criar Plano</Button>
                </form>
              </Form>
            </CardContent>
            <div className="h-64 border-t overflow-auto flex flex-col justify-start">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Nome</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans?.map((plan: any) => (
                    <TableRow key={plan.id}>
                      <TableCell className="w-[60%]">{plan.name}</TableCell>
                      <TableCell>{plan.price}</TableCell>
                      <TableCell>{plan.duration}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => deletePlanMutation.mutate(plan.id)}
                        >
                          Deletar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionsPage;
