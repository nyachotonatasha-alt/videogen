import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI for GitHub Models using the dedicated video token
const baseURL = process.env.OPENAI_BASE_URL || "https://models.inference.ai.azure.com";
const openai = new OpenAI({
    apiKey: process.env.GITHUB_VIDEO_TOKEN || process.env.OPENAI_API_KEY || "dummy-key",
    baseURL: baseURL,
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get("video_id");

        if (!videoId) {
            return NextResponse.json({ error: "Missing video_id" }, { status: 400 });
        }

        console.log("[Video Status] Polling Sora Job:", videoId);

        // Retrieve the video job status from GitHub Models / Sora API
        // In 2026, the retrieve method returns the job status and final URL
        const videoJob = await (openai as any).videos.retrieve(videoId);

        if (videoJob.status === "completed" || videoJob.status === "succeeded") {
            return NextResponse.json({
                status: "completed",
                video_url: videoJob.video.url, // Standard Sora API response structure
                progress: 100,
                message: "Generated successfully using GitHub Sora-2"
            });
        }

        if (videoJob.status === "failed") {
            return NextResponse.json({
                status: "failed",
                error: videoJob.error?.message || "Sora generation failed"
            });
        }

        // Return processing status
        return NextResponse.json({
            status: "processing",
            progress: videoJob.progress || 50,
            message: `Sora is rendering: ${videoJob.status}...`
        });

    } catch (error: any) {
        console.error("Error in Sora status check:", error);
        return NextResponse.json(
            { error: error.message || "Failed to check generation status" },
            { status: 500 }
        );
    }
}

