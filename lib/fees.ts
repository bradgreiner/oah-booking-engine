import { SAFELY_TIERS, OAH_FEE_RATE } from "./constants";

interface FeeInput {
  nightlyRate: number;
  numNights: number;
  cleaningFee: number;
  petFee: number;
  totRate: number;
}

interface FeeBreakdown {
  nightlyTotal: number;
  cleaningFee: number;
  petFee: number;
  safelyFee: number;
  totAmount: number;
  oahFee: number;
  grandTotal: number;
}

export function calculateFees(input: FeeInput): FeeBreakdown {
  const nightlyTotal = input.nightlyRate * input.numNights;
  const cleaningFee = input.cleaningFee;
  const petFee = input.petFee;

  // Safely damage protection based on nightly rate
  const safelyTier = SAFELY_TIERS.find(
    (tier) => input.nightlyRate <= tier.maxNightlyRate
  );
  const safelyFee = safelyTier?.fee ?? SAFELY_TIERS[SAFELY_TIERS.length - 1].fee;

  // TOT applies to nightly total only
  const totAmount = nightlyTotal * input.totRate;

  // OAH fee applies to nightly total
  const oahFee = nightlyTotal * OAH_FEE_RATE;

  const grandTotal =
    nightlyTotal + cleaningFee + petFee + safelyFee + totAmount + oahFee;

  return {
    nightlyTotal: round(nightlyTotal),
    cleaningFee: round(cleaningFee),
    petFee: round(petFee),
    safelyFee: round(safelyFee),
    totAmount: round(totAmount),
    oahFee: round(oahFee),
    grandTotal: round(grandTotal),
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
