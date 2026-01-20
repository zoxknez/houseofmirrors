import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
import { Amenities } from "@/components/Amenities";
import { Location } from "@/components/Location";
import { HouseRules } from "@/components/HouseRules";
import { BookingCalendar } from "@/components/BookingCalendar";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Gallery />
      <Amenities />
      <HouseRules />
      <Location />
      <BookingCalendar />
      <Contact />
    </main>
  );
}
