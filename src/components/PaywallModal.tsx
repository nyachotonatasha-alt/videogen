"use client";

import { X, Zap } from "lucide-react";

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | undefined;
    message?: string;
}

export function PaywallModal({ isOpen, onClose, userId, message = "Upgrade to Pro to access this feature." }: PaywallModalProps) {
    if (!isOpen) return null;

    const checkoutUrl = `https://hytecadgen.lemonsqueezy.com/checkout/buy/ea7e79ca-2ea7-41e5-ae2b-b9ee2046b9e9?checkout[custom][userId]=${userId || ''}`;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md bg-neutral-900 border border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xl shadow-primary/10 m-4">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                        <Zap className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-white">Upgrade Required</h2>
                    <p className="text-neutral-300 font-medium">{message}</p>
                    <p className="text-sm text-neutral-500 pb-4">
                        Get unlimited generations, professional tones, multi-platform optimizations, and priority support.
                    </p>
                    <div className="w-full flex flex-col gap-3">
                        <a href={checkoutUrl} className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                            <Zap className="h-4 w-4" /> Upgrade to Pro
                        </a>
                        <button onClick={onClose} className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
