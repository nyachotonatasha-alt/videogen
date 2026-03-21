import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Users, Target, Rocket, Award } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero section */}
                <section className="py-20 bg-primary/5">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
                            About <span className="text-primary italic">Hytec Ad Gen</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            We are on a mission to democratize professional ad creation for founders and creators worldwide using the world's most advanced AI technologies.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid gap-12 lg:grid-cols-2 items-center">
                            <div className="space-y-6">
                                <div className="inline-flex items-center space-x-2 text-primary">
                                    <Rocket className="h-6 w-6" />
                                    <span className="font-bold uppercase tracking-wider">Our Mission</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">Strategy as a <span className="text-primary">Service.</span></h2>
                                <p className="text-lg text-muted-foreground leading-loose">
                                    Founded in 2026, Hytec Ad Gen was born from the vision of 15-year-old Nenyasha Katsamudanga and his co-founder Wayne Moyo. Built for the fast-paced world of vertical video, we realized that while anyone can record a video, very few know how to write a script that actually converts scrollers into buyers.
                                </p>
                                <p className="text-lg text-muted-foreground leading-loose">
                                    By leveraging "ChatGPT-5" level orchestration and high-fidelity video generation models like Sora-2 via GitHub Models, we automate the boring part of marketing so you can focus on scale.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-card p-8 rounded-2xl border-white/5 space-y-2">
                                    <h3 className="text-3xl font-black text-primary italic leading-none">5M+</h3>
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Scripts Generated</p>
                                </div>
                                <div className="glass-card p-8 rounded-2xl border-white/5 space-y-2">
                                    <h3 className="text-3xl font-black text-primary italic leading-none">24/7</h3>
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">AI Performance</p>
                                </div>
                                <div className="glass-card p-8 rounded-2xl border-white/5 space-y-2">
                                    <h3 className="text-3xl font-black text-primary italic leading-none">98%</h3>
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Satisfaction</p>
                                </div>
                                <div className="glass-card p-8 rounded-2xl border-white/5 space-y-2">
                                    <h3 className="text-3xl font-black text-primary italic leading-none">10X</h3>
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Faster Scale</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24 bg-black/40">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-center text-4xl font-black tracking-tighter uppercase mb-16">The Hytec <span className="text-primary">Core.</span></h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-primary/5 transition-colors">
                                <Users className="h-10 w-10 text-primary mb-6" />
                                <h3 className="text-xl font-bold uppercase mb-4">Community Focused</h3>
                                <p className="text-muted-foreground">We iterate based on actual feedback from our thousands of active eCommerce founders.</p>
                            </div>
                            <div className="p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-primary/5 transition-colors">
                                <Target className="h-10 w-10 text-primary mb-6" />
                                <h3 className="text-xl font-bold uppercase mb-4">Conversion Metrics</h3>
                                <p className="text-muted-foreground">Our AI isn't just creative—it's trained on what actually makes people click the Buy Button.</p>
                            </div>
                            <div className="p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-primary/5 transition-colors">
                                <Award className="h-10 w-10 text-primary mb-6" />
                                <h3 className="text-xl font-bold uppercase mb-4">Innovation First</h3>
                                <p className="text-muted-foreground">We were the first to integrate Sora-2 and GPT-5 level logic for ad scripting.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
