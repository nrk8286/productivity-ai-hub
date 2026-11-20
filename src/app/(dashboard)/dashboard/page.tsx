import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAnalyticsMetrics } from "@/lib/analytics/tracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true, role: true, subscriptionTier: true } });
  if (!user) redirect("/api/auth/signout");
  if (user.role !== "ADMIN") {
    return <div className="space-y-4"><h1 className="text-3xl font-bold">Your account</h1><p>{user.name || user.email}</p><p>Plan: {user.subscriptionTier}</p></div>;
  }
  const now = new Date();
  const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const [metrics, subscribers, messages, billingIssues] = await Promise.all([
    getAnalyticsMetrics(start, now),
    prisma.subscriber.count({ where: { status: "ACTIVE" } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.billingIssue.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  const cards = [
    { title: "Recorded revenue (30 days)", value: `$${metrics.revenue.toFixed(2)}` },
    { title: "Active subscribers", value: subscribers.toLocaleString() },
    { title: "Page views (30 days)", value: metrics.pageViews.toLocaleString() },
    { title: "Recorded purchases (30 days)", value: metrics.purchases.toLocaleString() },
  ];
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold tracking-tight">Dashboard</h1><p className="text-muted-foreground">Activity recorded in your database.</p></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(card => <Card key={card.title}><CardHeader><CardTitle className="text-sm font-medium">{card.title}</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{card.value}</p></CardContent></Card>)}
      </div>
      <Card><CardHeader><CardTitle>Billing events to review</CardTitle></CardHeader><CardContent>
        {billingIssues.length === 0 ? <p>No billing issues recorded.</p> : <ul className="space-y-2">{billingIssues.map(issue => <li key={issue.id}><p>{issue.type}: {issue.objectId}</p><p className="text-sm text-muted-foreground">{issue.subscriptionId || "No subscription identified"} — review this event in Stripe.</p></li>)}</ul>}
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Recent contact messages</CardTitle></CardHeader><CardContent>
        {messages.length === 0 ? <p>No messages received yet.</p> : <ul className="space-y-6">{messages.map(message => <li key={message.id} className="border-b pb-4"><h2 className="font-semibold">{message.subject}</h2><p className="text-sm">{message.name} — {message.email}</p><time className="text-sm text-muted-foreground" dateTime={message.createdAt.toISOString()}>{message.createdAt.toISOString()}</time><p className="whitespace-pre-wrap">{message.message}</p></li>)}</ul>}
      </CardContent></Card>
    </div>
  );
}
