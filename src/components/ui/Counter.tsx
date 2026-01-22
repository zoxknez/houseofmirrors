"use client";

type CounterProps = {
    value: number;
    min?: number;
    max?: number;
    onChange: (next: number) => void;
};

export function Counter({ value, min = 1, max = 99, onChange }: CounterProps) {
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                aria-label="Smanji broj"
                onClick={() => onChange(Math.max(min, value - 1))}
                className="w-9 h-9 rounded-full border border-white/10 text-white hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-300 font-bold"
            >
                -
            </button>
            <button
                type="button"
                aria-label="Povećaj broj"
                onClick={() => onChange(Math.min(max, value + 1))}
                className="w-9 h-9 rounded-full border border-white/10 text-white hover:bg-[var(--gold)] hover:text-black hover:border-[var(--gold)] transition-all duration-300 font-bold"
            >
                +
            </button>
        </div>
    );
}
