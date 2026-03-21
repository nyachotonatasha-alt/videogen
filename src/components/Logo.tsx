import React from "react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-8 w-8", className)}
            fill="none"
        >
            {/* Outer Hexagon with rounded corners and thick stroke */}
            <path
                d="M50 8L86.37 29V71L50 92L13.63 71V29L50 8Z"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinejoin="round"
            />

            {/* Dynamic Circuit Traces matching the image angle */}
            {/* Top Trace */}
            <path
                d="M30 45 L45 30 H60"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="68" cy="30" r="5" fill="currentColor" />

            {/* Middle Trace */}
            <path
                d="M35 60 L50 45 H65"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="73" cy="45" r="5" fill="currentColor" />

            {/* Bottom Trace */}
            <path
                d="M45 75 L60 60 H70"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Angled termination for the bottom one as seen in image */}
            <path
                d="M70 60 L80 70"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
            />
        </svg>
    );
}
