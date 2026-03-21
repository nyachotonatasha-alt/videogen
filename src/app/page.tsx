import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, DollarSign, Target, HelpCircle, BookOpen, Users, CheckCircle2, ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 md:px-6 lg:py-32">
          <div className="container mx-auto relative z-10 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              AI-Powered Video Ads 2.0
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 via-white to-neutral-500 dark:from-neutral-100 dark:via-white dark:to-neutral-400">Viral Video Ads</span> <br className="hidden md:block" />
              in Seconds with AI
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
              Transform product URLs into high-converting video scripts, hooks, and visuals optimized for TikTok, Instagram, and Facebook. Stop guessing, start converting.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" variant="premium" className="h-12 px-8 text-lg w-full sm:w-auto">
                  Start Generating Used Free <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto">
                  View Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none" />
        </section>

        {/* About Us Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-6 text-left">
                <div className="inline-flex items-center space-x-2 text-primary">
                  <span className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5" />
                  </span>
                  <span className="font-bold uppercase tracking-wider text-sm">About Hytec Ad Gen</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                  Empowering Creators with <span className="text-primary italic">AI Precision.</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Hytec Add Gen was born out of a simple problem: eCommerce founders and content creators spend too much time overthinking their ad scripts. We built an AI engine that doesn't just "write"—it strategizes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {[
                    "Direct Response Focused",
                    "Multi-Platform Native",
                    "Visual Asset Analysis",
                    "Viral Psychology Hooks"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full lg:max-w-md">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative glass-card border-white/10 p-8 rounded-2xl space-y-6">
                    <h3 className="text-xl font-bold">Our Philosophy</h3>
                    <p className="text-sm text-muted-foreground italic leading-loose">
                      "Creativity is messy. Strategy should be scientific. We bridge the gap by automating the analytical side of ad creation so you can focus on the big picture."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary italic">H</div>
                      <div>
                        <p className="text-sm font-bold uppercase">The Hytec Team</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Built for Performers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How To Use Section */}
        <section className="py-24 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center space-x-2 text-primary font-bold uppercase tracking-widest text-xs">
                <BookOpen className="h-4 w-4" />
                <span>You are currently viewing a Live Demo. These results were generated by Hytec Ad Gen.</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">How to use Hytec Ad Gen</h2>
              <p className="text-muted-foreground text-lg">
                Go from a product URL to winning ad assets in under 60 seconds.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Input Product Data",
                  desc: "Paste your product URL or upload high-quality product photos. Our AI vision analyzes colors, angles, and key selling points automatically."
                },
                {
                  step: "02",
                  title: "Select Your Tone",
                  desc: "Choose from Casual, Professional, or Energetic. Our engine adapts the emotional triggers to match your brand's unique personality."
                },
                {
                  step: "03",
                  title: "Download & Deploy",
                  desc: "Get 5 script variations, 10 viral hooks, 5 angles, and 30 social captions. Ready for you to film or use with our AI video renderer."
                }
              ].map((step, i) => (
                <div key={i} className="relative group">
                  <div className="text-8xl font-black text-white/5 absolute -top-8 -left-4 group-hover:text-primary/10 transition-colors pointer-events-none">{step.step}</div>
                  <div className="relative space-y-4 p-6">
                    <h3 className="text-xl font-bold uppercase tracking-tight">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 border-b border-white/5 bg-black/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/3">
                <div className="sticky top-24">
                  <h2 className="text-4xl font-black tracking-tighter uppercase mb-6">Frequently <br /> Asked <span className="text-primary italic">Questions</span></h2>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Everything you need to know about scaling your ads with Hytec.
                  </p>
                  <Button variant="outline" className="rounded-full">Support Center</Button>
                </div>
              </div>
              <div className="lg:w-2/3 space-y-4">
                {[
                  {
                    q: "Which platforms are supported?",
                    a: "We specialize in TikTok, Instagram Reels, and YouTube Shorts (9:16 vertical video). Our AI is specifically trained on viral performance data from these platforms."
                  },
                  {
                    q: "Can I use the scripts for static ads?",
                    a: "Absolutely! While built for video, our hooks and CTAs are highly effective for Facebook feed ads and Instagram carousel copy."
                  },
                  {
                    q: "Do I need technical skills to use the AI Vision?",
                    a: "Not at all. Just drag and drop your product photos. Our AI analyzes the visual context, lighting, and product features to create more accurate scripts."
                  },
                  {
                    q: "How often are the AI models updated?",
                    a: "We update our prompts and training data weekly based on trending social media ad frameworks (like UGC, Green-screens, and Fast-cut styles)."
                  }
                ].map((faq, i) => (
                  <details key={i} className="group glass-card border-white/5 rounded-2xl p-6 open:bg-primary/5 transition-all duration-300">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <span className="text-lg font-bold tracking-tight uppercase pr-8">{faq.q}</span>
                      <ChevronDown className="h-5 w-5 text-primary group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="mt-4 pt-4 border-t border-white/5 text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
