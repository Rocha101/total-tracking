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
  TbNotification,
  TbBell,
  TbCheck,
  TbClearAll,
  TbBellRinging,
  TbLoader2,
  TbInbox,
  TbShape,
  TbCamera,
  TbDashboard,
} from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "@/app/utils/api";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "../ui/badge";
import formatDate from "@/app/utils/formatData";

interface SidebarProps {
  isAdmin?: boolean;
  children: React.ReactNode;
}

type Notification = {
  id: string;
  title: string;
  message?: string;
  read: boolean;
  createdAt: string;
};

const Sidebar = ({ isAdmin, children }: SidebarProps) => {
  const { logout, account } = useAuth();
  const clientQuery = useQueryClient();
  const accountId = account?.account?.id;
  const router = useRouter();
  const path = usePathname();
  const [enabledLinks, setEnabledLinks] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);

  const { data: notificationData = [] } = useQuery("notification", async () => {
    const res = await api.get(`/notification`);

    return res.data;
  });

  const readNotificationMutation = useMutation(
    (id: string) =>
      api.put(`/notification/${id}`, {
        read: true,
      }),
    {
      onSuccess: (res) => {
        clientQuery.invalidateQueries("notification");
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const deleteNotificationMutation = useMutation(
    (id: string) => api.delete(`/notification/${id}`),
    {
      onSuccess: (res) => {
        clientQuery.invalidateQueries("notification");
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

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
    {
      name: "Atualizações",
      icon: TbCamera,
      href: "/admin/updates",
    },
  ];

  const clientLinks = [
    {
      name: "Inicio",
      icon: TbDashboard,
      href: "/app",
      key: "/app/dashboard",
    },
    {
      name: "Meu Protocolo",
      icon: TbChartBar,
      href: "/app/protocol",
    },
    {
      name: "Atualizações",
      icon: TbCamera,
      href: "/app/updates",
    },
  ];

  const links: {
    name: string;
    icon: React.ElementType;
    href: string;
    key?: string;
  }[] = isAdmin ? adminLinks : clientLinks;

  const deleteAllNotifications = async () => {
    await notificationData.forEach((notification: any) => {
      deleteNotificationMutation.mutate(notification.id);
    });
  };

  const unreadNotificationCount = notificationData.filter((item: Notification) => !item.read)

  return (
    <div className="flex min-h-screen w-full print:hidden">
      <div className="hidden  bg-card lg:block w-72">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
            <div className="flex select-none items-center gap-2 font-semibold">
              <Image
                src="/logo1.png"
                width={100}
                height={30}
                alt="Iron Atlas"
                className="h-8 w-8"
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
              <span className="text-lg leading-relaxed font-bold">
                Iron Atlas
              </span>
            </div>
          </div>
          <div className="flex-1">
            <nav className="relative grid items-start px-2 text-sm font-medium lg:px-4 gap-2">
              {links.map((link) => (
                <Link key={link.name} href={link.href} passHref>
                  <Button
                    variant="ghost"
                    disabled={!enabledLinks}
                    className={cn(
                      "w-full flex items-center justify-start gap-3 rounded-md px-3 py-2 hover:bg-muted transition-all duration-300 ease-in-out",
                      {
                        "bg-muted":
                          (!link.key && path.includes(link.href)) ||
                          link.href === path,
                      }
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <header className="flex h-14 items-center gap-4 bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet open={openMenu} onOpenChange={setOpenMenu}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 lg:hidden"
                disabled={!enabledLinks}
              >
                <TbMenu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex flex-col h-full overflow-y-auto py-12"
            >
              <nav className="grid gap-2 text-lg font-medium">
                {links.map((link) => (
                  <Link key={link.name} href={link.href} passHref>
                    <Button
                      disabled={!enabledLinks}
                      variant="ghost"
                      className={cn(
                        "w-full flex items-center justify-start gap-3 rounded-md px-3 py-2 hover:bg-muted transition-all duration-300 ease-in-out",
                        {
                          "bg-muted":
                            (!link.key && path.includes(link.href)) ||
                            link.href === path,
                        }
                      )}
                      onClick={() => setOpenMenu(false)}
                    >
                      <link.icon className="h-6 w-6" />
                      <span>{link.name}</span>
                    </Button>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex select-none items-center gap-2 font-semibold lg:hidden">
            <Image
              src="/logo1.png"
              width={100}
              height={30}
              alt="Iron Atlas"
              className="h-8 w-8"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
            <span className="text-lg leading-relaxed font-bold">
              Iron Atlas
            </span>
          </div>
          <div className="flex gap-2 items-center  ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {unreadNotificationCount > 0 ? (
                    <TbBellRinging className="h-5 w-5 animate-pulse" />
                  ) : (
                    <TbBell className="h-5 w-5" />
                  )}

                  <span className="sr-only">Toggle notifications view</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-72">
                <div className="w-full flex items-center justify-betweeen">
                  <DropdownMenuLabel className="flex-1">
                    Notificações
                  </DropdownMenuLabel>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={deleteAllNotifications}
                    disabled={notificationData.length === 0}
                  >
                    {deleteNotificationMutation.isLoading ? (
                      <TbLoader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TbClearAll className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <DropdownMenuSeparator />
                {notificationData.length === 0 && (
                  <DropdownMenuItem
                    disabled
                    className="h-64 flex flex-col gap-3 items-center justify-center"
                  >
                    <TbInbox className="h-12 w-12 " />
                    Nenhuma notificação
                  </DropdownMenuItem>
                )}
                {notificationData.map((notification: Notification) => (
                  <DropdownMenuCheckboxItem
                    key={notification.id}
                    checked={notification.read}
                    onCheckedChange={() =>
                      readNotificationMutation.mutate(notification.id)
                    }
                  >
                    <div className="w-full max-w-screen flex flex-col gap-1 items-start justify-start">
                      <span className="font-semibold truncate">
                        {notification.title}
                      </span>
                      <span className="text-sm truncate">
                        {notification.message}
                      </span>
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <TbUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    if (isAdmin) {
                      router.push("/admin/settings");
                    } else {
                      router.push("/app/settings");
                    }
                  }}
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
          </div>
        </header>
        <main className="h-full flex flex-col overflow-auto gap-4 p-4 bg-zinc-100 dark:bg-zinc-900">
          <div className="container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
