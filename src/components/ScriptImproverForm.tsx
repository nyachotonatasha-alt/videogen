"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Wand2, Rocket, Share2, Target, CheckCircle2, FileText, Zap, Heart, MessageSquare, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ImprovedResult {
    improvedScript: string;
    changesMade: string[];
    viralScore: number;
}

const Switch = ({ checked, onCheckedChange }: { checked: boolean, onCheckedChange: (val: boolean) => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            checked ? "bg-primary" : "bg-white/10"
        )}
    >
        <span
            className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
                checked ? "translate-x-5" : "translate-x-0"
            )}
        />
    </button>
);

export function ScriptImproverForm() {
    const [userStatus, setUserStatus] = useState({ tier: 'FREE', usage: 0, limit: 1 });
    const [loading, setLoading] = useState(false);
    const [script, setScript] = useState("");
    const [options, setOptions] = useState({
        makeShort: true,
        addEmotion: true,
        addStorytelling: true,
    });
    const [result, setResult] = useState<ImprovedResult | null>(null);
    const [copied, setCopied] = useState(false);

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
        if (!script.trim()) return;
        
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/improve-script", {
                method: "POST",
                body: JSON.stringify({ script, options }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setResult(data);
                // Refresh status
                const statusRes = await fetch('/api/user/status');
                if (statusRes.ok) {
                    const status = await statusRes.json();
                    setUserStatus(status);
                }
            } else {
                console.error("Failed to improve script");
            }
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.improvedScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <Card className="w-full max-w-3xl mx-auto glass-card border-white/10 shadow-2xl relative overflow-hidden bg-white/5 backdrop-blur-md">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Zap className="h-32 w-32 text-primary" />
                </div>
                
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2 text-3xl font-black italic uppercase tracking-tighter">
                        <Wand2 className="h-8 w-8 text-primary animate-pulse" />
                        Script <span className="text-primary">Alchemist</span>
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground/80 font-medium">
                        Turn boring scripts into viral gold with AI precision.
                    </CardDescription>
                    
                    <div className="mt-4 px-6 max-w-xs mx-auto">
                        <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground uppercase font-black tracking-widest">Daily Credits</span>
                            <span className="font-black text-primary">{userStatus.usage} / {userStatus.limit}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-1000"
                                style={{ width: `${Math.min((userStatus.usage / userStatus.limit) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-8">
                        <div className="space-y-3">
                            <Label htmlFor="script" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 flex items-center gap-2">
                                <FileText className="h-3 w-3" /> Input Raw Content
                            </Label>
                            <Textarea
                                id="script"
                                placeholder="Paste your draft or raw notes... The more context, the better."
                                required
                                className="bg-black/20 border-white/5 min-h-[180px] focus:ring-primary/40 focus:border-primary/40 transition-all rounded-2xl resize-none p-5 text-base placeholder:text-muted-foreground/30 shadow-inner"
                                value={script}
                                onChange={(e) => setScript(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div 
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                                    options.makeShort ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/5 hover:border-white/10"
                                )}
                                onClick={() => setOptions({...options, makeShort: !options.makeShort})}
                            >
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                                        <Zap className={cn("h-3 w-3 transition-colors", options.makeShort ? "text-yellow-400" : "text-muted-foreground")} /> 
                                        Trim Fluff
                                    </Label>
                                    <p className="text-[10px] text-muted-foreground font-medium text-green-400/80">FREE FEATURE</p>
                                </div>
                                <Switch checked={options.makeShort} onCheckedChange={(val) => setOptions({...options, makeShort: val})} />
                            </div>

                            <div 
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group relative",
                                    options.addEmotion ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/5 hover:border-white/10",
                                    userStatus.tier === 'FREE' && "opacity-60 grayscale-[0.5]"
                                )}
                                onClick={() => {
                                    if (userStatus.tier === 'FREE') return;
                                    setOptions({...options, addEmotion: !options.addEmotion});
                                }}
                            >
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                                            <Heart className={cn("h-3 w-3 transition-colors", options.addEmotion ? "text-red-400" : "text-muted-foreground")} /> 
                                            Add Soul
                                        </Label>
                                        {userStatus.tier === 'FREE' && (
                                            <span className="text-[8px] font-black bg-primary text-white px-1.5 py-0.5 rounded italic">PRO</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium">Emotional Hook</p>
                                </div>
                                <Switch checked={options.addEmotion} onCheckedChange={(val) => {
                                    if (userStatus.tier === 'FREE') return;
                                    setOptions({...options, addEmotion: val});
                                }} />
                                {userStatus.tier === 'FREE' && (
                                    <Link href="/pricing" className="absolute inset-0 z-10" />
                                )}
                            </div>

                            <div 
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group relative",
                                    options.addStorytelling ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/5 hover:border-white/10",
                                    userStatus.tier === 'FREE' && "opacity-60 grayscale-[0.5]"
                                )}
                                onClick={() => {
                                    if (userStatus.tier === 'FREE') return;
                                    setOptions({...options, addStorytelling: !options.addStorytelling});
                                }}
                            >
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                                            <MessageSquare className={cn("h-3 w-3 transition-colors", options.addStorytelling ? "text-blue-400" : "text-muted-foreground")} /> 
                                            Story Arc
                                        </Label>
                                        {userStatus.tier === 'FREE' && (
                                            <span className="text-[8px] font-black bg-primary text-white px-1.5 py-0.5 rounded italic">PRO</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium">Narrative Drive</p>
                                </div>
                                <Switch checked={options.addStorytelling} onCheckedChange={(val) => {
                                    if (userStatus.tier === 'FREE') return;
                                    setOptions({...options, addStorytelling: val});
                                }} />
                                {userStatus.tier === 'FREE' && (
                                    <Link href="/pricing" className="absolute inset-0 z-10" />
                                )}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-4 pb-10 px-8">
                        <Button
                            type="submit"
                            className="w-full h-16 text-lg font-black uppercase italic tracking-widest shadow-2xl shadow-primary/30 group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-700 active:scale-[0.98]"
                            disabled={loading || !script.trim()}
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                                    <span>Synthesizing Virality...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-6 w-6 group-hover:rotate-180 transition-transform duration-700" />
                                    <span>Optimize Masterpiece</span>
                                </div>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {loading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="max-w-md w-full p-8 text-center space-y-10">
                        <div className="relative mx-auto w-32 h-32">
                            <div className="absolute inset-0 rounded-full border-[1px] border-primary/10 animate-ping" />
                            <div className="absolute inset-2 rounded-full border-4 border-primary/20" />
                            <div className="absolute inset-2 rounded-full border-4 border-t-primary animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Rocket className="h-12 w-12 text-primary animate-bounce" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
                                Engineering <span className="text-primary italic underline decoration-primary/30 underline-offset-8">Output</span>
                            </h2>
                            <div className="flex flex-col gap-2">
                                <p className="text-muted-foreground animate-pulse text-[10px] font-black tracking-[0.4em] uppercase">
                                    Optimizing Hook Dynamics
                                </p>
                                <p className="text-primary/40 text-[9px] font-bold uppercase tracking-widest">
                                    Running Viral Simulation 4.0
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <div className="space-y-10 max-w-5xl mx-auto pb-24 animate-in slide-in-from-bottom-12 duration-1000 ease-out">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter">
                                The <span className="text-primary">Viral Blueprint</span>
                            </h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Output synthesized successfully</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-full flex flex-col items-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary/70">Potential Reach</span>
                                <span className="text-xl font-black text-white leading-none">{result.viralScore}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                        <Card className="lg:col-span-4 glass-card border-white/10 overflow-hidden group bg-white/5 backdrop-blur-md relative">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-600 to-blue-600" />
                            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary/80">Refined Script</CardTitle>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className={cn(
                                        "h-9 px-4 rounded-full border border-white/5 text-[10px] font-bold uppercase tracking-widest transition-all",
                                        copied ? "bg-green-500/20 text-green-400 border-green-500/20" : "bg-white/5 text-white/70 hover:bg-white/10"
                                    )}
                                    onClick={copyToClipboard}
                                >
                                    {copied ? (
                                        <CheckCircle2 className="h-3 w-3 mr-2" />
                                    ) : (
                                        <Copy className="h-3 w-3 mr-2" />
                                    )}
                                    {copied ? "Copied" : "Copy to Clipboard"}
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-8 md:p-10 leading-relaxed whitespace-pre-wrap text-lg md:text-xl text-white/90 font-semibold selection:bg-primary/30 selection:text-white">
                                    {result.improvedScript}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-black/20 border-t border-white/5 p-4 justify-between items-center">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse delay-75" />
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150" />
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Optimized for high retention</span>
                            </CardFooter>
                        </Card>

                        <div className="lg:col-span-3 space-y-6">
                            <Card className="glass-card border-white/10 bg-white/5">
                                <CardHeader className="py-4 border-b border-white/5">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400 flex items-center gap-2">
                                        <Target className="h-3 w-3" /> Core Enhancements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5 pt-6">
                                    {result.changesMade.map((change, i) => (
                                        <div key={i} className="flex gap-4 items-start group">
                                            <div className="h-6 w-6 rounded-lg bg-green-400/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-400/20 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="h-3 w-3 text-green-400" />
                                            </div>
                                            <p className="text-sm text-neutral-300 font-medium leading-tight">{change}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-primary/20 bg-primary/10 overflow-hidden relative">
                                <div className="absolute -right-4 -bottom-4 opacity-10">
                                    <Sparkles className="h-24 w-24 text-primary" />
                                </div>
                                <CardContent className="pt-8 pb-8">
                                    <div className="space-y-4">
                                        <div className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Viral Strategist Tip</p>
                                        </div>
                                        <p className="text-base italic text-white/90 font-medium leading-relaxed">
                                            "The first 3 words of this script are designed to disrupt the user's scroll. Do not change them."
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Button
                                className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 group"
                                onClick={() => setResult(null)}
                            >
                                <Rocket className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                                Start New Iteration
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
