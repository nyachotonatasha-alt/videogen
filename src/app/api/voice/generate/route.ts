import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text, voiceId = "21m00Tcm4TlvDq8ikWAM" } = await req.json(); // Default to "Rachel" voice
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!apiKey || apiKey === "your_elevenlabs_api_key_here") {
            return NextResponse.json(
                { error: "ElevenLabs API Key is not configured." },
                { status: 400 }
            );
        }

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: "POST",
            headers: {
                "xi-api-key": apiKey,
                "Content-Type": "application/json",
                "accept": "audio/mpeg",
            },
            body: JSON.stringify({
                text,
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail?.status || "Voice generation failed" }, { status: response.status });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Return the audio as a stream
        return new Response(buffer, {
            headers: {
                "Content-Type": "audio/mpeg",
            },
        });
    } catch (error) {
        console.error("Error generating voice:", error);
        return NextResponse.json(
            { error: "Failed to generate voiceover" },
            { status: 500 }
        );
    }
}
