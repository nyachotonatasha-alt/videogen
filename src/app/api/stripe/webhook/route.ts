import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        ) as Stripe.Subscription;

        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        // Determine tier based on price ID
        let tier = 'FREE';
        if (subscription.items.data[0].price.id === process.env.STRIPE_PRO_PRICE_ID) {
            tier = 'PRO';
        } else if (subscription.items.data[0].price.id === process.env.STRIPE_ULTIMATE_PRICE_ID) {
            tier = 'ULTIMATE';
        }

        if (sql) {
            await sql`
            INSERT INTO subscriptions (
              user_id,
              stripe_customer_id,
              stripe_subscription_id,
              stripe_price_id,
              stripe_current_period_end,
              tier
            ) VALUES (
              ${session.metadata.userId},
              ${session.customer as string},
              ${session.subscription as string},
              ${subscription.items.data[0].price.id},
              ${new Date((subscription as any).current_period_end * 1000).toISOString()},
              ${tier}
            ) ON CONFLICT (user_id) DO UPDATE SET
              stripe_subscription_id = EXCLUDED.stripe_subscription_id,
              stripe_price_id = EXCLUDED.stripe_price_id,
              stripe_current_period_end = EXCLUDED.stripe_current_period_end,
              tier = EXCLUDED.tier;
          `;
        }
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        ) as Stripe.Subscription;

        if (sql) {
            await sql`
            UPDATE subscriptions SET
              stripe_price_id = ${subscription.items.data[0].price.id},
              stripe_current_period_end = ${new Date((subscription as any).current_period_end * 1000).toISOString()}
            WHERE stripe_subscription_id = ${subscription.id}
          `;
        }
    }

    return new NextResponse(null, { status: 200 });
}
