import { differenceInDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { BookedDate } from "@/hooks/useAvailability";

export function calcNights(range?: DateRange) {
    if (!range?.from || !range?.to) return 0;
    return differenceInDays(range.to, range.from);
}

export function calcTotals(nights: number, basePrice: number, cleaningFee: number) {
    const subtotal = nights * basePrice;
    const fee = nights > 0 ? cleaningFee : 0;
    return { subtotal, cleaningFee: fee, total: subtotal + fee };
}

export function makeDisabledDays(bookedDates: BookedDate[]) {
    return [
        { before: new Date() },
        ...bookedDates.map((b) => ({ from: b.start, to: b.end })),
    ];
}
