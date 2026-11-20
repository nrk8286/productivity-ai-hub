import { redirect } from "next/navigation";

export default function LoginPage() {
  redirect("/api/auth/signin?callbackUrl=%2Fdashboard");
}
