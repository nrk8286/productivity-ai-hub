import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <Link href="/api/auth/signout" className="ml-auto underline">Sign out</Link>
        </div>
      </div>
      <main className="container py-8">{children}</main>
    </div>
  );
}
