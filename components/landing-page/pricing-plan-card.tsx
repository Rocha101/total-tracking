"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TbCheck } from "react-icons/tb";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PricingPlanCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  href?: string;
}

const PricingPlanCard = ({
  title,
  description,
  price,
  duration,
  features,
  href,
}: PricingPlanCardProps) => {
  const router = useRouter();
  return (
    <Card className="h-full md:w-96 hover:scale-105 hover:border-primary transition-all duration-300">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 ">
        <p className="text-4xl font-semibold text-start">
          {price}
          <span className="text-lg">/{duration}</span>
        </p>
        {href && (
          <Link href={href} target="_blank">
            <Button className="w-full mt-3">Quero Assinar</Button>
          </Link>
        )}

        <Separator className="mb-3" />
        <p className="font-semibold leading-none tracking-tight">
          O que está incluso:
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <TbCheck className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingPlanCard;
