import crypto from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headersList = await headers();
        const signature = headersList.get("x-signature") || "";
        const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "";

        if (!secret) {
            console.error("Missing Lemon Squeezy Webhook Secret (LEMON_SQUEEZY_WEBHOOK_SECRET)");
            return new NextResponse("Server configuration error", { status: 500 });
        }

        // Validate the Lemon Squeezy Webhook signature for security
        const hmac = crypto.createHmac("sha256", secret);
        const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8");
        const signatureBuffer = Buffer.from(signature, "utf8");

        if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
            console.error("Invalid Lemon Squeezy signature.");
            return new NextResponse("Invalid signature", { status: 400 });
        }

        // Payload is valid, parse the Lemon Squeezy Event
        const payload = JSON.parse(body);
        const eventName = payload.meta.event_name;
        const customData = payload.meta.custom_data;
        const userId = customData?.userId;

        if (!userId) {
            console.error("No userId found in custom_data. Ensure the checkout link passes checkout[custom][userId]");
            return new NextResponse("No userId found in custom_data", { status: 400 });
        }

        // We only care about completed orders or active subscriptions
        if (eventName === "order_created" || eventName === "subscription_created" || eventName === "subscription_updated") {
            const attributes = payload.data.attributes;
            
            // Safely extract identifying attributes from Lemon Squeezy payload
            const customerId = attributes.customer_id?.toString() || payload.data.id.toString();
            const subId = payload.data.id?.toString() || "ls_order_" + Date.now().toString();
            
            // Some events put variant_id at root of attributes, others put it in first_order_item
            const priceId = attributes.variant_id?.toString() || attributes.first_order_item?.variant_id?.toString() || "LEMON_SQUEEZY_PRO";
            
            // Calculate when the subscription ends. (Default to +1 month if not explicitly provided)
            let periodEnd = new Date();
            if (attributes.renews_at) {
                periodEnd = new Date(attributes.renews_at);
            } else {
                periodEnd.setMonth(periodEnd.getMonth() + 1); 
            }

            if (sql) {
                // Upsert to Database, we are mapping Lemon Squeezy attributes into the old stripe columns to prevent DB schema migrations!
                // Since this app only has 'FREE' and 'PRO', any incoming order sets them to 'PRO'.
                await sql`
                INSERT INTO subscriptions (
                  user_id,
                  stripe_customer_id,
                  stripe_subscription_id,
                  stripe_price_id,
                  stripe_current_period_end,
                  tier
                ) VALUES (
                  ${userId},
                  ${customerId},
                  ${subId},
                  ${priceId},
                  ${periodEnd.toISOString()},
                  'PRO'
                ) ON CONFLICT (user_id) DO UPDATE SET
                  stripe_subscription_id = EXCLUDED.stripe_subscription_id,
                  stripe_price_id = EXCLUDED.stripe_price_id,
                  stripe_current_period_end = EXCLUDED.stripe_current_period_end,
                  tier = EXCLUDED.tier;
                `;
            }
        } else if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
            // Downgrade user back to FREE
            if (sql) {
                await sql`
                UPDATE subscriptions SET
                  tier = 'FREE'
                WHERE user_id = ${userId}
                `;
            }
        }

        return new NextResponse("Lemon Squeezy Webhook Processed Successfully", { status: 200 });
    } catch (error: any) {
        console.error("Webhook processing failed:", error);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
    }
}
