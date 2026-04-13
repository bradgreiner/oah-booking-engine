const AIRBNB_GUEST_FEE_RATE = 0.14;
const OAH_GUEST_FEE_RATE = 0.02;

export function calculateSavings(
  nightlyRate: number,
  numNights: number,
  monthlyDiscount?: number
): { airbnbTotal: number; oahTotal: number; savings: number; savingsPct: number } | null {
  if (nightlyRate <= 0 || numNights <= 0) return null;

  const discountedRate = monthlyDiscount && monthlyDiscount > 0 && monthlyDiscount < 1
    ? nightlyRate * monthlyDiscount
    : nightlyRate;

  const accommodationTotal = discountedRate * numNights;

  // Airbnb charges ~14% guest service fee on top of accommodation
  const airbnbFee = accommodationTotal * AIRBNB_GUEST_FEE_RATE;
  const airbnbTotal = Math.round(accommodationTotal + airbnbFee);

  // OAH charges 2% platform fee
  const oahFee = accommodationTotal * OAH_GUEST_FEE_RATE;
  const oahTotal = Math.round(accommodationTotal + oahFee);

  const savings = airbnbTotal - oahTotal;
  const savingsPct = Math.round((savings / airbnbTotal) * 100);

  return savings > 0 ? { airbnbTotal, oahTotal, savings, savingsPct } : null;
}
