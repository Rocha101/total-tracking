import LandingNavBar from "@/components/landing-page/navbar";
import PricingPlanCard from "@/components/landing-page/pricing-plan-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  TbBarbell,
  TbBrandGithub,
  TbBrandInstagram,
  TbBrandWhatsapp,
  TbMail,
  TbPhone,
} from "react-icons/tb";

const LandingHomePage = () => {
  return (
    <div className="relative z-30 bg-background">
      {/* <div className="-z-10 absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black to-transparent" /> */}
      <LandingNavBar />
      <section id="features" className="h-screen relative">
        <div className="z-30 h-full px-4 md:px-12 py-24">
          <div className="-z-20 h-full flex flex-col items-center justify-center relative">
            <Image
              src="/landing-page/pricing-hero.png"
              layout="fill"
              objectFit="cover"
              alt="Main background image"
              className="rounded-3xl brightness-[50%]"
              quality={100}
            />
            <div className="z-30 h-full flex flex-col items-center justify-center absolute">
              <h1 className="z-30 text-5xl md:text-6xl lg:text-7xl font-bold text-center text-white">
                Iron Atlas
              </h1>
              <p className="z-30 text-md md:text-xl text-center text-white px-3">
                A plataforma de gestão para fisiculturismo mais completa do
                mercado
              </p>
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
                <p className="text-2xl font-bold">Iron Atlas</p>
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
