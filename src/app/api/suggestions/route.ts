import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email, message } = await req.json();

        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your_key_here") {
            return NextResponse.json(
                { error: "Resend API Key is not configured. Please add it to your .env.local file." },
                { status: 400 }
            );
        }

        const { data, error } = await resend.emails.send({
            from: "Hytec Ad Gen <onboarding@resend.dev>", // Note: For dev, you must use this sender. For prod, set up a custom domain.
            to: ["hyteccorp@gmail.com", "wayneandkudzimoyos@gmail.com"],
            subject: "New Suggestion - Hytec Ad Gen",
            replyTo: email || "no-reply@hytecadgen.com",
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #6366f1;">New Suggestion Received</h2>
                    <p><strong>From:</strong> ${email || "Anonymous"}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="white-space: pre-wrap;">${message}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999;">This email was sent from your suggestion form on Hytec Ad Gen.</p>
                </div>
            `,
        });

        if (error) {
            console.error("Resend API Error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, id: data?.id });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json(
            { error: "Failed to send suggestion" },
            { status: 500 }
        );
    }
}
