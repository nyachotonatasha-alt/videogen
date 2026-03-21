import { auth } from "@clerk/nextjs/server";
import { getUserSubscription, getUserUsage } from "@/lib/subscription";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getUserSubscription(userId);
    const usage = await getUserUsage(userId);

    return NextResponse.json({
        tier: subscription.tier,
        usage,
        limit: subscription.limit,
    });
}
