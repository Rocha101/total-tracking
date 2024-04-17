import Sidebar from "@/components/sidebar/sidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar>{children}</Sidebar>
    </div>
  );
};

export default AppLayout;
