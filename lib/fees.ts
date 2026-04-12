import { getSafelyFee, OAH_FEE_RATE } from "./constants";

interface FeeInput {
  nightlyRate: number;
  numNights: number;
  cleaningFee: number;
  petFee: number;
  totRate: number; // pass 0 for monthly stays
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
  const nightlyTotal = round(input.nightlyRate * input.numNights);
  const cleaningFee = round(input.cleaningFee);
  const petFee = round(input.petFee);
  const safelyFee = getSafelyFee(input.numNights); // flat fee by stay length
  const totAmount = round(nightlyTotal * input.totRate);
  const oahFee = round(nightlyTotal * OAH_FEE_RATE);

  const grandTotal = round(
    nightlyTotal + cleaningFee + petFee + safelyFee + totAmount + oahFee
  );

  return { nightlyTotal, cleaningFee, petFee, safelyFee, totAmount, oahFee, grandTotal };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
