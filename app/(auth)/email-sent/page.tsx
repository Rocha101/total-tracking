"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { TbChevronLeft } from "react-icons/tb";

function EmailSent() {
  return (
    <Card className="w-full max-w-sm">
      <div className="w-full flex justify-start px-6">
        <Link href="/sign-in">
          <Button variant="link" className="mt-4 p-0">
            <TbChevronLeft className="mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
      <CardHeader className="pt-2">
        <CardTitle className="text-2xl">Email enviado!</CardTitle>
        <CardDescription>Verifique sua caixa de entrada</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <Image
          src="/email-sent.svg"
          width={200}
          height={200}
          alt="Email enviado"
        />
      </CardContent>
    </Card>
  );
}

export default EmailSent;
