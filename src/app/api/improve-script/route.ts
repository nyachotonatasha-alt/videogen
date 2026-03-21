import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { incrementUserUsage, checkUserLimit, getUserSubscription } from "@/lib/subscription";

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
        const { isAllowed, limit, tier } = await checkUserLimit(userId);
        if (!isAllowed) {
            return NextResponse.json({ 
                error: `Daily limit reached (${limit}/day for FREE). Upgrade for more.`,
                limitReached: true
            }, { status: 403 });
        }

        const { script, options } = await req.json();

        // Feature gating
        if (tier === 'FREE') {
            if (options.addEmotion || options.addStorytelling) {
                return NextResponse.json({ error: "Premium features restricted for FREE tier." }, { status: 403 });
            }
        }

        if (!script) {
            return NextResponse.json({ error: "Script is required" }, { status: 400 });
        }

        const improvementDirectives = [];
        if (options.makeShort) improvementDirectives.push("Make it short, punchy, and remove all fluff. Every word must earn its place.");
        if (options.addEmotion) improvementDirectives.push("Infuse it with genuine emotion, vulnerability, or high energy to build a human connection.");
        if (options.addStorytelling) improvementDirectives.push("Structure it with a clear narrative arc: Hook -> Conflict/Problem -> Solution -> Result.");

        const systemPrompt = `You are a world-class viral video scriptwriter for platforms like TikTok, Instagram Reels, and YouTube Shorts. 
Your goal is to transform a raw script into a high-retention, viral masterpiece.

DIRECTIVES:
${improvementDirectives.map((d, i) => `${i + 1}. ${d}`).join("\n")}

The resulting script should:
- Have a scroll-stopping hook (first 2 seconds).
- Use fast-paced, engaging language.
- Lead naturally to a strong call to action.

Output MUST be a strictly valid JSON object with the following structure:
{
  "improvedScript": "The complete refined script text",
  "changesMade": ["Concise list of 3-4 specific improvements you made"],
  "viralScore": 85-99
}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Here is my raw script:\n\n${script}\n\nApply the directives and make it viral.` }
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        // Increment usage
        await incrementUserUsage(userId);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error improving script:", error);
        return NextResponse.json(
            { error: "Failed to improve script" },
            { status: 500 }
        );
    }
}
