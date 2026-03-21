import { sql } from "@/lib/db";

export async function setupDatabase() {
    if (!sql) return;

    try {
        // Create subscriptions table
        await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        user_id TEXT PRIMARY KEY,
        stripe_customer_id TEXT UNIQUE,
        stripe_subscription_id TEXT UNIQUE,
        stripe_price_id TEXT,
        stripe_current_period_end TIMESTAMP,
        tier TEXT DEFAULT 'FREE'
      );
    `;

        // Create daily usage table
        await sql`
      CREATE TABLE IF NOT EXISTS daily_usage (
        user_id TEXT,
        day TEXT,
        count INTEGER DEFAULT 0,
        PRIMARY KEY (user_id, day)
      );
    `;

        console.log("Database tables verified/created.");
    } catch (error) {
        console.error("Error setting up database:", error);
    }
}

export async function getUserSubscription(userId: string) {
    if (!sql) return { tier: 'FREE', limit: 3 };

    try {
        const result = await sql`
      SELECT * FROM subscriptions WHERE user_id = ${userId}
    `;

        if (result.length === 0) {
            return { tier: 'FREE', limit: 3 };
        }

        const sub = result[0];
        const now = new Date();

        // If subscription expired, revert to FREE
        if (sub.stripe_current_period_end && new Date(sub.stripe_current_period_end) < now) {
            return { tier: 'FREE', limit: 3 };
        }

        // Updated limits: Daily for all, but Pro/Ultimate have much higher caps
        return {
            tier: sub.tier,
            stripeSubscriptionId: sub.stripe_subscription_id,
            stripeCustomerId: sub.stripe_customer_id,
            stripePriceId: sub.stripe_price_id,
            stripeCurrentPeriodEnd: sub.stripe_current_period_end,
            limit: sub.tier === 'ULTIMATE' ? 9999 : (sub.tier === 'PRO' ? 50 : 3)
        };
    } catch (error) {
        console.error("Error fetching user subscription:", error);
        return { tier: 'FREE', limit: 3 };
    }
}

export async function getUserUsage(userId: string) {
    if (!sql) return 0;

    const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    try {
        const result = await sql`
      SELECT count FROM daily_usage WHERE user_id = ${userId} AND day = ${day}
    `;

        if (result.length === 0) return 0;
        return result[0].count;
    } catch (error) {
        console.error("Error fetching usage:", error);
        return 0;
    }
}

export async function incrementUserUsage(userId: string) {
    if (!sql) return;

    const day = new Date().toISOString().slice(0, 10);
    try {
        await sql`
      INSERT INTO daily_usage (user_id, day, count)
      VALUES (${userId}, ${day}, 1)
      ON CONFLICT (user_id, day)
      DO UPDATE SET count = daily_usage.count + 1
    `;
    } catch (error) {
        console.error("Error incrementing usage:", error);
    }
}

export async function checkUserLimit(userId: string) {
    const sub = await getUserSubscription(userId);
    const usage = await getUserUsage(userId);
    
    if (usage >= sub.limit) {
        return { isAllowed: false, tier: sub.tier, limit: sub.limit };
    }
    
    return { isAllowed: true, tier: sub.tier, limit: sub.limit };
}
