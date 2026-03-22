"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Wand2, Upload, X, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { PaywallModal } from "@/components/PaywallModal";

export function AdForm() {
    const router = useRouter();
    const { user } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [userStatus, setUserStatus] = useState({ tier: 'FREE', usage: 0, limit: 1 });
    const [showPaywall, setShowPaywall] = useState(false);
    const [paywallMessage, setPaywallMessage] = useState("Upgrade to Pro to access this feature.");
    const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
    const [formData, setFormData] = useState({
        productName: "",
        productUrl: "",
        description: "",
        targetAudience: "",
        platform: "tiktok",
        tone: "casual",
    });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        if (userStatus.tier === 'FREE') {
            const proValues = ['facebook', 'professional', 'emotional', 'luxury'];
            if (proValues.includes(value)) {
                setPaywallMessage("Upgrade to Pro to unlock premium platforms and tones.");
                setShowPaywall(true);
                return;
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newImages = files.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setSelectedImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userStatus.tier === 'FREE' && userStatus.usage >= userStatus.limit) {
            setPaywallMessage("You have reached your daily limit of 3 free scripts. Upgrade to Pro for more.");
            setShowPaywall(true);
            return;
        }

        setLoading(true);

        try {
            const base64Images = await Promise.all(
                selectedImages.map(img => fileToBase64(img.file))
            );

            const response = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    images: base64Images,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("generatedAd", JSON.stringify(data));
                router.push("/dashboard/results");
            } else {
                const errData = await response.json().catch(() => ({}));
                if (errData.limitReached) {
                    setPaywallMessage(errData.error || "Daily limit reached. Upgrade for more.");
                    setShowPaywall(true);
                } else {
                    console.error("Failed to generate");
                }
            }
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto glass-card border-white/10 shadow-2xl">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
                    <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                    Create Your Campaign
                </CardTitle>
                <CardDescription className="text-base">
                    Upload your product photos and let HYTEC AI handle the rest.
                </CardDescription>
                <div className="mt-4 px-6">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground uppercase font-bold tracking-widest">Daily Credits</span>
                        <span className="font-bold">{userStatus.usage} / {userStatus.limit}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-primary transition-all duration-1000"
                            style={{ width: `${Math.min((userStatus.usage / userStatus.limit) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Product Photos & Assets</Label>
                        </div>
                        <div
                            onClick={() => {
                                fileInputRef.current?.click();
                            }}
                            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer transition-all group hover:border-primary/50 hover:bg-primary/5"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                    <Upload className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="font-medium">Click to upload product images</p>
                                    <p className="text-sm text-muted-foreground">Support JPEG, PNG, WEBP (Max 5MB each)</p>
                                </div>
                            </div>
                        </div>

                        {selectedImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {selectedImages.map((img, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                                        <Image
                                            src={img.preview}
                                            alt={`Preview ${index}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                            id="productName"
                            name="productName"
                            placeholder="e.g. Lumina Glow Serum"
                            required
                            className="bg-white/5 border-white/10 h-11"
                            value={formData.productName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Product Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="What makes your product special? Mention key features and benefits..."
                            required
                            className="min-h-[120px] bg-white/5 border-white/10 resize-none"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="targetAudience">Target Audience</Label>
                            <Input
                                id="targetAudience"
                                name="targetAudience"
                                placeholder="e.g. Gen Z skincare lovers"
                                className="bg-white/5 border-white/10 h-11"
                                value={formData.targetAudience}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Platform</Label>
                            <Select
                                value={formData.platform}
                                onValueChange={(val) => handleSelectChange("platform", val)}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 h-11">
                                    <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tiktok">TikTok</SelectItem>
                                    <SelectItem value="instagram">Instagram Reels</SelectItem>
                                    <SelectItem value="facebook">Facebook Ads (PRO)</SelectItem>
                                    <SelectItem value="youtube">YouTube Shorts</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Tone</Label>
                            <Select
                                value={formData.tone}
                                onValueChange={(val) => handleSelectChange("tone", val)}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 h-11">
                                    <SelectValue placeholder="Select tone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="casual">Casual (Free)</SelectItem>
                                    <SelectItem value="energetic">Energetic (Free)</SelectItem>
                                    <SelectItem value="witty">Witty (Free)</SelectItem>
                                    <SelectItem value="professional" className={userStatus.tier === 'FREE' ? "opacity-30" : ""}>
                                        Professional {userStatus.tier === 'FREE' && "(PRO)"}
                                    </SelectItem>
                                    <SelectItem value="emotional" className={userStatus.tier === 'FREE' ? "opacity-30" : ""}>
                                        Emotional {userStatus.tier === 'FREE' && "(PRO)"}
                                    </SelectItem>
                                    <SelectItem value="luxury" className={userStatus.tier === 'FREE' ? "opacity-30" : ""}>
                                        Luxury {userStatus.tier === 'FREE' && "(PRO)"}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-12 text-muted-foreground hover:text-primary transition-colors border border-white/5 hover:border-primary/20"
                        onClick={() => {
                            setFormData({
                                productName: "AeroPod Pro Max",
                                productUrl: "https://example.com/aeropod",
                                description: "The first transparent carbon-fiber headphones with neural noise canceling and a 100-hour battery life.",
                                targetAudience: "Audiophiles and tech enthusiasts who want the absolute best travel experience.",
                                platform: "instagram",
                                tone: "energetic",
                            });
                        }}
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Load Demo Data
                    </Button>
                    <Button type="submit" className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20" disabled={loading} variant="premium">
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generate Scripts
                    </Button>
                </CardFooter>
            </form>

            {/* Generation Overlay */}
            {loading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="max-w-md w-full p-8 text-center space-y-12">
                        {/* Animated Logo/Spinner */}
                        <div className="relative mx-auto w-32 h-32">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                            </div>
                        </div>

                        {/* Progress Messages */}
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white leading-none">
                                Generating Your <span className="text-primary italic">Viral Campaign</span>
                            </h2>
                            <p className="text-muted-foreground animate-pulse uppercase tracking-[0.2em] text-[10px] font-bold">
                                Orchestrating ChatGPT-5 Logic
                            </p>
                        </div>

                        {/* Visual Progress Steps */}
                        <div className="space-y-6">
                            {[
                                { label: "Analyzing Product Visuals", delay: "0" },
                                { label: "Crafting High-Conversion Hooks", delay: "2000" },
                                { label: "Synthesizing Direct Response Scripts", delay: "4000" },
                                { label: "Optimizing for Social Platforms", delay: "6000" }
                            ].map((step, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 text-left"
                                    style={{ animation: `fade-in 0.5s ease-out forwards ${step.delay}ms`, opacity: 0 }}
                                >
                                    <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                                    <span className="text-sm font-bold uppercase tracking-widest text-white/80">{step.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Loading Bar */}
                        <div className="space-y-2">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-primary animate-[upload-progress_10s_linear_infinite]" />
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
                                Please do not close this window • Finalizing Assets
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} userId={user?.id} message={paywallMessage} />
        </Card>
    );
}

// Add these keyframes to your global CSS or as a style block
const style = `
@keyframes upload-progress {
    0% { width: 0%; }
    100% { width: 100%; }
}
@keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

