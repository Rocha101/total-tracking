import LandingNavBar from "@/components/landing-page/navbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="">{children}</div>
    </div>
  );
};

export default AppLayout;
