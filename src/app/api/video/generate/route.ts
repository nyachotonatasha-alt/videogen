import { NextResponse } from "next/server";
import OpenAI from "openai";

const baseURL = process.env.OPENAI_BASE_URL || "https://models.github.ai";
const openai = new OpenAI({
    apiKey: process.env.GITHUB_VIDEO_TOKEN || process.env.OPENAI_API_KEY || "dummy-key",
    baseURL: baseURL,
});

export async function POST(req: Request) {
    try {
        const { script, prompt } = await req.json();

        console.log("[Video Gen] Using GitHub Models (ChatGPT-5 logic) for orchestration");

        // Use the flagship GPT-4o for "ChatGPT-5" level script refinement
        // This model is guaranteed to be found on GitHub Models
        const refinement = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a professional AI video prompt engineer. Convert the following ad script into a highly detailed visual prompt for a text-to-video AI. Focus on cinematic 4k quality, dynamic camera movements, and hyper-realistic marketing visuals."
                },
                {
                    role: "user",
                    content: `Ad Script: ${script || prompt}`
                }
            ],
        });

        const refinedPrompt = refinement.choices[0].message.content || script || prompt;
        console.log("[Video Gen] Prompt Refined by GPT-4o");

        try {
            // Attempting to use the Sora-2 model on GitHub
            // Note: If your account doesn't have Sora access yet, this will fail 404/400
            const videoJob = await (openai as any).videos.generate({
                model: "sora-2",
                prompt: refinedPrompt,
                size: "1280x720",
            });

            console.log("[Video Gen] Sora job started:", videoJob.id);

            return NextResponse.json({
                video_id: videoJob.id,
                status: "processing",
                message: "Sora video generation started via GitHub Models"
            });
        } catch (soraError: any) {
            console.warn("[Video Gen] Sora model not accessible on this token:", soraError.message);

            // If Sora is not available, we have to use a fallback or explain
            return NextResponse.json(
                {
                    error: "The Sora video model is currently in private preview on GitHub. " +
                        "To use video without Hugging Face, your token needs Sora-2 permissions. " +
                        "Please check your GitHub Models Marketplace access."
                },
                { status: 403 }
            );
        }
    } catch (error: any) {
        console.error("Error initiating generation:", error);
        return NextResponse.json(
            { error: error.message || "Failed to initiate video generation" },
            { status: 500 }
        );
    }
}
