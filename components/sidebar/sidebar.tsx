"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  TbHome,
  TbSettings,
  TbUsers,
  TbRun,
  TbLogout,
  TbBarbell,
  TbBasket,
  TbBowl,
  TbChartBar,
  TbPill,
  TbToolsKitchen3,
  TbVaccine,
  TbVaccineBottle,
} from "react-icons/tb";
import { useAuth } from "@/context/auth";
import { ModeToggle } from "../theme-toggle";

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar = ({ isAdmin }: SidebarProps) => {
  const { logout } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const adminLinks = [
    {
      name: "Protocolos",
      icon: TbChartBar,
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
    { name: "Alimentos", icon: TbToolsKitchen3, href: "/admin/foods" },
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

  const links = isAdmin ? adminLinks : clientLinks;

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 flex w-14 flex-col border-r bg-background overflow-y-auto">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href="/admin"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <TbHome className="h-[1.2rem] w-[1.2rem] transition-all group-hover:scale-110" />
            <span className="sr-only">Dashboard</span>
          </Link>
          {links.map((link) => (
            <Tooltip delayDuration={10} key={link.name}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground ${
                    path.includes(link.href) ? "dark:text-white text-black" : ""
                  } md:h-8 md:w-8`}
                >
                  <link.icon className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">{link.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.name}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <ModeToggle />

          <Tooltip delayDuration={10}>
            <TooltipTrigger asChild>
              <Link
                href={`/${isAdmin ? "admin" : "app"}/settings`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <TbSettings className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Configurações</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Configurações</TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={10}>
            <TooltipTrigger asChild>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                onClick={logout}
              >
                <TbLogout className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Sair</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Sair</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
