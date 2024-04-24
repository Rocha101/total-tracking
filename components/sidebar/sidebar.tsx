"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  TbSettings,
  TbUsers,
  TbRun,
  TbLogout,
  TbBarbell,
  TbBasket,
  TbBowl,
  TbChartBar,
  TbPill,
  TbVaccine,
  TbVaccineBottle,
  TbMenu,
  TbUser,
  TbFileAnalytics,
  TbMeat,
  TbBolt,
} from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth";
import { ModeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isAdmin?: boolean;
  children: React.ReactNode;
}

const Sidebar = ({ isAdmin, children }: SidebarProps) => {
  const { logout } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const adminLinks = [
    {
      name: "Atalhos",
      icon: TbBolt,
      href: "/admin",
      key: "/admin/dashboard",
    },
    {
      name: "Protocolos",
      icon: TbFileAnalytics,
      href: "/admin/protocols",
    },
    {
      name: "Clientes",
      icon: TbUsers,
      href: "/admin/clients",
    },
    {
      name: "Dietas",
      icon: TbBasket,
      href: "/admin/diets",
    },
    {
      name: "Refeições",
      icon: TbBowl,
      href: "/admin/meals",
    },
    { name: "Alimentos", icon: TbMeat, href: "/admin/foods" },
    {
      name: "Treinos",
      icon: TbBarbell,
      href: "/admin/trains",
    },
    {
      name: "Exercícios",
      icon: TbRun,
      href: "/admin/exercises",
    },
    {
      name: "Protocolos Hormonais",
      icon: TbVaccine,
      href: "/admin/hormonal-protocols",
    },
    {
      name: "Hormônios",
      icon: TbVaccineBottle,
      href: "/admin/hormones",
    },
    {
      name: "Outros Compostos",
      icon: TbPill,
      href: "/admin/extra-compounds",
    },
  ];

  const clientLinks = [
    {
      name: "Meu Protocolo",
      icon: TbChartBar,
      href: "/app/protocol",
    },
  ];

  const links: {
    name: string;
    icon: React.ElementType;
    href: string;
    key?: string;
  }[] = isAdmin ? adminLinks : clientLinks;

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden  bg-card lg:block w-72">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
            <div className="flex select-none items-center gap-2 font-semibold">
              <TbBarbell className="h-8 w-8 text-primary" />
              <span className="text-lg leading-relaxed font-bold">
                Iron Atlas
              </span>
            </div>
          </div>
          <div className="flex-1">
            <nav className="relative grid items-start px-2 text-sm font-medium lg:px-4 gap-2">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted transition-all duration-300 ease-in-out",
                    {
                      "bg-muted":
                        (!link.key && path.includes(link.href)) ||
                        link.href === path,
                    }
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <header className="flex h-14 items-center gap-4 bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 lg:hidden"
              >
                <TbMenu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex flex-col h-full overflow-y-auto"
            >
              <nav className="grid gap-2 text-lg font-medium">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                  >
                    <link.icon className="h-6 w-6" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full ml-auto"
              >
                <TbUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/admin/settings")}
                className="flex gap-2"
              >
                <TbSettings className="h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <ModeToggle />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="flex gap-2">
                <TbLogout className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="h-full flex flex-col overflow-auto gap-4 p-4 lg:border-l border-t">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
