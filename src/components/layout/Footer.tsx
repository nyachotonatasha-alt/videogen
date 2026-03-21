import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-black py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <Logo className="h-10 w-10 text-primary mb-4" />
                        <span className="font-bold uppercase tracking-wider text-sm">About Hytec Ad Gen</span>
                        <p className="text-sm text-muted-foreground">
                            Generate high-converting video ads in seconds using AI.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Features</Link></li>
                            <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-primary">Showcase</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-widest text-[10px]">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li>
                                <Link href="mailto:hyteccorp@gmail.com" className="hover:text-primary">Contact</Link>
                                <p className="text-[11px] text-muted-foreground mt-1">hyteccorp@gmail.com</p>
                                <p className="text-[11px] text-muted-foreground underline">wayneandkudzimoyos@gmail.com</p>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-widest text-[10px]">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Hytec Ad Gen. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
