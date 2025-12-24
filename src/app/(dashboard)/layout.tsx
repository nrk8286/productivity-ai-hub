export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>
      </div>
      <main className="container py-8">{children}</main>
    </div>
  );
}
