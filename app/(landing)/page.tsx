import LandingNavBar from "@/components/landing-page/navbar";
import PricingPlanCard from "@/components/landing-page/pricing-plan-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  TbBrandGithub,
  TbBrandInstagram,
  TbBrandWhatsapp,
  TbMail,
  TbPhone,
} from "react-icons/tb";

const LandingHomePage = () => {
  return (
    <div className="relative z-10">
      <div className="-z-[5] absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black to-transparent" />
      <LandingNavBar />
      <section id="features" className="h-screen relative">
        <div className="h-full px-4 md:px-12 py-24">
          <Image
            src="/landing-page/pricing-hero.png"
            layout="fill"
            objectFit="cover"
            alt="Main background image"
            className="-z-20  backdrop-blur-md"
            quality={100}
          />

          <div className="h-full flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl  font-bold text-center text-white">
              Iron Atlas
            </h1>
            <p className="text-md md:text-xl text-center text-gray-600 dark:text-gray-300">
              A plataforma de gestão para fisiculturismo mais completa do
              mercado
            </p>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="h-full min-h-screen flex items-center justify-center relative"
      >
        <Image
          src="/landing-page/main-bg.png"
          layout="fill"
          objectFit="cover"
          alt="Main background image"
          className="-z-10 blur-sm"
          quality={100}
        />
        <div className="w-full flex flex-col lg:flex-row justify-center gap-12 px-12 py-24">
          <PricingPlanCard
            title="Plano mensal"
            description="Acesso completo a plataforma por 30 dias"
            price="R$ 29,90"
            duration="mês"
          />

          <PricingPlanCard
            title="Plano trimestral"
            description="Acesso completo a plataforma por 90 dias"
            price="R$ 79,90"
            duration="trimestre"
          />

          <PricingPlanCard
            title="Plano anual"
            description="Acesso completo a plataforma por 365 dias"
            price="R$ 299,90"
            duration="ano"
          />
        </div>
      </section>
      <section
        id="contact"
        className="h-screen flex items-center justify-center relative"
      >
        <Image
          src="/landing-page/hero-contact.png"
          layout="fill"
          objectFit="cover"
          alt="Main background image"
          className="-z-10 blur-sm"
          quality={100}
        />
        <div className="flex flex-col gap-6 items-center justify-center h-screen">
          <h1 className="text-5xl md:text-6xl lg:text-7xl  font-bold text-center text-white">
            Contato
          </h1>
          <p className="text-md md:text-xl lg:text-2xl text-center text-gray-600 dark:text-gray-300">
            Entre em contato conosco para saber mais sobre nossos planos
          </p>
          <Button className="mt-2 bg-green-600 hover:bg-green-600">
            <TbBrandWhatsapp className="h-6 w-6 mr-2" />
            Fale conosco
          </Button>
        </div>
      </section>

      <footer className="bg-card justify-center">
        <div className="mx-auto max-w-screen-xl px-4 py-24 ">
          <div className=" w-full grid grid-cols-1 gap-8 lg:grid-cols-2 content-center place-content-center justify-items-center">
            <div>
              <div className="flex justify-center text-primary sm:justify-start">
                <p className="text-2xl font-bold ">Iron Atlas</p>
              </div>

              <p className=" mt-6 max-w-md text-center leading-relaxed sm:max-w-xs md:text-left">
                A plataforma de gestão para fisiculturismo mais completa do
                mercado
              </p>

              <div className=" mt-6 flex justify-center sm:justify-start gap-4">
                <Link href="#">
                  <TbBrandInstagram className="h-6 w-6 text-primary" />
                </Link>

                <Link href="#">
                  <TbBrandGithub className="h-6 w-6 text-primary " />
                </Link>
              </div>
            </div>
            <div>
              <div className="flex justify-start">
                <p className="text-2xl font-bold">Contate-nos</p>
              </div>

              <div className=" mt-6 flex flex-col gap-4 justify-start">
                <Link
                  href="mailto:iron.atlas.app@gmail.com"
                  className="flex items-center gap-2 "
                >
                  <TbMail className="h-6 w-6 text-primary" />
                  <span>iron.atlas.app@gmail.com</span>
                </Link>
                <Link
                  href="tel:+5548998280420"
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
