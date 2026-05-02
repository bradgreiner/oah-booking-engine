import { fetchCalendar, type HostawayCalendarDay } from "./hostaway";
import { unstable_cache } from "next/cache";

export type CalendarDay = {
  date: string;
  price: number;
  isAvailable: boolean;
  status: string;
  minimumStay: number;
};

function normalize(raw: HostawayCalendarDay[]): CalendarDay[] {
  return raw.map((d) => ({
    date: String(d.date),
    price: Number(d.price ?? 0),
    isAvailable: Number(d.isAvailable) === 1,
    status: "available",
    minimumStay: Number(d.minimumStay ?? 1),
  }));
}

async function fetchCalendarRaw(
  listingId: number,
  startDate: string,
  endDate: string
): Promise<CalendarDay[]> {
  const raw = await fetchCalendar(listingId, startDate, endDate);
  return normalize(raw);
}

export const getListingCalendar = (
  listingId: number,
  startDate: string,
  endDate: string
): Promise<CalendarDay[]> => {
  return unstable_cache(
    () => fetchCalendarRaw(listingId, startDate, endDate),
    ["listing-calendar", String(listingId), startDate, endDate],
    { revalidate: 3600, tags: ["calendar"] }
  )();
};

export async function getMinimumNightlyRate(
  listingId: number
): Promise<number | null> {
  const today = new Date().toISOString().slice(0, 10);
  const sixtyDays = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  try {
    const days = await getListingCalendar(listingId, today, sixtyDays);
    const prices = days
      .filter((d) => d.isAvailable && d.price > 0)
      .map((d) => d.price);
    if (prices.length === 0) return null;
    return Math.min(...prices);
  } catch {
    return null;
  }
}

export async function getStayPriceBreakdown(
  listingId: number,
  checkIn: string,
  checkOut: string
): Promise<{
  nightlyPrices: { date: string; price: number }[];
  subtotal: number;
  averageNightly: number;
  nights: number;
}> {
  const days = await getListingCalendar(listingId, checkIn, checkOut);
  const stayDays = days.filter((d) => d.date >= checkIn && d.date < checkOut);
  const nightlyPrices = stayDays.map((d) => ({ date: d.date, price: d.price }));
  const subtotal = nightlyPrices.reduce((sum, d) => sum + d.price, 0);
  const nights = nightlyPrices.length;
  return {
    nightlyPrices,
    subtotal,
    averageNightly: nights > 0 ? Math.round(subtotal / nights) : 0,
    nights,
  };
}
