import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import Link from "next/link";

const Dashboard = () => {
    return (
        <div className="h-full">
            <PageHeader title="Dashboard" description="Aqui você encontra atalhos para as principais ações do sistema." />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Próxima Atualização</CardTitle>
                        <CardDescription>
                            Atualize seu perfil físico para melhorar sua experiência.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link href="/app/updates/new" passHref>
                            <Button>
                                Atualizar Agora
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Meus Planos</CardTitle>
                        <CardDescription>Planos atribuídos pelo seu coach</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Em breve você poderá visualizar seus planos aqui.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard