"use client";

import { cn } from "@/lib/utils";

type GlassCardProps = {
    className?: string;
    children: React.ReactNode;
};

export function GlassCard({ className, children }: GlassCardProps) {
    return (
        <div
            className={cn(
                "bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[32px] transition-colors duration-300",
                className
            )}
        >
            {children}
        </div>
    );
}
