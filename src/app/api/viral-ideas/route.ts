import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { incrementUserUsage, checkUserLimit } from "@/lib/subscription";

const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

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

        const { niche, platform } = await req.json();

        if (!niche || !platform) {
            return NextResponse.json({ error: "Niche and Platform are required" }, { status: 400 });
        }

        const systemPrompt = `You are a viral social media strategist. Your goal is to generate 20 highly engaging, viral video ideas for a specific niche and platform.
    
    Platform: ${platform}
    Niche: ${niche}
    
    The ideas should be:
    1. Scroll-stopping: Catch attention in the first 3 seconds.
    2. Shareable: Provide value, entertainment, or relatability.
    3. Trendy: Leverage natural human psychology and current social media trends.
    4. Actionable: Easy for the creator to understand and execute.
    
    Output must be strictly valid JSON with the following structure:
    {
      "ideas": [
        {
          "title": "Hooky Title",
          "hook": "The first sentence/visual to grab attention",
          "description": "Brief summary of the video content",
          "whyItWorks": "Psychological reason why this will go viral"
        }
      ]
    }
    
    Generate exactly 20 ideas.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Generate 20 viral ideas for the ${niche} niche on ${platform}.` }
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        // Increment usage (this counts as a generation)
        await incrementUserUsage(userId);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error generating viral ideas:", error);
        return NextResponse.json(
            { error: "Failed to generate viral ideas" },
            { status: 500 }
        );
    }
}
