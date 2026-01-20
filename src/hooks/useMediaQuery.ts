"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

        setMatches(mql.matches);

        // Safari fallback
        if ("addEventListener" in mql) {
            mql.addEventListener("change", onChange);
        } else {
            (mql as any).addListener(onChange);
        }

        return () => {
            if ("removeEventListener" in mql) {
                mql.removeEventListener("change", onChange);
            } else {
                (mql as any).removeListener(onChange);
            }
        };
    }, [query]);

    return matches;
}
