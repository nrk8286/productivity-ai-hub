import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsMetrics } from "@/lib/analytics/tracking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing date range" },
        { status: 400 }
      );
    }

    const metrics = await getAnalyticsMetrics(
      new Date(startDate),
      new Date(endDate)
    );

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
