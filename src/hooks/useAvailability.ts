"use client";

import { useCallback, useEffect, useState } from "react";

export interface BookedDate {
    start: Date;
    end: Date;
    source: string;
}

function toBookedDates(raw: any[]): BookedDate[] {
    return (raw || []).map((x) => ({
        start: new Date(x.start),
        end: new Date(x.end),
        source: String(x.source || "unknown"),
    }));
}

export function useAvailability() {
    const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        const res = await fetch("/api/availability");
        if (!res.ok) throw new Error("Availability fetch failed");
        const data = await res.json();
        setBookedDates(toBookedDates(data.bookedDates));
    }, []);

    useEffect(() => {
        (async () => {
            try {
                await refresh();
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [refresh]);

    return { bookedDates, loading, refresh };
}
