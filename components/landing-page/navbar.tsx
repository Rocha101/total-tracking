"use client";

import { Fragment } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { TbBarbell, TbMenu } from "react-icons/tb";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";

const LandingNavBar = () => {
  return (
    <header className="fixed top-0 w-full z-10 bg-background">
      <div className="container mx-auto px-4 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/logo1.png"
            width={100}
            height={30}
            alt="Iron Atlas"
            className="h-8 w-8"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
          <p className="text-xl font-bold">Iron Atlas</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Toggle navigation menu"
            >
              <TbMenu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="h-screen flex flex-col">
            <nav className="grid gap-6 text-lg font-medium p-4">
              <div className="flex flex-col items-start gap-4 mt-12">
                <Link href="/#faq" passHref>
                  <Button
                    variant={"link"}
                    className="text-black dark:text-white"
                  >
                    FAQ
                  </Button>
                </Link>
                <Link href="/#features" passHref>
                  <Button
                    variant={"link"}
                    className="text-black dark:text-white"
                  >
                    Funcionalidades
                  </Button>
                </Link>
                <Link href="/#pricing" passHref>
                  <Button
                    variant={"link"}
                    className="text-black dark:text-white"
                  >
                    Preço
                  </Button>
                </Link>
                <Link href="/#contact" passHref>
                  <Button
                    variant={"link"}
                    className="text-black dark:text-white"
                  >
                    Contato
                  </Button>
                </Link>
                <Link href="/sign-up" passHref>
                  <Button variant="link" className="text-black dark:text-white">
                    Criar conta
                  </Button>
                </Link>
                <Link href="/sign-in" passHref>
                  <Button variant="link" className="text-black dark:text-white">
                    Entrar
                  </Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <nav className="hidden lg:flex items-center justify-center">
          <div className="flex gap-6">
            <Link href="/#faq" passHref>
              <Button variant={"link"} className="text-black dark:text-white">
                FAQ
              </Button>
            </Link>
            <Link href="/#features" passHref>
              <Button variant={"link"} className="text-black dark:text-white">
                Funcionalidades
              </Button>
            </Link>
            <Link href="/#pricing" passHref>
              <Button variant={"link"} className="text-black dark:text-white">
                Preço
              </Button>
            </Link>
            <Link href="/#contact" passHref>
              <Button variant={"link"} className="text-black dark:text-white">
                Contato
              </Button>
            </Link>
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/sign-up" passHref>
            <Button variant="link" className="text-black dark:text-white">
              Criar conta
            </Button>
          </Link>
          <Link href="/sign-in" passHref>
            <Button variant="outline">Entrar</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingNavBar;
