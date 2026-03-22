import { NextRequest } from "next/server";
import { runDailyAutomation } from "@/app/actions";

// This endpoint is called by an external cron job (e.g. crontab, GitHub Actions, Vercel Cron).
// Protect with a secret token in production.

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDailyAutomation();
    return Response.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron] daily automation failed:", err);
    return Response.json({ error: "Automation failed" }, { status: 500 });
  }
}
