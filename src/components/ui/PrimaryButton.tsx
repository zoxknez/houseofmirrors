"use client";

import { cn } from "@/lib/utils";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    full?: boolean;
};

export function PrimaryButton({ className, full = true, ...props }: PrimaryButtonProps) {
    return (
        <button
            {...props}
            className={cn(
                full ? "w-full" : "",
                "h-14 md:h-16 rounded-full bg-[var(--gold)] text-black font-black uppercase tracking-[0.18em] text-xs md:text-sm",
                "hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100",
                "transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)]",
                className
            )}
        />
    );
}
