"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Loader2, Sparkles, BarChart2, Shield } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function UsageTab() {
    const { user } = useUser();
    const [status, setStatus] = useState({ tier: 'FREE', usage: 0, limit: 3 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/user/status');
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data);
                }
            } catch (e) {
                console.error("Failed to fetch status");
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const usagePercent = Math.min((status.usage / status.limit) * 100, 100);
    const checkoutUrl = `https://hytecadgen.lemonsqueezy.com/checkout/buy/ea7e79ca-2ea7-41e5-ae2b-b9ee2046b9e9?checkout[custom][userId]=${user?.id || ''}`;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <Card className="glass-card border-white/10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BarChart2 className="h-32 w-32" />
                </div>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold uppercase">
                        <BarChart2 className="h-6 w-6 text-primary" />
                        Account Usage
                    </CardTitle>
                    <CardDescription>
                        Monitor your daily script generations and account limits.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                                {status.tier === 'FREE' ? <Shield className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                            </div>
                            <h3 className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">Current Plan</h3>
                            <p className="text-3xl font-black uppercase text-white">{status.tier}</p>
                        </div>
                        <div className="flex-[2] bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">Daily Credits</h3>
                                    <p className="text-3xl font-black text-white">{status.usage} <span className="text-lg text-muted-foreground font-medium">/ {status.limit}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-primary">{status.limit - status.usage} Remaining</p>
                                </div>
                            </div>
                            <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000"
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>
                            {status.usage >= status.limit && status.tier === 'FREE' && (
                                <p className="mt-4 text-xs font-bold text-red-400 uppercase tracking-wide flex items-center gap-1">
                                    <Zap className="h-3 w-3" /> Daily limit reached. You must upgrade to continue.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
                {status.tier === 'FREE' && (
                    <CardFooter className="bg-primary/5 border-t border-primary/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-center md:text-left">
                            <h4 className="font-bold text-lg flex items-center gap-2 justify-center md:justify-start">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Unlock Your True Potential
                            </h4>
                            <p className="text-sm text-muted-foreground">Unlimited generations, Pro hooks, and priority support.</p>
                        </div>
                        <Button variant="premium" className="w-full md:w-auto px-8" asChild>
                            <a href={checkoutUrl}>Upgrade to PRO</a>
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
