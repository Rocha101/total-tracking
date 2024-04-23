import LandingNavBar from "@/components/landing-page/navbar";
import PricingPlanCard from "@/components/landing-page/pricing-plan-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Tb24Hours,
  TbBarbell,
  TbBrandGithub,
  TbBrandInstagram,
  TbBrandWhatsapp,
  TbDeviceMobile,
  TbMail,
  TbNumber,
  TbPhone,
  TbPill,
  TbToolsKitchen3,
  TbUser,
  TbUsers,
  TbVaccine,
} from "react-icons/tb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import FaqItem from "@/components/landing-page/faq-item";

const LandingHomePage = () => {
  return (
    <div className="relative z-30 bg-background">
      <LandingNavBar />

      <section
        id="hero"
        className="w-full h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/landing-page/pricing-hero.png')",
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-black/80 to-black/50 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white">
                  Tome o controle dos seus protocolos
                </h1>
                <p className="max-w-[600px] md:text-xl text-muted dark:text-muted-foreground">
                  Nosso sistema de gestão de fisiculturismo foi desenvolvido
                  para atender às necessidades de atletas e treinadores,
                  garantindo desempenho e progresso ideais
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="h-full min-h-screen flex items-center justify-center relative"
      >
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 px-4 md:px-12 py-24">
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
              Sobre o Iron Atlas
            </h1>
            <p className="text-md md:text-lg text-center text-muted-foreground px-3">
              O Iron Atlas é uma plataforma de gestão para fisiculturismo que
              visa auxiliar atletas e treinadores a alcançarem seus objetivos de
              forma mais eficiente e organizada
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <Image
              src="/landing-page/about-us.png"
              layout="intrinsic"
              width={500}
              height={500}
              objectFit="contain"
              alt="About image"
              quality={100}
              className="rounded-3xl"
            />
          </div>
        </div>
      </section>

      <section
        id="features"
        className="h-full min-h-screen flex items-center justify-center relative"
      >
        <div className="w-full flex flex-col items-center justify-center gap-12 px-4 md:px-12 py-24">
          <div className="w-full flex flex-col items-center justify-center gap-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center ">
              Recursos
            </h1>
            <p className="text-md md:text-lg text-center text-muted-foreground px-3">
              O Iron Atlas conta com uma série de recursos que visam otimizar a
              gestão de atletas e treinadores de fisiculturismo
            </p>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="grid grid-cols-1 md:grids-cols-2 lg:grid-cols-3 gap-24">
              {[
                {
                  id: 1,
                  title: "Planos de treino personalizados",
                  description:
                    "Crie rotinas de exercícios sob medida para atender às necessidades e objetivos exclusivos de cada atleta, garantindo desempenho e progresso ideais.",
                  icon: TbBarbell,
                },
                {
                  id: 2,
                  title: "Planos alimentares personalizados",
                  description:
                    "Desenvolva planos dietéticos individualizados adaptados às necessidades de cada atleta, otimizando a nutrição para o máximo desempenho e bem-estar.",
                  icon: TbToolsKitchen3,
                },
                {
                  id: 3,
                  title: "Protocolos hormonais",
                  description:
                    "Elabore protocolos hormonais personalizados alinhados com as necessidades e objetivos específicos de cada atleta, aprimorando os resultados do treinamento e a recuperação.",
                  icon: TbVaccine,
                },
                {
                  id: 4,
                  title: "Planos de suplementação",
                  description:
                    "Crie planos de suplementação personalizados de acordo com as necessidades de cada atleta",
                  icon: TbPill,
                },
                {
                  id: 5,
                  title: "Suporte 24 horas",
                  description:
                    "Receba assistência 24 horas para atender prontamente às necessidades de atletas e treinadores, garantindo orientação e suporte contínuos.",
                  icon: Tb24Hours,
                },
                {
                  id: 6,
                  title: "Totalmente responsivo",
                  description:
                    "Acesse a plataforma de forma fluida a partir de qualquer dispositivo, seja um smartphone, tablet ou computador, garantindo conveniência e flexibilidade para os usuários em movimento.",
                  icon: TbDeviceMobile,
                },
              ].map((feature) => (
                <div
                  key={feature.id}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <feature.icon className="h-12 w-12 text-primary" />
                  <h1 className="text-xl font-bold text-center text-white">
                    {feature.title}
                  </h1>
                  <p className="max-w-xs text-md text-center text-muted-foreground px-3">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="h-full min-h-screen flex items-center justify-center relative"
      >
        <div className="w-full flex flex-col items-center justify-center gap-12 px-4 md:px-12 py-24">
          <div className="w-full flex flex-col items-center justify-center gap-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center ">
              Perguntas frequentes
            </h1>
            <p className="text-md md:text-lg text-center text-muted-foreground px-3">
              Confira as perguntas mais frequentes sobre o Iron Atlas
            </p>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-5xl flex flex-col gap-6">
              {[
                {
                  id: 1,
                  question: "Como posso adquirir o Iron Atlas?",
                  answer:
                    "Para adquirir o Iron Atlas, entre em contato conosco através do WhatsApp ou do e-mail disponíveis no rodapé da página",
                },
                {
                  id: 2,
                  question: "Quais são os planos disponíveis?",
                  answer:
                    "Atualmente, oferecemos dois planos: o plano mensal, com acesso completo à plataforma por 30 dias, e o plano personalizado, que pode ser adaptado de acordo com as necessidades de cada usuário",
                },
                {
                  id: 3,
                  question: "O Iron Atlas é responsivo?",
                  answer:
                    "Sim, o Iron Atlas é totalmente responsivo, o que significa que você pode acessar a plataforma de forma fluida a partir de qualquer dispositivo, seja um smartphone, tablet ou computador",
                },
                {
                  id: 4,
                  question: "Como adicionar meus clientes na plataforma?",
                  answer:
                    "Para adicionar seus clientes na plataforma, basta compartilhar o link de cadastro com eles. Assim que se cadastrarem, você poderá gerenciar suas informações de forma prática e eficiente",
                },
              ].map((faq) => (
                <FaqItem
                  key={faq.id}
                  id={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="h-full min-h-screen flex items-center justify-center relative"
      >
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 px-4 md:px-12 py-24">
          <PricingPlanCard
            title="Plano mensal"
            description="Acesso completo a plataforma por 30 dias"
            price="R$ 29,90"
            duration="mês"
            features={[
              "Planos de treino personalizados",
              "Planos alimentares personalizados",
              "Protocolos hormonais",
              "Planos de suplementação",
              "Suporte 24 horas",
              "Até 100 clientes ativos",
            ]}
            href="https://wa.me/5548998280420?text=Ol%C3%A1%21+Estou+interessado+em+adquirir+o+plano+b%C3%A1sico+do+Iron+Atlas.+Poderia+me+informar+como+adquirir+e+como+proceder+para+ativ%C3%A1-lo%3F"
          />
          <PricingPlanCard
            title="Plano personalizado"
            description="Entre em contato para saber mais sobre nossos planos personalizados"
            price="R$ XX,XX"
            duration="mês"
            features={[
              "Planos de treino personalizados",
              "Planos alimentares personalizados",
              "Protocolos hormonais",
              "Planos de suplementação",
              "Suporte 24 horas",
              "Clientes ilimitados",
            ]}
            href="https://wa.me/5548998280420?text=Ol%C3%A1%21+Estou+interessado+em+adquirir+o+plano+personalizado+do+Iron+Atlas.+Poderia+me+informar+como+adquirir+e+como+proceder+para+ativ%C3%A1-lo%3F"
          />
        </div>
      </section>

      <div className="w-full flex items-center justify-center -mb-16">
        <div className="h-full w-full flex flex-col md:flex-row gap-6 max-w-3xl bg-gradient-to-r from-primary to-orange-500 rounded-xl items-center justify-between py-12 px-12">
          <h1 className="text-xl text-white">Entre em contato</h1>
          <Link href="https://wa.me/5548998280420" target="_blank">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:bg-green-600 rounded-md"
            >
              <TbBrandWhatsapp className="h-6 w-6 mr-2" />
              Fale conosco
            </Button>
          </Link>
        </div>
      </div>

      <footer className="bg-border justify-center border-t" id="contact">
        <div className="mx-auto max-w-screen-xl px-4 py-36 ">
          <div className="w-full grid grid-cols-1 gap-8 lg:grid-cols-2 content-center place-content-center justify-items-center">
            {/* Iron Atlas section */}
            <div className="flex flex-col justify-start items-center lg:items-start">
              <div className="flex items-center gap-3 justify-center text-white sm:justify-start">
                <TbBarbell className="h-12 w-12 text-primary" />
                <p className="text-2xl font-bold text-primary">Iron Atlas</p>
              </div>
              <p className="mt-6 max-w-md text-center leading-relaxed sm:max-w-xs md:text-left">
                A plataforma de gestão para fisiculturismo mais completa do
                mercado
              </p>
              <div className="mt-6 flex justify-center sm:justify-start gap-4">
                <Link href="#">
                  <TbBrandInstagram className="h-6 w-6 text-primary" />
                </Link>
                <Link href="#">
                  <TbBrandGithub className="h-6 w-6 text-primary" />
                </Link>
              </div>
            </div>

            {/* Contate-nos section */}
            <div className="flex flex-col justify-start items-center lg:items-start">
              <div className="flex justify-start">
                <p className="text-2xl font-bold">Contate-nos</p>
              </div>
              <div className="mt-6 flex flex-col gap-4 justify-start">
                <Link
                  href="mailto:iron.atlas.app@gmail.com"
                  target="_blank"
                  className="flex items-center gap-2 "
                >
                  <TbMail className="h-6 w-6 text-primary" />
                  <span>iron.atlas.app@gmail.com</span>
                </Link>
                <Link
                  href="tel:+5548998280420"
                  target="_blank"
                  className="flex items-center gap-2 "
                >
                  <TbPhone className="h-6 w-6 text-primary" />
                  <span>+55 48 99828-0420</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingHomePage;
