import { stfiRates, eqRates, terrorismRates, DEFAULT_TERRORISM_RATE } from '../data/dataManager';
import type { Occupancy, PincodeData } from '../data/dataManager';

export interface QuoteInputs {
  buildingSI: number;
  pmSI: number;
  furnitureSI: number;
  stocksSI: number;
  otherSI: number; // New field for other assets
  discount: number;
  includeTerrorism: boolean;
  occupancy: Occupancy | null;
  pincode: PincodeData | null;
  // Underwriting Fields
  isRenewal: boolean;
  hasClaims: boolean;
  pastPremium: number;
  pastClaims: number;
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
  // Underwriting Result
  claimRatio: number;
  isBlocked: boolean;
}

export function calculateQuote(inputs: QuoteInputs): QuoteResult | null {
  const { 
    buildingSI, pmSI, furnitureSI, stocksSI, otherSI, 
    discount, includeTerrorism, occupancy, pincode,
    isRenewal, hasClaims, pastPremium, pastClaims
  } = inputs;

  if (!occupancy || !pincode) return null;

  const totalSI = buildingSI + pmSI + furnitureSI + stocksSI + otherSI;
  if (totalSI <= 0) return null;

  // Underwriting Gatekeeper: 70% Claim Ratio Rule
  let claimRatio = 0;
  let isBlocked = false;

  if (isRenewal && hasClaims) {
    if (pastPremium > 0) {
      claimRatio = (pastClaims / pastPremium) * 100;
      if (claimRatio > 70) {
        isBlocked = true;
      }
    } else if (pastClaims > 0) {
      // If claims exist but no premium recorded (edge case), block it
      claimRatio = 100;
      isBlocked = true;
    }
  }

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
    claimRatio,
    isBlocked
  };
}
