import { stfiRates, eqRates, terrorismRates, DEFAULT_TERRORISM_RATE } from '../data/dataManager';
import type { Occupancy, PincodeData } from '../data/dataManager';

export interface QuoteInputs {
  buildingSI: number;
  pmSI: number;
  stocksSI: number;
  discount: number;
  includeTerrorism: boolean;
  occupancy: Occupancy | null;
  pincode: PincodeData | null;
}

export interface QuoteResult {
  policyType: string;
  totalSI: number;
  netFlexaRate: number;
  stfiRate: number;
  eqRate: number;
  terrorismRate: number;
  netRate: number;
  flexaPremium: number;
  stfiPremium: number;
  eqPremium: number;
  terrorismPremium: number;
  netPremium: number;
  gst: number;
  totalPremium: number;
}

export function calculateQuote(inputs: QuoteInputs): QuoteResult | null {
  const { buildingSI, pmSI, stocksSI, discount, includeTerrorism, occupancy, pincode } = inputs;

  if (!occupancy || !pincode) return null;

  const totalSI = buildingSI + pmSI + stocksSI;
  if (totalSI <= 0) return null;

  // Policy Classification
  let policyType = "Standard Fire & Special Perils";
  const siInCr = totalSI / 10000000;
  if (siInCr <= 5) {
    policyType = "Bharat Sookshma Udyam Suraksha";
  } else if (siInCr <= 50) {
    policyType = "Bharat Laghu Udyam Suraksha";
  }

  const categoryCode = occupancy.categoryCode;
  const eqZone = pincode.eqZone;

  // Rates
  const flexaRate = occupancy.flexaRate;
  const clampedDiscount = Math.min(discount, 80);
  const netFlexaRate = flexaRate * (1 - clampedDiscount / 100);

  const stfiRate = stfiRates[categoryCode] || 0;
  const eqRate = eqRates[categoryCode]?.[eqZone] || 0;
  const terrorismRate = includeTerrorism ? (terrorismRates[categoryCode] || DEFAULT_TERRORISM_RATE) : 0;

  const netRate = netFlexaRate + stfiRate + eqRate + terrorismRate;

  // Premiums (Rate is per 1000 SI)
  const flexaPremium = (totalSI * netFlexaRate) / 1000;
  const stfiPremium = (totalSI * stfiRate) / 1000;
  const eqPremium = (totalSI * eqRate) / 1000;
  const terrorismPremium = (totalSI * terrorismRate) / 1000;

  const netPremium = flexaPremium + stfiPremium + eqPremium + terrorismPremium;
  const gst = netPremium * 0.18;
  const totalPremium = netPremium + gst;

  return {
    policyType,
    totalSI,
    netFlexaRate,
    stfiRate,
    eqRate,
    terrorismRate,
    netRate,
    flexaPremium,
    stfiPremium,
    eqPremium,
    terrorismPremium,
    netPremium,
    gst,
    totalPremium,
  };
}
