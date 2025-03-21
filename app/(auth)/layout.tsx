import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full w-full flex items-center justify-center relative">
      <div className="-z-[5] absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black to-transparent" />
      <Image
        src="/landing-page/pricing-hero.png"
        alt="Main background image"
        className="-z-10  backdrop-blur-md"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: "cover"
        }} />
      {children}
    </main>
  );
};

export default AuthLayout;
