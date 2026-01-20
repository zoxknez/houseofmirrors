import { Hero } from "@/components/sections/Hero";
import { Gallery } from "@/components/sections/Gallery";
import { Highlights } from "@/components/sections/Highlights";
import { Amenities } from "@/components/sections/Amenities";
import { Location } from "@/components/sections/Location";
import { HouseRules } from "@/components/sections/HouseRules";
import { BookingCalendar } from "@/components/sections/BookingCalendar";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Gallery />
      <Highlights />
      <Amenities />
      <HouseRules />
      <Location />
      <BookingCalendar />
      <Contact />
    </main>
  );
}
