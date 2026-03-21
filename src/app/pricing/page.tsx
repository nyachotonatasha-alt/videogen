"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Zap, Shield } from "lucide-react";
import { PLANS } from "@/lib/stripe";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function PricingPage() {
    const { isSignedIn, user } = useUser();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">
                            Choose Your <span className="text-primary italic">Power Level</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Scale your ad production with AI-powered strategies. No more creative blocks.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <Card className="glass-card border-white/10 relative overflow-hidden transition-all hover:scale-[1.02] hover:border-primary/30">
                            <CardHeader>
                                <div className="p-3 w-fit rounded-lg bg-white/5 mb-4 text-muted-foreground">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl font-bold uppercase">{PLANS.FREE.name}</CardTitle>
                                <CardDescription>Perfect for trying out our AI engine.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">$0</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                                <ul className="space-y-3">
                                    {PLANS.FREE.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm">
                                            <Check className="h-4 w-4 text-primary shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full h-12" asChild>
                                    <a href="/dashboard">Current Plan</a>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Pro Plan */}
                        <Card className="glass-card border-primary/40 relative overflow-hidden transition-all hover:scale-[1.02] bg-primary/5 shadow-2xl shadow-primary/10">
                            <div className="absolute top-0 right-0 p-2">
                                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">Popular</span>
                            </div>
                            <CardHeader>
                                <div className="p-3 w-fit rounded-lg bg-primary/10 mb-4 text-primary">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl font-bold uppercase">{PLANS.PRO.name}</CardTitle>
                                <CardDescription>For growing brands and creators.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">${PLANS.PRO.price}</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                                <ul className="space-y-3">
                                    {PLANS.PRO.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                            <Check className="h-4 w-4 text-primary shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                {isSignedIn ? (
                                    <Button variant="premium" className="w-full h-12" asChild>
                                        <a href={`https://hytecadgen.lemonsqueezy.com/checkout/buy/ea7e79ca-2ea7-41e5-ae2b-b9ee2046b9e9?checkout[custom][userId]=${user?.id || ''}`}>
                                            Get Pro Now
                                        </a>
                                    </Button>
                                ) : (
                                    <SignInButton mode="modal">
                                        <Button variant="premium" className="w-full h-12">Sign In to Upgrade</Button>
                                    </SignInButton>
                                )}
                            </CardFooter>
                        </Card>


                    </div>

                    <div className="mt-20 max-w-4xl mx-auto text-center p-8 rounded-3xl bg-primary/5 border border-primary/10">
                        <Sparkles className="h-10 w-10 text-primary mx-auto mb-4 animate-pulse" />
                        <h3 className="text-2xl font-bold mb-4 uppercase">Custom Enterprise Plans</h3>
                        <p className="text-muted-foreground mb-6">
                            Need more than unlimited? We offer API access and custom model training for large agencies.
                        </p>
                        <Button variant="link" className="text-primary font-bold">Contact Sales</Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
