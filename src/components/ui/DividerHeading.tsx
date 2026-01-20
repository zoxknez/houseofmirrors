"use client";

type DividerHeadingProps = { children: React.ReactNode };

export function DividerHeading({ children }: DividerHeadingProps) {
    return (
        <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px flex-1 max-w-[100px] md:max-w-[150px] bg-gradient-to-r from-transparent to-white/20" />
            <h3 className="text-sm md:text-base font-black uppercase tracking-[0.4em] text-white/50 text-center whitespace-nowrap">
                {children}
            </h3>
            <div className="h-px flex-1 max-w-[100px] md:max-w-[150px] bg-gradient-to-l from-transparent to-white/20" />
        </div>
    );
}
