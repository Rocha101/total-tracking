import Sidebar from "@/components/sidebar/sidebar";
import TopBar from "@/components/sidebar/top-bar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar isAdmin />
      <TopBar />
      <div className="ml-14 w-[calc(100%-theme(space.14))] p-3">{children}</div>
    </div>
  );
};

export default AdminLayout;
