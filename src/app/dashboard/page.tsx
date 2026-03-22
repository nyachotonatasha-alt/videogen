import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdForm } from "@/components/AdForm";
import { ViralIdeasForm } from "@/components/ViralIdeasForm";
import { ScriptImproverForm } from "@/components/ScriptImproverForm";
import { ThreeDayGeneratorForm } from "@/components/ThreeDayGeneratorForm";
import { UsageTab } from "@/components/UsageTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Video, Wand2, Calendar, BarChart2 } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8 text-center text-white">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        Ad Generator Studio
                    </h1>
                    <p className="text-muted-foreground/80 font-medium">Everything you need to create viral content in minutes.</p>
                </div>

                <Tabs defaultValue="ad-gen" className="w-full">
                    <div className="flex justify-center mb-8">
                        <TabsList className="grid w-full max-w-5xl grid-cols-5 bg-white/5 border border-white/10 h-14 p-1 rounded-2xl">
                            <TabsTrigger value="ad-gen" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all font-bold">
                                <Video className="h-4 w-4" />
                                Ad Generator
                            </TabsTrigger>
                            <TabsTrigger value="viral-ideas" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all font-bold">
                                <Sparkles className="h-4 w-4" />
                                Viral Ideas
                            </TabsTrigger>
                            <TabsTrigger value="script-refiner" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all font-bold">
                                <Wand2 className="h-4 w-4" />
                                Script Refiner
                            </TabsTrigger>
                            <TabsTrigger value="three-day" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all font-bold">
                                <Calendar className="h-4 w-4" />
                                3-Day Challenge
                            </TabsTrigger>
                            <TabsTrigger value="usage" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all font-bold">
                                <BarChart2 className="h-4 w-4" />
                                Usage
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="ad-gen" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8 text-center text-muted-foreground/80 italic font-medium max-w-2xl mx-auto">
                            "With men this is impossible, but with God all things are possible." <br/><span className="text-primary/80 not-italic text-sm">– Matthew 19:26</span>
                        </div>
                        <AdForm />
                    </TabsContent>

                    <TabsContent value="viral-ideas" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ViralIdeasForm />
                    </TabsContent>

                    <TabsContent value="script-refiner" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ScriptImproverForm />
                    </TabsContent>

                    <TabsContent value="three-day" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ThreeDayGeneratorForm />
                    </TabsContent>

                    <TabsContent value="usage" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <UsageTab />
                    </TabsContent>
                </Tabs>
            </main>
            <Footer />
        </div>
    );
}
