import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BLOG_POSTS = [
    {
        id: 1,
        title: "The 3 Hooks That Are Printing Money on TikTok in 2024",
        excerpt: "Discover the exact scroll-stopping patterns that increased CTR by 400% for top eCommerce brands this quarter.",
        date: "Feb 15, 2026",
        readTime: "5 min",
        author: "Hytec Strategy Team",
        category: "Strategy",
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "How Sora-2 is Changing the Game for DTC Video Ads",
        excerpt: "Why you no longer need a production crew to create cinematic, high-conversion video trailers for your Shopify store.",
        date: "Feb 10, 2026",
        readTime: "8 min",
        author: "Tech Insights",
        category: "AI Technology",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Stop Overthinking Your Ad Copy: Let Patterns Do the Work",
        excerpt: "The psychological reason why 'perfect' scripts often fail, and why algorithmic patterns are more reliable.",
        date: "Feb 05, 2026",
        readTime: "4 min",
        author: "Copy Lab",
        category: "Psychology",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"
    }
];

export default function BlogPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero section */}
                <section className="py-20 bg-primary/5">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
                            Hytec <span className="text-primary italic">Blog</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Insights, strategy, and trends to help you scale your ad performance using the latest in AI technology.
                        </p>
                    </div>
                </section>

                {/* Blog Posts Grid */}
                <section className="py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {BLOG_POSTS.map((post) => (
                                <article key={post.id} className="group flex flex-col glass-card rounded-2xl border-white/5 overflow-hidden border-white/5 hover:border-primary/20 transition-all">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-primary/90 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col space-y-4">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                                        </div>
                                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="pt-4 flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                                    <User className="h-3 w-3 text-primary" />
                                                </div>
                                                <span className="text-xs font-medium text-muted-foreground uppercase">{post.author}</span>
                                            </div>
                                            <Link href="#" className="text-primary font-bold text-xs uppercase tracking-widest flex items-center hover:gap-2 transition-all">
                                                Read More <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
