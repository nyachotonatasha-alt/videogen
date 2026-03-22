"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Wand2, Rocket, Share2, Target, CheckCircle2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { PaywallModal } from "@/components/PaywallModal";

interface ThreeDayIdea {
    day: string;
    theme: string;
    title: string;
    hook: string;
    description: string;
    whyItWorks: string;
}

export function ThreeDayGeneratorForm() {
    const { user } = useUser();
    const [userStatus, setUserStatus] = useState({ tier: 'FREE', usage: 0, limit: 1 });
    const [showPaywall, setShowPaywall] = useState(false);
    const [paywallMessage, setPaywallMessage] = useState("Upgrade to Pro to access this feature.");
    const [loading, setLoading] = useState(false);
    const [niche, setNiche] = useState("");
    const [platform, setPlatform] = useState("tiktok");
    const [plan, setPlan] = useState<ThreeDayIdea[]>([]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/user/status');
                if (res.ok) {
                    const status = await res.json();
                    setUserStatus(status);
                }
            } catch (e) {
                console.error("Failed to fetch status");
            }
        };
        fetchStatus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userStatus.tier === 'FREE' && userStatus.usage >= userStatus.limit) {
            setPaywallMessage("You have reached your daily limit of 3 free plans. Upgrade to Pro for unlimited access.");
            setShowPaywall(true);
            return;
        }

        setLoading(true);
        setPlan([]);

        try {
            const response = await fetch("/api/three-day-generator", {
                method: "POST",
                body: JSON.stringify({ niche, platform }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPlan(data.plan || []);
                // Refresh status
                const statusRes = await fetch('/api/user/status');
                if (statusRes.ok) {
                    const status = await statusRes.json();
                    setUserStatus(status);
                }
            } else {
                const errData = await response.json().catch(() => ({}));
                if (errData.limitReached) {
                    setPaywallMessage(errData.error || "Daily limit reached. Upgrade for more.");
                    setShowPaywall(true);
                } else {
                    console.error("Failed to generate 3-day plan");
                }
            }
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <Card className="w-full max-w-2xl mx-auto glass-card border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Rocket className="h-24 w-24 text-primary" />
                </div>
                
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
                        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                        3-Day Growth Challenge
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground/80">
                        Get a proven 3-day content plan: AI Review, Productivity Hack & Viral Comparison.
                    </CardDescription>
                    <div className="mt-4 px-6 max-w-sm mx-auto">
                        <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground uppercase font-bold tracking-widest">Daily Credits</span>
                            <span className="font-bold">{userStatus.usage} / {userStatus.limit}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div
                                className="h-full bg-primary transition-all duration-1000"
                                style={{ width: `${Math.min((userStatus.usage / userStatus.limit) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="niche" className="text-sm font-bold uppercase tracking-widest text-primary/80">
                                Your Niche / Topic
                            </Label>
                            <Input
                                id="niche"
                                placeholder="e.g. AI SaaS, Sustainable Fashion, Fitness for Busy Dads"
                                required
                                className="bg-white/5 border-white/10 h-12 focus:ring-primary/50 transition-all rounded-xl"
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold uppercase tracking-widest text-primary/80">
                                Target Platform
                            </Label>
                            <Select
                                value={platform}
                                onValueChange={(val) => setPlatform(val)}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 h-12 focus:ring-primary/50 transition-all rounded-xl">
                                    <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-white/10">
                                    <SelectItem value="tiktok">TikTok</SelectItem>
                                    <SelectItem value="instagram">Instagram Reels</SelectItem>
                                    <SelectItem value="youtube">YouTube Shorts</SelectItem>
                                    <SelectItem value="facebook">Facebook Ads</SelectItem>
                                    <SelectItem value="linkedin">LinkedIn Video</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-4 pb-8">
                        <Button
                            type="submit"
                            className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Generating 3-Day Plan...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Wand2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                    <span>Unlock 3-Day Growth Plan</span>
                                </div>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="max-w-md w-full p-8 text-center space-y-8">
                        <div className="relative mx-auto w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Rocket className="h-10 w-10 text-primary animate-bounce" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white">
                                Crafting Your <span className="text-primary italic">Strategy</span>
                            </h2>
                            <p className="text-muted-foreground animate-pulse text-xs font-bold tracking-[0.3em] uppercase">
                                Analyzing Algorithmic Patterns
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {plan.length > 0 && (
                <div className="space-y-8 max-w-6xl mx-auto pb-12">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                            The <span className="text-primary">3-Day Plan</span>
                        </h3>
                        <div className="text-xs font-bold text-muted-foreground uppercase bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            Ready to Post
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plan.map((idea, index) => (
                            <Card key={index} className="glass-card border-white/5 hover:border-primary/40 transition-all duration-500 group relative flex flex-col h-full overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                                
                                <CardHeader className="flex-none">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                            {idea.day}: {idea.theme}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">
                                        {idea.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4 flex-grow">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-primary/10 transition-colors">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-2 flex items-center gap-2">
                                            <Target className="h-3 w-3" /> The Hook
                                        </p>
                                        <p className="text-sm italic font-semibold text-white/90 leading-relaxed">
                                            "{idea.hook}"
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Concept</p>
                                        <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                                            {idea.description}
                                        </p>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-4 mt-auto border-t border-white/5 bg-white/[0.02]">
                                    <div className="w-full">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-green-400 mb-1 flex items-center gap-2">
                                            <CheckCircle2 className="h-3 w-3" /> Psychological Trigger
                                        </p>
                                        <p className="text-[11px] text-neutral-500 italic">
                                            {idea.whyItWorks}
                                        </p>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} userId={user?.id} message={paywallMessage} />
        </div>
    );
}
