import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-20">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-8 border-b border-primary/20 pb-4">
                        Privacy <span className="text-primary italic">Policy</span>
                    </h1>

                    <div className="space-y-8 text-muted-foreground leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">1. Introduction</h2>
                            <p>
                                At Hytec Ad Gen, we value your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our AI-powered video ad generation platform.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">2. Information We Collect</h2>
                            <p>
                                We collect information that you provide directly to us, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Account details (name, email via Clerk authentication)</li>
                                <li>Product data (URLs, descriptions, images) you upload for ad generation</li>
                                <li>Usage data and preferences for our AI service</li>
                                <li>Payment information (processed securely via Stripe)</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">3. How We Use Your Data</h2>
                            <p>
                                Your data is used specifically to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide and improve our AI ad generation services</li>
                                <li>Analyze trends and optimize our AI models (anonymized data only)</li>
                                <li>Send transactional emails and campaign results</li>
                                <li>Ensure compliance with our safety and usage policies</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">4. AI Processing</h2>
                            <p>
                                By using Hytec Ad Gen, you acknowledge that your inputs are processed by third-party AI models (including OpenAI and GitHub Models). We do not share your sensitive personal identity with these models beyond what is necessary to generate your requested content.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">5. Data Security</h2>
                            <p>
                                We implement industry-standard security measures, including HTTPS encryption and secure database management via Neon, to protect your data from unauthorized access.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">6. Contact Us</h2>
                            <p>
                                If you have questions about this policy, please contact us at <span className="text-primary underline">hyteccorp@gmail.com</span>.
                            </p>
                        </section>

                        <p className="text-sm italic pt-8 border-t border-white/5">
                            Last Updated: February 2026
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
