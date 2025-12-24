import { prisma } from "../db";

export interface TrackEventOptions {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId: string;
}

export async function trackEvent(options: TrackEventOptions) {
  const { event, properties = {}, userId, sessionId } = options;

  try {
    await prisma.analytics.create({
      data: {
        event,
        properties,
        userId,
        sessionId,
        timestamp: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error tracking event:", error);
    return { success: false, error };
  }
}

export async function trackPageView(
  path: string,
  sessionId: string,
  userId?: string
) {
  return trackEvent({
    event: "page_view",
    properties: { path },
    sessionId,
    userId,
  });
}

export async function trackButtonClick(
  buttonId: string,
  sessionId: string,
  userId?: string
) {
  return trackEvent({
    event: "button_click",
    properties: { buttonId },
    sessionId,
    userId,
  });
}

export async function trackFormSubmission(
  formId: string,
  sessionId: string,
  userId?: string
) {
  return trackEvent({
    event: "form_submission",
    properties: { formId },
    sessionId,
    userId,
  });
}

export async function trackSignup(
  method: string,
  sessionId: string,
  userId: string
) {
  return trackEvent({
    event: "signup",
    properties: { method },
    sessionId,
    userId,
  });
}

export async function trackPurchase(
  productId: string,
  amount: number,
  sessionId: string,
  userId: string
) {
  return trackEvent({
    event: "purchase",
    properties: { productId, amount },
    sessionId,
    userId,
  });
}

export interface AnalyticsMetrics {
  pageViews: number;
  uniqueVisitors: number;
  signups: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
}

export async function getAnalyticsMetrics(
  startDate: Date,
  endDate: Date
): Promise<AnalyticsMetrics> {
  try {
    const [pageViews, uniqueVisitors, signups, orders] = await Promise.all([
      // Page views
      prisma.analytics.count({
        where: {
          event: "page_view",
          timestamp: { gte: startDate, lte: endDate },
        },
      }),
      // Unique visitors (unique session IDs)
      prisma.analytics
        .findMany({
          where: {
            event: "page_view",
            timestamp: { gte: startDate, lte: endDate },
          },
          select: { sessionId: true },
          distinct: ["sessionId"],
        })
        .then((results) => results.length),
      // Signups
      prisma.analytics.count({
        where: {
          event: "signup",
          timestamp: { gte: startDate, lte: endDate },
        },
      }),
      // Orders
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: "COMPLETED",
        },
      }),
    ]);

    const revenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const purchases = orders.length;
    const conversionRate = uniqueVisitors > 0 ? (purchases / uniqueVisitors) * 100 : 0;

    return {
      pageViews,
      uniqueVisitors,
      signups,
      purchases,
      revenue,
      conversionRate,
    };
  } catch (error) {
    console.error("Error getting analytics metrics:", error);
    return {
      pageViews: 0,
      uniqueVisitors: 0,
      signups: 0,
      purchases: 0,
      revenue: 0,
      conversionRate: 0,
    };
  }
}
