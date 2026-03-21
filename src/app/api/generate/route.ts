import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserSubscription, getUserUsage, incrementUserUsage, checkUserLimit } from "@/lib/subscription";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
console.log("[AI API] Initializing with baseURL:", baseURL);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy-key",
    baseURL: baseURL,
});

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check daily limit
        const { isAllowed, limit } = await checkUserLimit(userId);
        if (!isAllowed) {
            return NextResponse.json({ 
                error: `Daily limit reached (${limit}/day for FREE). Upgrade for more.`,
                limitReached: true
            }, { status: 403 });
        }

        const { productName, productUrl, description, targetAudience, platform, tone, images } = await req.json();

        const systemPrompt = `You are a world-class direct response ad strategist specializing in high-converting video ads for ${platform}.
    
    Your task is to analyze the product and generate:
    1. Analysis (What it is, Key features, Target Audience, Emotional Triggers, Pain Points, Value Level)
    2. 10 High-Converting Hooks (Scroll-stopping)
    3. 5 Different Marketing Angles
    4. 5 Full 30-second Video Ad Scripts (with visual & audio cues)
    5. 3 Short 15-second Ad Scripts
    6. 5 Strong CTAs
    7. On-screen Caption Suggestions
    8. Shot List Instructions
    9. AI Voiceover Tone Suggestion
    
    Output must be strictly valid JSON with the following structure:
    {
      "analysis": { "whatItIs": "...", "features": ["..."], "targetAudience": "...", "triggers": ["..."], "painPoints": ["..."], "valueLevel": "..." },
      "hooks": ["..."],
      "angles": [{ "name": "...", "description": "..." }],
      "scripts30": [{ "title": "...", "script": "..." }], // script should include [Scene]: ... (Voiceover): ...
      "scripts15": [{ "title": "...", "script": "..." }],
      "ctas": ["..."],
      "captions": ["..."],
      "shotList": ["..."],
      "voiceoverTone": "..."
    }
    
    Tone: ${tone}
    Optimize for high CTR and emotional persuasion.`;

        const userPromptContent: any[] = [
            {
                type: "text",
                text: `Product Name: ${productName}
Description: ${description}
Target Audience: ${targetAudience}
Product URL/Image: ${productUrl || "Not provided"}`
            }
        ];

        // Add uploaded images if they exist
        if (images && Array.isArray(images)) {
            images.forEach((imgBase64: string) => {
                userPromptContent.push({
                    type: "image_url",
                    image_url: {
                        url: imgBase64
                    }
                });
            });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPromptContent }
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        // Check if first usage
        const usage = await getUserUsage(userId);
        if (usage === 0) {
            try {
                const user = await currentUser();
                const primaryEmail = user?.emailAddresses[0]?.emailAddress;

                if (primaryEmail && process.env.RESEND_API_KEY) {
                    await resend.emails.send({
                        from: "Hytec Ad Gen <onboarding@resend.dev>",
                        to: [primaryEmail],
                        subject: "Welcome to Hytec Ad Gen! 🚀",
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; color: #333; border: 1px solid #eee; border-radius: 12px;">
                                <h1 style="color: #6366f1; margin-bottom: 20px;">Welcome to the future of ad creation!</h1>
                                <p style="font-size: 16px; line-height: 1.6;">Hi ${user.firstName || 'there'},</p>
                                <p style="font-size: 16px; line-height: 1.6;">You just generated your first ad campaign with <strong>Hytec Ad Gen</strong>. We're thrilled to have you on board!</p>
                                <p style="font-size: 16px; line-height: 1.6;">Our mission is to help you create viral, high-converting content in seconds. Here's what you can do next:</p>
                                <ul style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    <li>Explore different <strong>hooks</strong> for your product</li>
                                    <li>Generate <strong>AI video trailers</strong> in the Video tab</li>
                                    <li>Download your scripts or email them to yourself</li>
                                </ul>
                                <div style="margin-top: 30px; padding: 20px; background: #f5f3ff; border-radius: 8px;">
                                    <p style="margin: 0; font-weight: bold; color: #5b21b6;">Need help?</p>
                                    <p style="margin: 5px 0 0; font-size: 14px; color: #6d28d9;">Just reply to this email or use the suggestions tab in the dashboard!</p>
                                </div>
                                <p style="margin-top: 40px; font-size: 14px; color: #999; text-align: center;">Keep creating,<br/>The Hytec Team</p>
                            </div>
                        `
                    });
                }
            } catch (e) {
                console.error("Failed to send welcome email:", e);
                // Don't fail the whole request just because welcome email failed
            }
        }

        // Increment usage
        await incrementUserUsage(userId);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error generating ad:", error);
        return NextResponse.json(
            { error: "Failed to generate ad content" },
            { status: 500 }
        );
    }
}
