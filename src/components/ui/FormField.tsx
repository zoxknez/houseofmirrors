"use client";

import type { LucideIcon } from "lucide-react";

type BaseProps = {
    label: string;
    icon?: LucideIcon;
    required?: boolean;
};

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement> & { as?: "input" };
type TextareaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" };

export function FormField(props: InputProps | TextareaProps) {
    const { label, icon: Icon, required, as, className, ...rest } = props as any;

    return (
        <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 ml-1">
                {label} {required ? "*" : ""}
            </label>

            <div className="relative group">
                {Icon ? (
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[var(--gold)] transition-colors" />
                ) : null}

                {as === "textarea" ? (
                    <textarea
                        {...rest}
                        className={[
                            "w-full",
                            Icon ? "pl-12" : "pl-5",
                            "pr-4 py-4 rounded-[20px] bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-white/10",
                            "focus:outline-none focus:border-[var(--gold)] focus:bg-white/[0.05] transition-all resize-none",
                            className || "",
                        ].join(" ")}
                    />
                ) : (
                    <input
                        {...rest}
                        className={[
                            "w-full",
                            Icon ? "pl-12" : "pl-5",
                            "pr-4 py-4 rounded-[18px] bg-white/[0.03] border border-white/10 text-white font-bold placeholder:text-white/10",
                            "focus:outline-none focus:border-[var(--gold)] focus:bg-white/[0.05] transition-all",
                            className || "",
                        ].join(" ")}
                    />
                )}
            </div>
        </div>
    );
}
