const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="">{children}</div>
    </div>
  );
};

export default AppLayout;
