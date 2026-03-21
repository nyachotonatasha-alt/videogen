import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email, campaignData } = await req.json();

        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your_key_here") {
            return NextResponse.json(
                { error: "Resend API Key is not configured." },
                { status: 400 }
            );
        }

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Format the content
        let hooksHtml = campaignData.hooks?.map((h: string) => `<li>${h}</li>`).join('') || "No hooks generated.";
        let scripts30Html = campaignData.scripts30?.map((s: any) => `
            <div style="margin-bottom: 20px; padding: 15px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h3 style="margin-top: 0; color: #6366f1;">${s.title} (30s)</h3>
                <pre style="white-space: pre-wrap; font-family: sans-serif; font-size: 14px; color: #4b5563;">${s.script}</pre>
            </div>
        `).join('') || "";

        let scripts15Html = campaignData.scripts15?.map((s: any) => `
            <div style="margin-bottom: 20px; padding: 15px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h3 style="margin-top: 0; color: #6366f1;">${s.title} (15s)</h3>
                <pre style="white-space: pre-wrap; font-family: sans-serif; font-size: 14px; color: #4b5563;">${s.script}</pre>
            </div>
        `).join('') || "";

        const { data, error } = await resend.emails.send({
            from: "Hytec Ad Gen <onboarding@resend.dev>",
            to: [email],
            subject: `Your Ad Campaign: ${campaignData.productName || 'Generated Assets'}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <div style="background: #000; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="color: #fff; margin: 0; letter-spacing: 2px;">HYTEC AD GEN</h1>
                    </div>
                    <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                        <h2 style="color: #111;">Your campaign assets are ready!</h2>
                        <p style="color: #666; line-height: 1.6;">We've attached your AI-generated hooks and scripts for <strong>${campaignData.productName}</strong>.</p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                        
                        <h3 style="text-transform: uppercase; font-size: 14px; color: #999; margin-bottom: 15px;">Viral Hooks</h3>
                        <ul style="padding-left: 20px; color: #4b5563;">
                            ${hooksHtml}
                        </ul>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                        
                        <h3 style="text-transform: uppercase; font-size: 14px; color: #999; margin-bottom: 15px;">Video Scripts</h3>
                        ${scripts30Html}
                        ${scripts15Html}
                        
                        <div style="margin-top: 40px; text-align: center;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Create Another Campaign</a>
                        </div>
                    </div>
                    <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
                        &copy; ${new Date().getFullYear()} Hytec Ad Gen. All rights reserved.
                    </p>
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
            { error: "Failed to send email" },
            { status: 500 }
        );
    }
}
