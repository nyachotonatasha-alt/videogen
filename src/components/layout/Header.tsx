"use client";

import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/Logo";

export function Header() {
    const { isSignedIn } = useUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 dark:border-white/10 bg-background/80 backdrop-blur-xl transition-colors duration-300">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2 group">
                    <Logo className="h-9 w-9 text-primary transition-transform duration-300 group-hover:scale-110" />
                    <h3 className="text-xl font-black tracking-tighter uppercase">Hytec Ad Gen</h3>
                </Link>
                <nav className="flex items-center space-x-2 md:space-x-6">
                    <ThemeToggle />
                    <div className="flex items-center space-x-4">
                        {isSignedIn ? (
                            <>
                                <Link href="/pricing">
                                    <Button variant="ghost" size="sm">
                                        Pricing
                                    </Button>
                                </Link>
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm">
                                        Dashboard
                                    </Button>
                                </Link>
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "h-8 w-8 ring-2 ring-primary/20",
                                        }
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <Link href="/demo">
                                    <Button variant="ghost" size="sm">
                                        Quick Demo
                                    </Button>
                                </Link>
                                <SignInButton mode="modal">
                                    <Button variant="premium" size="sm" className="space-x-2">
                                        <span>Get Started</span>
                                        <Sparkles className="h-4 w-4" />
                                    </Button>
                                </SignInButton>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
