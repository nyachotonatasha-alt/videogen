"use client";

import { useEffect, useState } from "react";
import { Copy, Video, FileText, Zap, Target, Loader2, MessageSquare, Download, Star, Trash2, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, Mail } from "lucide-react";

export function ResultsView() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [videoLoading, setVideoLoading] = useState(false);
    const [videoId, setVideoId] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoStatus, setVideoStatus] = useState<string | null>(null);
    const [videoProgress, setVideoProgress] = useState<number>(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioLoading, setAudioLoading] = useState<number | null>(null);
    const [suggestionEmail, setSuggestionEmail] = useState("");
    const [suggestionText, setSuggestionText] = useState("");
    const [isSuggestionSubmitted, setIsSuggestionSubmitted] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const [favorites, setFavorites] = useState<any[]>([]);

    useEffect(() => {
        const savedData = localStorage.getItem("generatedAd");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setData(parsed);
            if (parsed.videoUrl) {
                setVideoUrl(parsed.videoUrl);
            }
        } else {
            router.push("/dashboard");
        }

        const savedFavorites = localStorage.getItem("favoriteScripts");
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, [router]);

    const toggleFavorite = (script: any) => {
        const isFavorite = favorites.some(f => f.script === script.script);
        let newFavorites;
        if (isFavorite) {
            newFavorites = favorites.filter(f => f.script !== script.script);
        } else {
            newFavorites = [...favorites, { ...script, date: new Date().toISOString() }];
        }
        setFavorites(newFavorites);
        localStorage.setItem("favoriteScripts", JSON.stringify(newFavorites));
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const primaryColor = "#6366f1";
        const productName = data.productName || data.analysis?.whatItIs || "Ad Campaign";

        // Header
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 40, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("HYTEC AD GEN", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text("AI-POWERED AD STRATEGY", 105, 30, { align: "center" });

        let yPos = 55;

        // Campaign Title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.text(`Campaign: ${productName}`, 20, yPos);
        yPos += 15;

        // Hooks Section
        doc.setFontSize(14);
        doc.setTextColor(primaryColor);
        doc.text("VIRAL HOOKS", 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        data.hooks?.forEach((hook: string, i: number) => {
            if (yPos > 270) { doc.addPage(); yPos = 20; }
            doc.text(`${i + 1}. ${hook}`, 25, yPos, { maxWidth: 160 });
            yPos += 10;
        });

        yPos += 10;

        // Scripts Section
        doc.setFontSize(14);
        doc.setTextColor(primaryColor);
        doc.text("30-SECOND SCRIPTS", 20, yPos);
        yPos += 10;

        data.scripts30?.forEach((s: any, i: number) => {
            if (yPos > 250) { doc.addPage(); yPos = 20; }
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text(s.title || `Script ${i + 1}`, 20, yPos);
            yPos += 7;

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(80, 80, 80);
            const scriptLines = doc.splitTextToSize(s.script, 170);
            doc.text(scriptLines, 20, yPos);
            yPos += (scriptLines.length * 5) + 15;
        });

        // Add Footer on all pages
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Generated by Hytec Ad Gen - ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
        }

        doc.save(`hytec-campaign-${productName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    };

    const downloadSingle = (script: any) => {
        const content = `HYTEC ADD GEN - SCRIPT EXPORT\n\nTITLE: ${script.title}\n\n${script.script}\n\nGenerated on: ${new Date().toLocaleDateString()}`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hytec-script-${script.title?.replace(/\s+/g, '-').toLowerCase() || 'export'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!data) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    const generateVideo = async (script: string) => {
        // Clear previous video data to ensure "one video only" focus
        setVideoUrl(null);
        setVideoId(null);

        setVideoLoading(true);
        setVideoStatus("Initializing...");
        setVideoProgress(0);
        try {
            const response = await fetch("/api/video/generate", {
                method: "POST",
                body: JSON.stringify({ script }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (data.video_id) {
                setVideoId(data.video_id);
                pollStatus(data.video_id);
            } else {
                alert(data.error || "Failed to start video generation");
                setVideoLoading(false);
            }
        } catch (error) {
            console.error("Error starting video:", error);
            setVideoLoading(false);
        }
    };


    const generateVoice = async (text: string, index: number) => {
        setAudioLoading(index);
        try {
            const response = await fetch("/api/voice/generate", {
                method: "POST",
                body: JSON.stringify({ text }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const data = await response.json();
                alert(data.error || "Failed to generate voiceover");
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);

            // Auto play
            const audio = new Audio(url);
            audio.play();
        } catch (error) {
            console.error("Error generating voice:", error);
        } finally {
            setAudioLoading(null);
        }
    };

    const pollStatus = async (id: string) => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/video/status?video_id=${id}`);
                const data = await response.json();

                // Update status and progress
                setVideoStatus(data.status);
                if (data.progress !== undefined) {
                    setVideoProgress(data.progress);
                } else if (data.status === "processing") {
                    // Fallback progress simulation if API doesn't provide it
                    setVideoProgress(prev => Math.min(prev + 5, 95));
                }

                if (data.status === "completed" || data.status === "success") {
                    setVideoUrl(data.video_url);
                    setVideoLoading(false);
                    setVideoStatus(null);
                    setVideoProgress(100);
                    clearInterval(interval);
                } else if (data.status === "failed" || data.status === "error") {
                    alert("Video generation failed: " + (data.error || "Unknown error"));
                    setVideoLoading(false);
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Polling error:", error);
                clearInterval(interval);
            }
        }, 3000); // Polling faster for better feedback
    };

    const handleSuggestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setVideoLoading(true); // Re-using loading state or we could add a specific one, but let's just send it

        try {
            const response = await fetch("/api/suggestions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: suggestionEmail,
                    message: suggestionText
                }),
            });

            if (response.ok) {
                setIsSuggestionSubmitted(true);
                // Reset after 3 seconds
                setTimeout(() => {
                    setIsSuggestionSubmitted(false);
                    setSuggestionText("");
                    setSuggestionEmail("");
                }, 3000);
            } else {
                const data = await response.json();
                alert(data.error || "Failed to send suggestion");
            }
        } catch (error) {
            console.error("Error submitting suggestion:", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setVideoLoading(false);
        }
    };

    const downloadAll = () => {
        let content = "HYTEC ADD GEN - CAMPAIGN EXPORT\n\n";

        content += "--- HOOKS ---\n";
        data.hooks?.forEach((h: string, i: number) => { content += `${i + 1}. ${h}\n`; });

        content += "\n--- 30s SCRIPTS ---\n";
        data.scripts30?.forEach((s: any, i: number) => {
            content += `\nTITLE: ${s.title}\n${s.script}\n`;
        });

        content += "\n--- 15s SCRIPTS ---\n";
        data.scripts15?.forEach((s: any, i: number) => {
            content += `\nTITLE: ${s.title}\n${s.script}\n`;
        });

        content += "\n--- ANGLES ---\n";
        data.angles?.forEach((a: any, i: number) => {
            content += `${a.name}: ${a.description}\n`;
        });

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hytec-ad-scripts-${data.analysis?.whatItIs?.replace(/\s+/g, '-').toLowerCase() || 'export'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const sendEmailResults = async () => {
        const userEmail = prompt("Enter your email to receive these results:");
        if (!userEmail) return;

        setEmailLoading(true);
        try {
            const response = await fetch("/api/email/results", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    campaignData: {
                        ...data,
                        productName: data.productName || data.analysis?.whatItIs || "Your Ad Campaign"
                    }
                }),
            });

            if (response.ok) {
                setIsEmailSent(true);
                setTimeout(() => setIsEmailSent(false), 3000);
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to send email");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setEmailLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Your Ad Campaign</h2>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={sendEmailResults} disabled={emailLoading}>
                        {emailLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : isEmailSent ? (
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                            <Mail className="mr-2 h-4 w-4" />
                        )}
                        {isEmailSent ? "Sent!" : "Email Me"}
                    </Button>
                    <Button variant="outline" onClick={downloadPDF}>
                        <FileDown className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                    <Button variant="outline" onClick={downloadAll}>
                        <FileText className="mr-2 h-4 w-4" /> Download TXT
                    </Button>
                    <Button variant="premium" onClick={() => router.push("/dashboard")}>
                        Create New
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Target Audience</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary truncate" title={typeof data.analysis?.targetAudience === 'string' ? data.analysis.targetAudience : "N/A"}>
                            {typeof data.analysis?.targetAudience === 'string'
                                ? data.analysis.targetAudience.split(',')?.[0]
                                : Array.isArray(data.analysis?.targetAudience)
                                    ? data.analysis.targetAudience[0]
                                    : "N/A"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Voice Tone</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium uppercase tracking-tighter">{data.voiceoverTone}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="scripts" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="scripts">Scripts</TabsTrigger>
                    <TabsTrigger value="hooks">Hooks</TabsTrigger>
                    <TabsTrigger value="angles">Angles</TabsTrigger>
                    <TabsTrigger value="favorites" className="relative">
                        Favorites
                        {favorites.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                                {favorites.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="video">Final Video</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                </TabsList>

                <TabsContent value="hooks" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top 10 Scroll-Stopping Hooks</CardTitle>
                            <CardDescription>Grab attention in the first 3 seconds.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {data.hooks?.map((hook: string, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                                    <span className="text-sm font-medium">{hook}</span>
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copyToClipboard(hook)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="scripts" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {data.scripts30?.map((script: any, i: number) => (
                            <Card key={i} className="flex flex-col border-primary/10 bg-primary/5">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">{script.title || `30s Script ${i + 1}`}</CardTitle>
                                        <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter">30 SEC</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 whitespace-pre-wrap text-sm text-muted-foreground font-mono bg-black/20 p-4 rounded-md mx-6 mb-4 leading-relaxed">
                                    {script.script}
                                </CardContent>
                                <div className="p-6 pt-0 mt-auto flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm" className="flex-1 min-w-[100px]" onClick={() => copyToClipboard(script.script)}>
                                        <Copy className="mr-2 h-4 w-4" /> Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 min-w-[100px]"
                                        onClick={() => generateVoice(script.script, i)}
                                        disabled={audioLoading === i}
                                    >
                                        {audioLoading === i ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Zap className="mr-2 h-4 w-4" />
                                        )}
                                        Listen
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 min-w-[100px]"
                                        onClick={() => {
                                            generateVideo(script.script);
                                            document.querySelector<HTMLButtonElement>('button[value="video"]')?.click();
                                        }}
                                        disabled={videoLoading}
                                    >
                                        {videoLoading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Video className="mr-2 h-4 w-4" />
                                        )}
                                        Video
                                    </Button>
                                    <div className="w-full flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => downloadSingle(script)}
                                        >
                                            <Download className="mr-2 h-4 w-4" /> Download
                                        </Button>
                                        <Button
                                            variant={favorites.some(f => f.script === script.script) ? "default" : "outline"}
                                            size="sm"
                                            className={`flex-1 ${favorites.some(f => f.script === script.script) ? 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-500' : ''}`}
                                            onClick={() => toggleFavorite(script)}
                                        >
                                            <Star className={`mr-2 h-4 w-4 ${favorites.some(f => f.script === script.script) ? 'fill-current' : ''}`} />
                                            {favorites.some(f => f.script === script.script) ? 'Favorited' : 'Favorite'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {data.scripts15?.map((script: any, i: number) => (
                            <Card key={`15-${i}`} className="flex flex-col border-white/5 bg-white/5">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">{script.title || `Short Script ${i + 1}`}</CardTitle>
                                        <span className="bg-white/10 text-muted-foreground text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter">15 SEC</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 whitespace-pre-wrap text-sm text-muted-foreground font-mono bg-black/40 p-4 rounded-md mx-6 mb-4 leading-relaxed border border-white/5">
                                    {script.script}
                                </CardContent>
                                <div className="p-6 pt-0 mt-auto flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm" className="flex-1 min-w-[100px]" onClick={() => copyToClipboard(script.script)}>
                                        <Copy className="mr-2 h-4 w-4" /> Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 min-w-[100px]"
                                        onClick={() => generateVoice(script.script, i + 100)} // Offset index for loading state
                                        disabled={audioLoading === i + 100}
                                    >
                                        {audioLoading === i + 100 ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Zap className="mr-2 h-4 w-4" />
                                        )}
                                        Listen
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 min-w-[100px]"
                                        onClick={() => {
                                            generateVideo(script.script);
                                            document.querySelector<HTMLButtonElement>('button[value="video"]')?.click();
                                        }}
                                        disabled={videoLoading}
                                    >
                                        {videoLoading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Video className="mr-2 h-4 w-4" />
                                        )}
                                        Video
                                    </Button>
                                    <div className="w-full flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => downloadSingle(script)}
                                        >
                                            <Download className="mr-2 h-4 w-4" /> Download
                                        </Button>
                                        <Button
                                            variant={favorites.some(f => f.script === script.script) ? "default" : "outline"}
                                            size="sm"
                                            className={`flex-1 ${favorites.some(f => f.script === script.script) ? 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-500' : ''}`}
                                            onClick={() => toggleFavorite(script)}
                                        >
                                            <Star className={`mr-2 h-4 w-4 ${favorites.some(f => f.script === script.script) ? 'fill-current' : ''}`} />
                                            {favorites.some(f => f.script === script.script) ? 'Favorited' : 'Favorite'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="favorites" className="space-y-4">
                    {favorites.length === 0 ? (
                        <Card className="p-12 text-center bg-black/20 border-white/5">
                            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold mb-2">No Favorites Yet</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                Save the scripts you love by clicking the star icon in the Scripts tab.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {favorites.map((script: any, i: number) => (
                                <Card key={i} className="flex flex-col border-yellow-500/20 bg-yellow-500/5 relative group">
                                    <div className="absolute top-2 right-2 flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                            onClick={() => toggleFavorite(script)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg">{script.title}</CardTitle>
                                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 whitespace-pre-wrap text-sm text-muted-foreground font-mono bg-black/20 p-4 rounded-md mx-6 mb-4">
                                        {script.script}
                                    </CardContent>
                                    <div className="p-6 pt-0 mt-auto flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => copyToClipboard(script.script)}>
                                            <Copy className="mr-2 h-4 w-4" /> Copy
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => downloadSingle(script)}>
                                            <Download className="mr-2 h-4 w-4" /> Download
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="angles" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        {data.angles?.map((angle: any, i: number) => (
                            <Card key={i}>
                                <CardHeader>
                                    <CardTitle className="text-base">{angle.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{angle.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="video" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Video Result (Powered by GitHub ChatGPT-5)</CardTitle>
                            <CardDescription>The final video generated via GitHub Models & Hugging Face.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center min-h-[400px] bg-black/50 rounded-md border border-dashed border-white/10 m-6 relative overflow-hidden text-center">
                            {videoUrl ? (
                                <div className="w-full h-full flex flex-col items-center gap-4 p-4">
                                    <video
                                        src={videoUrl}
                                        controls
                                        className="max-w-full max-h-[500px] rounded-lg shadow-2xl border border-white/10"
                                        autoPlay
                                    />
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline">
                                            <a href={videoUrl} download="ai-video-ad.mp4">
                                                <Download className="mr-2 h-4 w-4" /> Download Video
                                            </a>
                                        </Button>
                                        <Button variant="premium" onClick={() => { setVideoUrl(null); setVideoId(null); }}>
                                            Generate New
                                        </Button>
                                    </div>
                                </div>
                            ) : videoLoading ? (
                                <div className="space-y-6 max-w-md px-6 py-12">
                                    <div className="relative">
                                        <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary font-bold">
                                            {videoProgress}%
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold">{videoStatus || "Generating Video..."}</h3>
                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${videoProgress}%` }} />
                                    </div>
                                    <p className="text-muted-foreground text-sm italic">
                                        This might take a minute as we process your request through Hugging Face's high-performance compute nodes.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-w-sm px-6">
                                    <div className="p-4 rounded-full bg-primary/10 text-primary w-fit mx-auto mb-4 scale-125">
                                        <Video className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold">No Video Generated</h3>
                                    <p className="text-muted-foreground">
                                        Go to the <b>Scripts</b> tab and click the <b>Video</b> button on any script to generate a video trailer for it using <b>GitHub ChatGPT-5</b> orchestration.
                                    </p>
                                    <div className="pt-4">
                                        <Button variant="outline" onClick={() => document.querySelector<HTMLButtonElement>('button[value="scripts"]')?.click()}>
                                            Go to Scripts
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="suggestions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Help Us Improve</CardTitle>
                            <CardDescription>We'd love to hear your suggestions for HYTEC ADD GEN.</CardDescription>
                        </CardHeader>
                        <CardContent className="max-w-xl mx-auto w-full p-8">
                            {isSuggestionSubmitted ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="h-20 w-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-6">
                                        <CheckCircle className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                                    <p className="text-muted-foreground">
                                        Your feedback has been sent successfully. We appreciate your input!
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSuggestionSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="s-email" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Email (Optional)</Label>
                                        <Input
                                            id="s-email"
                                            type="email"
                                            placeholder="alex@example.com"
                                            value={suggestionEmail}
                                            onChange={(e) => setSuggestionEmail(e.target.value)}
                                            className="bg-white/5 border-white/10 h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s-text" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Suggestions</Label>
                                        <Textarea
                                            id="s-text"
                                            required
                                            placeholder="What features would you like to see next? How can we make Hytec even better?"
                                            value={suggestionText}
                                            onChange={(e) => setSuggestionText(e.target.value)}
                                            className="min-h-[150px] bg-white/5 border-white/10 resize-none p-4"
                                        />
                                    </div>
                                    <Button type="submit" variant="premium" className="w-full h-12 text-lg uppercase font-black tracking-tighter">
                                        Send Suggestion <Send className="ml-2 h-5 w-5" />
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

        </div>
    );
}
