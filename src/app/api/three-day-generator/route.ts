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

        const systemPrompt = `You are an expert social media strategist. Your goal is to generate a highly engaging 3-day content plan for a specific niche and platform.
    
    Platform: ${platform}
    Niche: ${niche}
    
    The 3-day plan must follow exactly this sequence:
    Day 1: AI tool review
    Day 2: Productivity hack
    Day 3: Viral comparison
    
    The ideas should be:
    1. Scroll-stopping: Catch attention in the first 3 seconds.
    2. Shareable: Provide value, entertainment, or relatability.
    3. Trendy: Leverage natural human psychology and current social media trends.
    4. Actionable: Easy for the creator to understand and execute.
    
    Output must be strictly valid JSON with the following structure:
    {
      "plan": [
        {
          "day": "Day 1",
          "theme": "AI Tool Review",
          "title": "Hooky Title",
          "hook": "The first sentence/visual to grab attention",
          "description": "Brief summary of the video content",
          "whyItWorks": "Psychological reason why this will go viral"
        },
        {
          "day": "Day 2",
          "theme": "Productivity Hack",
          "title": "Hooky Title",
          "hook": "The first sentence/visual to grab attention",
          "description": "Brief summary of the video content",
          "whyItWorks": "Psychological reason why this will go viral"
        },
        {
          "day": "Day 3",
          "theme": "Viral Comparison",
          "title": "Hooky Title",
          "hook": "The first sentence/visual to grab attention",
          "description": "Brief summary of the video content",
          "whyItWorks": "Psychological reason why this will go viral"
        }
      ]
    }
    
    Generate exactly these 3 ideas tailored to the ${niche} niche on ${platform}.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Generate the 3-day content plan for the ${niche} niche on ${platform}.` }
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        // Increment usage (this counts as a generation)
        await incrementUserUsage(userId);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error generating 3-day plan:", error);
        return NextResponse.json(
            { error: "Failed to generate 3-day plan" },
            { status: 500 }
        );
    }
}
